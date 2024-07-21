import { Request, Response } from "express";
import { loginService, registerService, verifyTokenService } from "./services/auths.services";

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const emailLower = email.toLowerCase();
  const loginResponse = await loginService(emailLower, password);
  return res.status(200).json(loginResponse);
};

export const register = async (req: Request, res: Response) => {
  const register = await registerService(
    req.body.email,
    req.body.password,
    req.body.role
  );
  return res.status(201).json(register);
};

export const verify = async (req: Request, res: Response) => {
  const token = req.headers.authorization?.split(" ")[1];
  const decoded = await verifyTokenService(token as string);
  return res.status(200).json(decoded);
};