import mongoose from "mongoose";

export const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["Investor", "Developer", "Admin"],
      required: true,
    },
    phone: String,
    country: String,
    city: String,
    developerProfile: {
      type: {
        companyName: String,
        rating: { type: Number, min: 0, max: 5 },
        certifications: [String],
        reraCertified: { type: Boolean, default: false },
        projects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Project" }],
        specializations: [String],
        projectsCompletedCount: { type: Number, default: 0 },
        description: String,
        location: String,
        successRate: Number,
        deliveryTrackRecord: {
          onTime: { type: Number, default: 0 },
          qualityScore: { type: Number, default: 0 },
          customerSatisfaction: { type: Number, default: 0 },
        },
        activeProjects: { type: Number, default: 0 },
        avgROI: { type: Number, default: 0 },
        employeeCount: { type: Number, default: 0 },
        totalProjects: { type: Number, default: 0 },
        compliance: {
          reraLicense: String,
          complianceScore: { type: Number, default: 0 },
          lastAudit: Date,
        },
        legalStanding: {
          clientLegal: { type: String, default: "Clear" },
          escrow: { type: String, default: "Active" },
          insurance: { type: String, default: "Valid" },
        },
      },
      default: {},
    },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", UserSchema);
