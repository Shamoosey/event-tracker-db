import { Event } from "prisma/generated/prisma";
import prisma from "../../../../prisma/client";

export const fetchAllEvents = async (): Promise<Event[]> => {
  const data = await prisma.event.findMany({
    include: {
      attendees: true,
    },
  });
  return data;
};
