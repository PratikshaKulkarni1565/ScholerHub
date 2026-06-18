import mongoose, { Schema, models } from "mongoose";

const ScholarshipSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    eligibility: {
      educationLevel: [{ type: String }],
      fieldOfStudy: [{ type: String }],
      states: [{ type: String }],
      minPercentage: { type: Number },
      incomeLimit: { type: Number }
    },
    amount: { type: String, required: true },
    benefits: { type: String, default: "" },
    deadline: { type: Date, required: true },
    category: {
      type: String,
      enum: ["Government", "State Government", "Private", "International"],
      required: true
    },
    location: {
      type: String,
      enum: ["India", "Abroad", "Both"],
      default: "India"
    },
    provider: { type: String, required: true },
    link: { type: String, required: true },
    featured: { type: Boolean, default: false },
    howToApply: [{ type: String }]
  },
  { timestamps: true }
);

ScholarshipSchema.index({ title: "text", description: "text" });

export const Scholarship =
  models.Scholarship || mongoose.model("Scholarship", ScholarshipSchema);
