import express from "express";
import { createPost, getPosts, getPostById, updatePost, deletePost,likePost } from "../controllers/postsControllers.js";

const postRoutes = express.Router();

postRoutes.route("/:id/likePost").patch(likePost)
postRoutes.route("/:id").get(getPostById).patch(updatePost).delete(deletePost);
postRoutes.route("/").get(getPosts).post(createPost);

export default postRoutes;