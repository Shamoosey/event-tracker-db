import { User } from "prisma/generated/prisma";
import prisma from "../../../../prisma/client";

export const fetchAllUsers = async (): Promise<User[]> => {
  const data = await prisma.user.findMany();
  return data;
};
