import mongoose from "mongoose"

const ProfileSchema = new mongoose.Schema({
  profileImageUrl: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

export default mongoose.models.Profile || mongoose.model("Profile", ProfileSchema)
