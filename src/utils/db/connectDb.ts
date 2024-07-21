import mongoose from "mongoose";

export default async () => {
  const dbUri = `mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_URI}/${process.env.DB_NAME}?ssl=true&replicaSet=atlas-vupa4c-shard-0&authSource=admin&retryWrites=true&w=majority`;
  try {
    mongoose.Promise = global.Promise;
    mongoose.set("strictQuery", false);
    mongoose.connect(dbUri);
    console.log("Connect DB Success");
  } catch (isErr) {
    console.log(`Connect DB Failed`);
  }
};
