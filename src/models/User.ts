import mongoose, { Schema, models } from "mongoose";

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  image: { type: String },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  profile: {
    educationLevel: { type: String, default: "" },
    fieldOfStudy: { type: String, default: "" },
    state: { type: String, default: "" },
    caste: { type: String, enum: ["General", "OBC", "SC", "ST", "EWS", "Other"], default: "" },
    phone: { type: String }
  },
  bookmarks: [{ type: Schema.Types.ObjectId, ref: "Scholarship" }],
  createdAt: { type: Date, default: Date.now }
});

export const User = models.User || mongoose.model("User", UserSchema);
