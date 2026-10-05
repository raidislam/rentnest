import bcrypt from "bcrypt";
import { prisma } from "../../lib/prisma";
import { generateToken } from "../../utils/jwt";
import AppError from "../../utils/AppError";

interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: "TENANT" | "LANDLORD";
}

interface LoginData {
  email: string;
  password: string;
}

export const registerUser = async (data: RegisterData) => {
  const existingUser = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });

  if (existingUser) {
    throw new AppError(409, "User already exists with this email");
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: data.role,
    },
  });

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
};

export const loginUser = async (data: LoginData) => {
  const user = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });

  if (!user) {
    throw new AppError(401, "Invalid email or password");
  }

  const passwordMatched = await bcrypt.compare(
    data.password,
    user.password,
  );

  if (!passwordMatched) {
    throw new AppError(401, "Invalid email or password");
  }

  if (!user.status) {
    throw new AppError(403, "Your account has been banned");
  }

  const token = generateToken({
    userId: user.id,
    role: user.role,
  });

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};

export const getCurrentUser = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });

  if (!user) {
    throw new AppError(404, "User not found");
  }

  return user;
};