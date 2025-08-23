import express from "express";
import { News } from "../models/index.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const body = req.body;
    if (Array.isArray(body)) {
      if (body.length === 0) {
        return res.status(400).json({
          success: false,
          message: "News array cannot be empty",
        });
      }

      const newsList = await News.insertMany(body);

      return res.status(201).json({
        success: true,
        message: `${newsList.length} news items created successfully`,
      });
    }

    const { title, category, description, images, author, tags, isFeatured } =
      body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: "Title and description are required",
      });
    }

    await News.create({
      title,
      category,
      description,
      images,
      author,
      tags,
      isFeatured,
    });

    res.status(201).json({
      success: true,
      message: "News created successfully"
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const { page = 1, limit = 10, search, category, isFeatured } = req.query;

    let filter = {};

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (category) filter.category = category;
    if (isFeatured) filter.isFeatured = isFeatured === "true";

    const news = await News.find(filter)
      .sort({ publishedAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await News.countDocuments(filter);

    res.json({
      success: true,
      message: "News fetched successfully",
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit),
      news,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const news = await News.findById(req.params.id);

    if (!news) {
      return res.status(404).json({
        success: false,
        message: "News not found",
      });
    }

    res.json({
      success: true,
      news,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

export default router;
