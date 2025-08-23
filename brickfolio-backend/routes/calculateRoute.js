import express from "express";
import { User, Project } from "../models/index.js";
import { Onboarding } from "../models/onboarding/model.js";

const router = express.Router();

function calculateScore(onboarding, project) {
  let score = 0;

  // Budget Fit (25 pts)
  if (
    onboarding.step4_budget &&
    onboarding.step4_budget.min &&
    onboarding.step4_budget.max
  ) {
    const min = onboarding.step4_budget.min;
    const max = onboarding.step4_budget.max;
    if (
      project.price &&
      project.price.value >= min &&
      project.price.value <= max
    ) {
      score += 25;
    } else if (project.price && project.price.value) {
      const diff = Math.min(
        Math.abs(project.price.value - min),
        Math.abs(project.price.value - max)
      );
      score += Math.max(0, 25 - (diff / max) * 25); // reduce points if outside budget
    }
  }

  // ROI Fit (25 pts)
  if (onboarding.step8_roiTarget && project.roi) {
    const roiTarget = onboarding.step8_roiTarget;
    if (roiTarget > 0) {
      if (project.roi >= roiTarget) {
        score += 25;
      } else {
        score += (project.roi / roiTarget) * 25;
      }
    }
  }

  // Risk Fit (20 pts)
  if (
    onboarding.step10_riskAppetite &&
    project.developer &&
    project.developer.developerProfile
  ) {
    const risk = onboarding.step10_riskAppetite.toLowerCase(); // "low", "moderate", "high"
    const developerScore = project.developer.developerProfile.rating || 4; // out of 5
    const onTimePct =
      project.developer.developerProfile.deliveryTrackRecord?.onTime || 90;

    if (risk === "low") {
      score += (developerScore / 5) * 20; // low-risk prefers stable devs
    } else if (risk === "high" && project.roi) {
      score += (project.roi / 10) * 20; // high-risk prefers high ROI
    } else if (risk === "moderate") {
      score += (developerScore / 5) * 10 + (project.roi / 10) * 10; // balanced approach
    }
  }

  // Property Type Match (15 pts)
  if (
    onboarding.step7_propertyTypes &&
    project.category &&
    project.category.length > 0
  ) {
    const preferredTypes = onboarding.step7_propertyTypes || [];
    if (preferredTypes.includes(project.category[0])) {
      score += 15;
    }
  }

  // Location Fit (15 pts)
  if (onboarding.step6_preferredLocation && project.location) {
    const preferredLocations = onboarding.step6_preferredLocation || [];
    if (preferredLocations.includes(project.location)) {
      score += 15;
    }
  }

  return score;
}

router.get("/:investorId", async (req, res) => {
  try {
    const { investorId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    // 1️⃣ Get investor profile
    const investor = await User.findById(investorId);
    if (!investor || investor.role !== "Investor") {
      return res.status(404).json({
        success: false,
        message: "Investor not found",
      });
    }

    // 2️⃣ Get investor onboarding data
    const onboarding = await Onboarding.findOne({ userId: investorId });
    if (!onboarding) {
      return res.status(404).json({
        success: false,
        message:
          "Investor onboarding profile not found. Please complete your profile first.",
      });
    }

    // 3️⃣ Fetch all projects with developer populated
    const projects = await Project.find().populate({
      path: "developer",
      select: "name email phone country city developerProfile",
    });

    if (projects.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Projects not found" });
    }

    // 4️⃣ Calculate scores
    const scoredProjects = projects.map((project) => {
      const score = calculateScore(onboarding, project);
      return { project, score };
    });

    // 5️⃣ Sort by score descending
    scoredProjects.sort((a, b) => b.score - a.score);

    // 6️⃣ Pagination
    const total = scoredProjects.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + Number(limit);
    const paginatedProjects = scoredProjects.slice(startIndex, endIndex);

    res.status(200).json({
      success: true,
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit),
      data: paginatedProjects,
    });
  } catch (err) {
    console.error("Error in calculate route:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;