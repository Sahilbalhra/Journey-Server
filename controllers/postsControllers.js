import mongoose from "mongoose";
import postModel from "../models/postModel.js";

export const getPosts = async (req, res) => {
  const { page } = req.query;

  try {
    const LIMIT = 6;
    const startIndex = (Number(page) - 1) * LIMIT
    const total = await postModel.countDocuments({})
    const posts = await postModel.find().sort({ _id: -1 }).limit(LIMIT).skip(startIndex);
    if (posts) {
      res.status(201).json({ data: posts, currentPage: Number(page), numberOfPages: Math.ceil(total / LIMIT) });
    }
  } catch (error) {
    res.status(409).json({
      message: error.message,
    });
  }
};

// export const createPost = async (req, res) => {
//   try {
//     // console.log(req.body);
//     const post = await postModel.create(req.body);
//     if (post) {
//       res.status(201).json(post);
//     }
//   } catch (error) {
//     res.status(409).json({
//       message: error.message,
//     });
//   }
// };
export const createPost = async (req, res) => {

  const post = req.body

  const newPost = new postModel({ ...post, creator: req.userId, createdAt: new Date().toISOString() });
  try {
    // console.log(req.body);
    await newPost.save()
    res.status(201).json(post);
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
  const id = req.params.id
  // console.log("post id:",id)
  try {
    // checking user authentication
    if (!req.userId) {
      return res.status(400).json({
        message: "user is not authorized"
      })
    };

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).send("No Post with this id")
    }

    let post = await postModel.findById(req.params.id);
    if (!post) {
      return res.status(404).send("No Post with this id")
    }

    const index = post.likes.findIndex(id => id === String(req.userId));

    if (index === -1) {
      //linke the post
      post.likes.push(req.userId)
    } else {
      //dislike
      post.likes = post.likes.filter(id => id !== String(req.userId));
    }

    const updatedPost = await postModel.findByIdAndUpdate(post._id, post, { new: true })

    if (updatedPost) {
      res.status(201).json(updatedPost);
    } else {
      return res.status(404).send("Post cannot be liked")
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

export const getPostsBySearch = async (req, res) => {
  const { searchQuery, tags } = req.query
  try {
    const title = new RegExp(searchQuery, 'i');
    const posts = await postModel.find(
      {
        $or: [{ title }, { tags: { $in: tags.split(',') } }]
      }
    )
    res.json({
      data: posts
    })

  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}

export const commentPost = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("commenr id:",id)
    const { value } = req.body;
    console.log("value:",value)
    const post = await postModel.findById(id);
    post.comments.push(value)
    const updatedPost = await postModel.findByIdAndUpdate(id, post, { new: true })
    if(!updatePost){
      res.json({
        message:"connot comment the post"
      })
    }
      // console.log("updated post",updatedPost)
    res.send(updatedPost)
  } catch (error) {
    console.log("in comment post")
    res.status(404).json({ message: error.message })
  }
}