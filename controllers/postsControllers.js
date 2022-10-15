import mongoose from "mongoose";
import postModel from "../models/postModel.js";

export const getPosts = async (req, res) => {
  try {
    const posts = await postModel.find();
    if (posts) {
      res.status(201).json(posts);
    }
  } catch (error) {
    res.status(409).json({
      message: error.message,
    });
  }
};

export const createPost = async (req, res) => {
  try {
    console.log(req.body);
    const post = await postModel.create(req.body);
    if (post) {
      res.status(201).json(post);
    }
  } catch (error) {
    res.status(409).json({
      message: error.message,
    });
  }
};

export const getPostById = async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).send("No Post with this id")
    }
    const post = await postModel.findById(id);
    // console.log("post:",post)
    if (post) {
      res.status(201).json(post);
    }
  } catch (error) {
    res.status(409).json({
      message: error.message,
    });
  }
};

export const deletePost = async (req, res) => {
  try {
    // const id=req.params.id;
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).send("No Post with this id")
    }
    const post = await postModel.findById(req.params.id);
    if (!post) {
      return res.status(404).send("No Post with this id")
    }
    const deletedPost = await postModel.deleteOne({ _id: id })
    console.log("deletedPost:", deletedPost)
    if (deletedPost.acknowledged === true) {
      res.status(201).json({ message: "Post has been deleted" });
    } else {
      return res.status(404).send("Post cannot be deleted")
    }
  } catch (error) {
    res.status(409).json({
      message: error.message,
    });
  }
};

export const likePost = async (req, res) => {
  try {
    // const id=req.params.id;
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).send("No Post with this id")
    }
    let post = await postModel.findById(req.params.id);
    if (!post) {
      return res.status(404).send("No Post with this id")
    }

    const updatedPost = await postModel.findByIdAndUpdate(id, { likeCount: post.likeCount + 1 }, { new: true })

    if (updatedPost) {
      res.status(201).json(updatedPost);
    } else {
      return res.status(404).send("Post cannot be updated")
    }
  } catch (error) {
    res.status(409).json({
      message: error.message,
    });
  }
};
export const updatePost = async (req, res) => {
  try {
    // const id=req.params.id;
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).send("No Post with this id")
    }
    let post = await postModel.findById(req.params.id);
    if (!post) {
      return res.status(404).send("No Post with this id")
    }

    const updatedPost = await postModel.findByIdAndUpdate(id, req.body, { new: true })

    if (updatedPost) {
      res.status(201).json(updatedPost);
    } else {
      return res.status(404).send("Post cannot be updated")
    }
  } catch (error) {
    res.status(409).json({
      message: error.message,
    });
  }
};