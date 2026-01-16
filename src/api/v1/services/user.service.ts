import prisma from "@prisma/client";
import { User } from "@prisma/generated/prisma";

export const getAllUsers = async (): Promise<User[]> => {
  const data = await prisma.user.findMany();
  return data;
};

export const getUserById = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id: id,
    },
  });

  if (!user) {
    return null;
  } else {
    return user;
  }
};

export const getUserByClerkId = async (clerkId: string) => {
  const user = await prisma.user.findFirst({
    where: {
      clerkId,
    },
  });

  if (!user) {
    return null;
  } else {
    return user;
  }
};

export const createUser = async (username: string, email: string, clerkId: string) => {
  const newUser = await prisma.user.create({
    data: {
      username,
      email,
      clerkId,
    },
  });

  return newUser;
};

export const updateUser = async (id: string, username: string, email: string) => {
  const updatedUser = await prisma.user.update({
    data: {
      username,
      email,
    },
    where: {
      id,
    },
  });

  return updatedUser;
};

export const deleteUser = async (id: string) => {
  await prisma.user.delete({
    where: {
      id,
    },
  });
};
