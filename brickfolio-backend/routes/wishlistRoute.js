import express from "express";
import { Wishlist } from "../models/index.js";
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { investor, targetId, targetModel } = req.body;

    if (!investor || !targetId || !targetModel) {
      return res.status(400).json({
        success: false,
        message: "Investor, targetId, and targetModel are required",
      });
    }

    // Prevent duplicates
    const exists = await Wishlist.findOne({ investor, targetId, targetModel });
    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Already in wishlist",
      });
    }

    const wishlist = await Wishlist.create({ investor, targetId, targetModel });

    res.status(201).json({
      success: true,
      message: "Added to wishlist",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const wishlistItem = await Wishlist.findById(req.params.id);

    if (!wishlistItem) {
      return res.status(404).json({
        success: false,
        message: "Wishlist item not found",
      });
    }

    await Wishlist.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Removed from wishlist",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get("/:investorId", async (req, res) => {
  try {
    const { investorId } = req.params;
    const { page = 1, limit = 10, search } = req.query;

    let filter = { investor: investorId };

    // Get all wishlist items for investor
    let query = Wishlist.find(filter).populate({
      path: "targetId",
      select:
        "projectName location price developer category name email country city developerProfile",
      populate: {
        path: "developer",
        select: "name email phone country city developerProfile",
      },
    });

    let wishlist = await query;

    // 🔎 Apply search (filter in-memory since we have mixed models)
    if (search) {
      const searchRegex = new RegExp(search, "i");
      wishlist = wishlist.filter((item) => {
        const t = item.targetId;
        return (
          (t.projectName && searchRegex.test(t.projectName)) ||
          (t.name && searchRegex.test(t.name)) || // developer name
          (t.location && searchRegex.test(t.location)) ||
          (t.category && t.category.some((c) => searchRegex.test(c)))
        );
      });
    }

    // 📌 Pagination
    const total = wishlist.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + Number(limit);
    const paginated = wishlist.slice(startIndex, endIndex);

    res.json({
      success: true,
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit),
      wishlist: paginated,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
