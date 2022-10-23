import express from "express";

import { createPost, getPosts, getPostById, updatePost, deletePost, likePost, commentPost, getPostsBySearch } from "../controllers/postsControllers.js";

import { auth } from "../middleware/authMiddleware.js"

const postRoutes = express.Router();
postRoutes.route("/:id/commentPost").patch(commentPost)
postRoutes.route("/search").get(getPostsBySearch)
postRoutes.route("/:id").get(getPostById)
postRoutes.route("/").get(getPosts);
postRoutes.use(auth)

postRoutes.route("/:id/likePost").patch(likePost)
postRoutes.route("/:id").patch(updatePost).delete(deletePost);
postRoutes.route("/").post(createPost);

export default postRoutes;
