import mongoose from "mongoose"

const CommentSchema = new mongoose.Schema({
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
})

const PhotoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, required: true },
  likes: { type: Number, default: 0 },
  comments: [CommentSchema],
  createdAt: { type: Date, default: Date.now },
})

export default mongoose.models.Photo || mongoose.model("Photo", PhotoSchema)
