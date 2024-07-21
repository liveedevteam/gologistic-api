import { Request, Response } from "express";
import {
  loginService,
  registerService,
  verifyTokenService,
} from "./services/auths.services";

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const emailLower = email.toLowerCase();
  const loginResponse = await loginService(emailLower, password);
  return res.status(200).json(loginResponse);
};

export const register = async (req: Request, res: Response) => {
  const { name, department, email, password, role } = req.body;
  const register = await registerService(
    email,
    password,
    role,
    name,
    department
  );
  return res.status(201).json(register);
};

export const verify = async (req: Request, res: Response) => {
  console.log(`req.user`, req.user);
  const { email, role } = req.user;
  if (!email || !role) {
    throw new Error("Unauthorized");
  }
  return res.status(200).json({ email, role });
};
