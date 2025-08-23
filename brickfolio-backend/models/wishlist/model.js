import mongoose from "mongoose";

export const WishlistSchema = new mongoose.Schema(
  {
    investor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Investor user
      required: true,
    },
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "targetModel", // dynamic reference
    },
    targetModel: {
      type: String,
      required: true,
      enum: ["Project", "User"], 
      // "Project" for project wishlists, "User" for developers
    },
  },
  { timestamps: true }
);

export const Wishlist = mongoose.model("Wishlist", WishlistSchema);
