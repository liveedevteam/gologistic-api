import mongoose from "mongoose";

const shippingOrderSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    orderNumber: {
      type: String,
      required: true,
      unique: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      default: "todo",
      enum: [
        "todo",
        "in-progress",
        "completed",
        "cancelled",
        "returned",
        "delivered",
      ],
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

shippingOrderSchema.pre("save", async function (next) {
  this.updatedAt = new Date();
  next();
});

const ShippingOrder = mongoose.model("ShippingOrder", shippingOrderSchema);

export default ShippingOrder;