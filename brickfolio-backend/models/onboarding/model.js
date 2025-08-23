import mongoose from "mongoose";

export const OnboardingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    step1_residence: {
      type: String, // "UAE Investor" / "International Investor"
    },
    step2_priorInvestment: {
      type: String, // "Yes" / "No"
    },
    step3_investmentGoal: {
      type: String, // "Steady rental income" / "Long-term capital growth" / "Personal use"
    },
    step4_budget: {
      min: Number,
      max: Number,
      currency: { type: String, default: "AED" },
    },
    step5_offPlan: {
      type: String, // "Yes" / "No"
    },
    step6_preferredLocation: {
      type: [String], // Array of location names or IDs
    },
    step7_propertyTypes: {
      type: [String], // e.g. ["Studio", "1-Bedroom", "Villas"]
    },
    step8_roiTarget: {
      type: Number, // percentage
    },
    step9_rentalYieldTarget: {
      type: Number, // percentage
    },
    step10_riskAppetite: {
      type: String, // "low" / "moderate" / "high"
    },
    step11_investmentHorizon: {
      type: String, // "Short-term flip" / "Long-term hold"
    },
  },
  { timestamps: true } // saves createdAt & updatedAt
);

export const Onboarding = mongoose.model("Onboarding", OnboardingSchema);
