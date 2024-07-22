import dayjs from "../../../utils/dayjs";
import AppError from "../../../utils/errors/appError";
import { createUserService } from "../../users/services/users.services";
import Auths, { IAuthsDocument } from "../models/auths.model";
import bcrypt from "bcryptjs";
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
  role: string,
  name: string,
  department: string
) => {
  try {
    const authDoc = await Auths.findOne({ email });
    if (authDoc) {
      throw new AppError("Email already exists", 400);
    }
    const encodedPassword = bcrypt.hashSync(password, 10);
    const auth = new Auths({
      email,
      password: encodedPassword,
      role,
    }) as IAuthsDocument;
    await auth.save();
    if (!auth) {
      throw new AppError("Failed to create auth", 500);
    }
    const authId = auth._id;
    const user = await createUserService(name, department, authId);
    const userObj = user.toObject();
    const authObj = auth.toObject();
    delete authObj.password;
    return {
      message: "User created successfully",
      result: {
        user: userObj,
        auth: authObj,
      },
    };
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
};
