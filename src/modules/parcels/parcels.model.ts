import mongoose from "mongoose";

const parcelSchema = new mongoose.Schema({
  oilPrice: {
    type: Number,
    required: true,
  },
  source: {
    type: String,
    required: true,
  },
  destination: {
    type: String,
    required: true,
  },
  distance: {
    type: Number,
    default: 0,
  },
  parcelCode: {
    type: String,
    required: true,
  },
  parcelAmount: {
    type: Number,
    default: 0,
  },
  parcelType: {
    type: String,
    required: true,
  },
  vehicleAmount: {
    type: Number,
    default: 0,
  },
  ratio: {
    type: Number,
    default: 0,
  },
  proportion: {
    type: Number,
    default: 0,
  },
  receiveDate: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
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

const Parcel = mongoose.model("Parcel", parcelSchema);

export default Parcel;
