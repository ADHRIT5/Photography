import mongoose from "mongoose"

const ProfileSchema = new mongoose.Schema({
  profileImageUrl: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

// Update the updatedAt field before saving
ProfileSchema.pre("save", function (next) {
  this.updatedAt = new Date()
  next()
})

export default mongoose.models.Profile || mongoose.model("Profile", ProfileSchema)
