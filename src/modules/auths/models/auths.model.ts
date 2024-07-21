import mongoose from "mongoose";

const authsSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    enum: ["admin", "user"],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
    default: Date.now(),
  },
});

authsSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

const Auths = mongoose.model("Auths", authsSchema);

export default Auths;
