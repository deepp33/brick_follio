import mongoose from "mongoose";

export const FormulaSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true, // e.g. "ROI Calculator"
    },
    description: {
      type: String,
    },
    fields: [
      {
        label: { type: String, required: true }, // e.g. "Purchase Price"
        key: { type: String, required: true },   // e.g. "purchasePrice"
        type: { type: String, default: "number" }, // "number", "currency", "percentage"
        unit: { type: String }, // e.g. "AED", "%"
        required: { type: Boolean, default: true },
      },
    ],
    formula: {
      type: String, // human-readable or formula text
    },
    output: [
      {
        label: { type: String, required: true }, // e.g. "Total ROI"
        key: { type: String, required: true },
        type: { type: String, default: "number" },
        unit: { type: String },
      },
    ],
    category: {
      type: String, // ROI, Mortgage, Rental Yield, etc.
    },
  },
  { timestamps: true }
);

// ✅ Create model using schema
export const Formula = mongoose.model("Formula", FormulaSchema);
