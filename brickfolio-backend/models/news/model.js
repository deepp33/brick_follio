import mongoose from "mongoose";

export const newsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    category: [
      {
        type: String,
      },
    ],
    description: {
      type: String,
      required: true,
      trim: true,
    },
    images: [
      {
        type: String,
      },
    ],
    publishedAt: {
      type: Date,
      default: Date.now,
    },
    author: {
      type: String,
      default: "Admin",
    },
    tags: [
      {
        type: String, // e.g., ["Dubai", "Real Estate", "Q4 2024"]
      },
    ],
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const News = mongoose.model("News", newsSchema);
