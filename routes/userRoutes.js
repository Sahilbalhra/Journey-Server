import express from 'express';
import {signin,signup} from "../controllers/usersControllers.js";

const userRoutes=express.Router()

userRoutes.route("/signin").post(signin)
userRoutes.route("/signup").post(signup)

export default userRoutes