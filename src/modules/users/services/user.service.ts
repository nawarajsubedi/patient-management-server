import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Prisma } from "@prisma/client";

import {
  ACCESS_TOKEN_SECRET_KEY,
  REFRESH_TOKEN_SECRET_KEY,
} from "@config/appConfig";

import { AppError, HttpCode } from "@common/exceptions/appError";

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
export const userSignin = async (payload: any) => {
  const { email, password } = payload;
  return null;
};

/**
 * Service for fetching user
 * @returns {object}
 */
export const getUsers = async () => {
  return {};
};
