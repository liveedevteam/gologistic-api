import mongoose from "mongoose";

const shippingPlanSchema = new mongoose.Schema(
  {
    shippingOrder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ShippingOrder",
      required: true,
    },
    planningNumber: {
      type: String,
      required: true,
      unique: true,
    },
    routeStart: {
      type: String,
      required: true,
    },
    routeEnd: {
      type: Array,
      default: [],
    },
    fuelCost: {
      type: Number,
      default: 0,
    },
    vehicleType: {
      type: String,
      default: "",
    },
    vehicleCount: {
      type: Number,
      default: 0,
    },
    packageCode: {
      type: String,
      default: "",
    },
    packageCount: {
      type: Number,
      default: 0,
    },
    distributionPlan: {
      type: String,
      default: "",
    },
    purchaseBudget: {
      type: Number,
      default: 0,
    },
    commission: {
      type: Number,
      default: 0,
    },
    packageReceivedDate: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      default: "active",
      enum: ["open", "close"],
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
  {
    timestamps: true,
  }
);

shippingPlanSchema.pre("save", async function (next) {
  this.updatedAt = new Date();
  next();
});

const ShippingPlan = mongoose.model("ShippingPlan", shippingPlanSchema);

export default ShippingPlan;
