import jwt from "jsonwebtoken";
import type { SignOptions } from "jsonwebtoken";

interface JwtPayload {
  userId: string;
  role: string;
}

export const generateToken = (payload: JwtPayload) => {
  const options: SignOptions = {
    expiresIn: (process.env.JWT_EXPIRES_IN || "7d") as SignOptions["expiresIn"],
  };

  return jwt.sign(payload, process.env.JWT_SECRET as string, {
    ...options,
  });
};