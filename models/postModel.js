import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  name:{ type: String},
  creator: { type: String },
  tags: { type: [String] },
  selectedFile: { type: String, required: true },
  likes: {
    type: [String],
    default: [],
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

const postModel = mongoose.model("post", postSchema);

export default postModel;
