import mongoose from "mongoose";

const stockSchema = new mongoose.Schema({
  type: {
    type: String,
    default: "diesel"
  },
  key: {
    type: String,
    default: ""
  },
  startPoint: {
    type: String,
    default: "",
  },
  startGps: {
    type: String,
    default: "",
  },
  stopPoint: {
    type: String,
    default: "",
  },
  stopGps: {
    type: String,
    default: "",
  },
  priceLiter: {
    type: Number,
    default: 0,
  },
  distance: {
    type: Number,
    default: 0,
  },
  truck: {
    type: Array,
    default: [],
  },
  priceTruck: {
    type: Number,
    default: 0,
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

const OilPrice = mongoose.model("OilPrice", stockSchema);

export default OilPrice;