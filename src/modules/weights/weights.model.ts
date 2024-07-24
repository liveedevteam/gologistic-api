import mongoose from "mongoose";

const weightSchema = new mongoose.Schema({
  peaCode: {
    type: String,
    default: "",
  },
  description: {
    type: String,
    default: "",
  },
  unit: {
    type: String,
    default: "",
  },
  weight: {
    type: Number,
    default: 0,
  },
  package: {
    type: String,
    default: "",
  },
  totalWeight: {
    type: Number,
    default: 0,
  },
  trucks: {
    type: Array,
    default: [],
  },
  remark: {
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
});

const Weight = mongoose.model("Weight", weightSchema);

export default Weight;
