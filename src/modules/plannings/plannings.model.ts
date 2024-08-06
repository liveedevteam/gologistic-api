import mongoose from "mongoose";

const planningSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    budget: {
      type: String,
      default: "",
    },
    date: {
      type: Date,
      required: true,
    },
    oilPricePerLiter: {
      type: Number,
      default: 0, 
    },
    parcels: {
      type: Array,
      default: [],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      default: "draft",
      enum: ["draft", "inProgress", "proposal", "comparePrice", "completed"],
    },
    xlsxFilename: {
      type: String,
      default: "",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Planning = mongoose.model("Planning", planningSchema);

export default Planning;
