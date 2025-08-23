import express from "express";
import { User, Onboarding } from "../models/index.js";
// import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { name, email, password, role, onboarding = null } = req.body;

    // Basic validation
    if (!name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "Name, email, password and role are required",
      });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already exists. Please use a different email.",
      });
    }

    const user = await User.create(req.body);
    let onboardingData = null;

    if (role === "Investor" && onboarding) {
      onboardingData = await Onboarding.create({
        userId: user._id,
        ...onboarding,
      });
    }

    // let token = null;
    // if (role === "Investor") {
    //   token = jwt.sign(
    //     { id: user._id, role: user.role },
    //     process.env.JWT_SECRET || "your_secret_key",
    //     { expiresIn: "7d" } // token valid for 7 days
    //   );
    // }

    res.status(201).json({
      success: true,
      message: `${role} created successfully`,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const {
      role,
      search,
      rating,
      certification,
      reraCertified,
      page = 1,
      limit = 10,
    } = req.query;

    let filter = {};

    // 🔹 Role filter (Admins see all users, others see only their role)
    if (role && role !== "Admin") filter.role = role;

    // 🔹 Search by name or email
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    // �� Developer-specific filters
    if (role === "Developer") {
      if (rating) filter["developerProfile.rating"] = { $gte: Number(rating) };
      if (certification)
        filter["developerProfile.certifications"] = { $in: [certification] };
      if (reraCertified !== undefined)
        filter["developerProfile.reraCertified"] = reraCertified === "true";
    }

    // 🔹 Pagination
    const skip = (Number(page) - 1) * Number(limit);

    // 🔹 Fetch users from DB
    let users = await User.find(filter)
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    users = await Promise.all(
      users.map(async (u) => {
        const user = u.toObject();

        if (user.role === "Investor") {
          delete user.developerProfile;

          // Populate onboarding if exists
          const onboarding = await Onboarding.findOne({ userId: user._id });
          if (onboarding) user.onboarding = onboarding;
        }

        return user;
      })
    );

    const total = await User.countDocuments(filter);

    res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / limit),
        limit: Number(limit),
      },
      data: users,
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
    const userId = req.params.id;

    // Fetch user by ID
    let user = await User.findById(userId).populate(
      "developerProfile.projects"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Convert to object for modifications
    user = user.toObject();

    // Hide developerProfile for investors
    if (user.role === "Investor") {
      delete user.developerProfile;

      // Optionally include onboarding if exists
      const onboardingData = await Onboarding.findOne({ userId: user._id });
      if (onboardingData) {
        user.onboarding = onboardingData;
      }
    }

    res.status(200).json({
      success: true,
      message: "User fetched successfully",
      data: user,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

router.post("/bulk", async (req, res) => {
  try {
    const { users } = req.body;

    if (!Array.isArray(users) || users.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide an array of users",
      });
    }

    const createdUsers = [];

    for (const userData of users) {
      const { email, role, onboarding = null } = userData;

      // Check if email already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) continue; // skip duplicates

      // Create user
      const user = await User.create(userData);

      // If Investor, create onboarding
      if (role === "Investor" && onboarding) {
        await Onboarding.create({
          userId: user._id,
          ...onboarding,
        });
      }

      createdUsers.push({ user });
    }

    res.status(201).json({
      success: true,
      message: `${createdUsers.length} users created successfully`,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
});

router.put("/:investorId", async (req, res) => {
  try {
    const { investorId } = req.params;
    const { name, email, password, phone, country, city, onboarding } =
      req.body;

    const user = await User.findById(investorId);
    if (!user || user.role !== "Investor") {
      return res
        .status(404)
        .json({ success: false, message: "Investor not found" });
    }

    // 2️⃣ Update basic fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (password) user.password = password;
    if (phone) user.phone = phone;
    if (country) user.country = country;
    if (city) user.city = city;
    user.updatedAt = new Date(); // update updatedAt

    await user.save();

    let onboardingData = await Onboarding.findOne({ userId: investorId });
    if (onboarding) {
      if (onboardingData) {
        // update existing
        Object.keys(onboarding).forEach((key) => {
          onboardingData[key] = onboarding[key];
        });
        onboardingData.updatedAt = new Date();
        await onboardingData.save();
      } else {
        // create new if missing
        onboardingData = await Onboarding.create({
          userId: investorId,
          ...onboarding,
        });
      }
    }

    res.status(200).json({
      success: true,
      message: "Investor profile updated successfully"
    });
  } catch (err) {
    console.error("Error updating investor:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
