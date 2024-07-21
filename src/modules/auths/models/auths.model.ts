import mongoose from "mongoose";

export interface IAuthsDocument extends mongoose.Document {
  _id: string;
  email: string;
  password: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

const authsSchema = new mongoose.Schema<IAuthsDocument>({
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
