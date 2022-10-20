import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import userModel from "../models/userModel.js"
// require("dotenv").config()
import dotenv from "dotenv"
dotenv.config()
const secretKey = process.env.SECRET_KEY

export const signin = async (req, res) => {
    try {

        const { email, password } = req.body;
        const existingUser = await userModel.findOne({ email });
       
        if (!existingUser) {
            return res.status(404).json({
                message: "User does not exist with this email address"
            })
        }

        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
        
        
        if (!isPasswordCorrect) {
            return res.status(404).json({
                message: "Invalid Credentials"
            })
        }

        //JWT token

        const token = jwt.sign({ email: existingUser.email, id: existingUser._id }, secretKey, { expiresIn: "1h" })

        res.status(200).json({
            result: existingUser,
            token
        })

    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
            error: error.message
        })
    }

}

export const signup = async (req, res) => {
    const { email, password, firstName, lastName, confirmPassword } = req.body
    try {
        const existingUser = await userModel.findOne({ email });

        if (existingUser) {
            return res.status(404).json({
                message: "User with this email address already exists",
            })
        }

        if (password !== confirmPassword) {
            return res.status(400).json({
                message: "Password and Confirm Password does not match",
            })
        }

        const hashPassword = await bcrypt.hash(password, 12);

        const user = await userModel.create({ email, password: hashPassword, name: `${firstName} ${lastName}` });

        //JWT token

        const token = jwt.sign({ email: user.email, id: user._id }, secretKey, { expiresIn: "1h" })


        res.status(200).json({
            result: user,
            token
        })

    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
            error: error.message
        })
    }
}