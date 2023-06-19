import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Prisma } from "@prisma/client";

import {
  ACCESS_TOKEN_SECRET_KEY,
  REFRESH_TOKEN_SECRET_KEY,
} from "@config/appConfig";

import { AppError, HttpCode } from "@common/exceptions/appError";
import { User } from "@/common/middlewares/auth";
import prisma from "@/config/client";
import { getUserByEmail } from "../repository/user.repository";

/**
 * Service for handling user sign up
 *
 * @param payload Prisma.UserCreateInput
 * @returns {object}
 */
export const userSignup = async (payload: any) => {
  const { email, password } = payload;
  const hashedPassword = await bcrypt.hash(password, 10);

  return null;
};

/**
 * Service for handling user sign in
 *
 * @param payload Prisma.UserCreateInput
 * @returns {object}
 */
export const userSignin = async (payload: User) => {
  const { email, password } = payload;
  const user = await getUserByEmail(email);
  if (!user) {
    throw new AppError({
      httpCode: HttpCode.BAD_REQUEST,
      message: `User with email: ${email} is not registered in our system. Please use registered email to login into the system.`,
    });
  }
  const matchPassword = await bcrypt.compare(password, user.password);
  if (!matchPassword) {
    throw new AppError({
      httpCode: HttpCode.BAD_REQUEST,
      message: `Email or password did not match. Please check your credentials`,
    });
  }
  const accessToken = jwt.sign(
    { email: user.email, id: user.id },
    ACCESS_TOKEN_SECRET_KEY,
    { expiresIn: "30m" }
  );
  const refreshToken = jwt.sign(
    { email: user.email, id: user.id },
    REFRESH_TOKEN_SECRET_KEY,
    { expiresIn: "7d" }
  );
  if (!accessToken || !refreshToken) {
    throw AppError.badRequest(`Could not generate tokens.`);
  }
};

/**
 * Service for fetching user
 * @returns {object}
 */
export const getUsers = async () => {
  return {};
};
