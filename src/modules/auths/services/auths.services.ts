import dayjs from "../../../utils/dayjs";
import AppError from "../../../utils/errors/appError";
import Auths from "../models/auths.model";
import bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";

export const loginService = async (email: string, password: string) => {
  try {
    const auth = await Auths.findOne({ email });
    if (!auth) {
      throw new AppError("Email not found", 404);
    }
    const comparePassword = bcrypt.compareSync(password, auth.password);
    if (!comparePassword) {
      throw new AppError("Password is incorrect", 400);
    }
    const expiresIn = dayjs().add(1, "day").unix();
    const role = auth.role;
    const token = jwt.sign(
      { sub: email, role },
      process.env.JWT_SECRET as string,
      {
        expiresIn,
      }
    );
    return {
      token,
      expiresIn,
      role,
    };
  } catch (error: any) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(error.message, 500);
  }
};

export const registerService = async (
  email: string,
  password: string,
  role: string
) => {
  try {
    const authDoc = await Auths.findOne({ email });
    if (authDoc) {
      throw new AppError("Email already exists", 400);
    }
    const encodedPassword = bcrypt.hashSync(password, 10);
    const auth = new Auths({ email, password: encodedPassword, role });
    await auth.save();
    return auth;
  } catch (error: any) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(error.message, 500);
  }
};

export const verifyTokenService = async (token: string) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    return decoded;
  } catch (error: any) {
    throw new AppError(error.message, 401);
  }
}