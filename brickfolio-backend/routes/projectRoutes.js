import express from "express";
import { Project, User } from "../models/index.js";
import { authenticateToken } from "../middleware/authenticate.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const project = await Project.create(req.body);

    // Optional: link project to developer (User with role = "developer")
    if (req.body.developerId) {
      await User.findOneAndUpdate(
        { _id: req.body.developerId, role: "developer" },
        { $push: { "profile.projects": project._id } } // assuming developer profile has projects array
      );
    }

    res.status(201).json({
      success: true,
      message: "Project created successfully"
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      roi,
      rating,
      category,
      completionYear,
      completionQuarter,
      minPrice,
      maxPrice,
    } = req.query;

    let filter = {};

    if (search) {
      filter.$or = [
        { projectName: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
      ];
    }

    if (roi) filter.roi = { $gte: Number(roi) };
    if (rating) filter.rating = { $gte: Number(rating) };
    if (category) filter.category = { $in: [category] };
    if (completionYear) filter["completion.year"] = Number(completionYear);
    if (completionQuarter) filter["completion.quarter"] = completionQuarter;
    if (minPrice || maxPrice) {
      filter["price.value"] = {};
      if (minPrice) filter["price.value"].$gte = Number(minPrice);
      if (maxPrice) filter["price.value"].$lte = Number(maxPrice);
    }

    const projects = await Project.find(filter)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 })

    const total = await Project.countDocuments(filter);

    res.json({
      success: true,
      message: "Projects fetched successfully",
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit),
      projects,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate({
        path: "developer",
        select: "name email phone country city developerProfile", // select fields you want
      });

    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }

    res.json({ success: true, project });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post("/bulk", async (req, res) => {
  try {
    const { projects } = req.body;

    if (!Array.isArray(projects) || projects.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide an array of projects",
      });
    }

    const projectsWithDev = projects.map((proj) => {
      const developerId = proj.developer;
      return {
        ...proj,
        developer: developerId,
      };
    });

    const createdProjects = await Project.insertMany(projectsWithDev);

    const developerUpdates = {};
    createdProjects.forEach((proj) => {
      if (!developerUpdates[proj.developer])
        developerUpdates[proj.developer] = [];
      developerUpdates[proj.developer].push(proj._id);
    });

    for (const devId in developerUpdates) {
      await User.findByIdAndUpdate(devId, {
        $push: {
          "developerProfile.projects": { $each: developerUpdates[devId] },
        },
      });
    }

    res.status(201).json({
      success: true,
      message: `${createdProjects.length} projects created successfully`
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
