import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Prisma } from "@prisma/client";

import {
  ACCESS_TOKEN_SECRET_KEY,
  REFRESH_TOKEN_SECRET_KEY,
} from "@config/appConfig";

import { AppError, HttpCode } from "@common/exceptions/appError";
import { User } from "@/common/middlewares/auth";
import { createUser, getUserByEmail } from "../repository/user.repository";
import {
  mapUserToUserResponse,
  userLoginResponse,
} from "../mappers/userResponseMapper";

/**
 * Service for handling user sign up
 *
 * @param payload Prisma.UserCreateInput
 * @returns {object}
 */
export const userSignup = async (payload: User) => {
  const { email, password } = payload;

  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    throw new AppError({
      httpCode: HttpCode.BAD_REQUEST,
      message: `User already exists with email ${email}`,
    });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const userData = await createUser({
    ...payload,
    password: hashedPassword,
  } as Prisma.UserCreateInput);
  if (!userData) {
    throw AppError.badRequest(`Error while creating user`);
  }
  return mapUserToUserResponse(userData);
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
    { expiresIn: "1d" }
  );
  const refreshToken = jwt.sign(
    { email: user.email, id: user.id },
    REFRESH_TOKEN_SECRET_KEY,
    { expiresIn: "7d" }
  );
  if (!accessToken || !refreshToken) {
    throw AppError.badRequest(`Could not generate tokens.`);
  }
  return userLoginResponse(user, accessToken, refreshToken);
};

/**
 * Service for fetching user
 * @returns {object}
 */
export const getUsers = async () => {
  const users = await getUsers();
  return users;
};
