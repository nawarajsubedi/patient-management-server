import prisma from "@config/client";
import { Prisma } from "@prisma/client";

export const getUserByEmail = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });
  return user;
};

export const createUser = async (data: Prisma.UserCreateInput) => {
  const userData = await prisma.user.create({
    data,
  });

  return userData;
};
