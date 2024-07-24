import mongoose from "mongoose";

const stockSchema = new mongoose.Schema({
  peaCode: {
    type: String,
    required: true,
  },
  idCode: {
    type: String,
    default: "",
  },
  engName: {
    type: String,
    default: "",
  },
  thaiName: {
    type: String,
    default: "",
  },
  package: {
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Stock = mongoose.model("Stock", stockSchema);

export default Stock;
