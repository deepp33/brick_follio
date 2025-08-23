import mongoose from "mongoose";

export const ProjectSchema = new mongoose.Schema(
  {
    projectName: {
      type: String,
      required: true, // e.g. "Marina Heights Tower"
    },
    location: {
      type: String,
      required: true, // e.g. "Dubai Marina"
    },
    developer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    description: {
      type: String,
    },
    amenities: {
      type: [String], // e.g., ["Gym", "Pool", "Park"]
      default: [],
    },
    constructionProgress: {
      type: Number, // e.g., 50 for 50% completed
      default: 0,
    },
    priceRange: {
      min: { type: Number },
      max: { type: Number },
      currency: { type: String, default: "AED" },
    },
    handoverDate: {
      type: Date, // full handover date
    },
    paymentPlan: {
      type: [String], // e.g., ["Cash", "Installments", "Mortgage"]
      default: [],
    },
    unitsAvailable: {
      type: String, // e.g., "2/150" (sold/total)
    },
    category: {
      type: [String], // e.g., ["Premium", "Sea View"]
      default: [],
    },
    roi: {
      type: Number, // Return on investment (%)
      required: true,
    },
    rentalYield: {
      type: Number,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
    },
    completion: {
      quarter: { type: String },
      year: { type: Number },
    },
    images: {
      type: [String],
      default: [],
    },
    price: {
      currency: { type: String, default: "AED" },
      value: { type: Number, required: true },
      formatted: { type: String },
    },
  },
  { timestamps: true }
);

export const Project = mongoose.model("Project", ProjectSchema);
