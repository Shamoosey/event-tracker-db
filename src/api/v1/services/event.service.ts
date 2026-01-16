import prisma from "@prisma/client";
import { Event, EventStatus } from "@prisma/generated/prisma";

export const fetchAllEvents = async (): Promise<Event[]> => {
  const data = await prisma.event.findMany({
    include: {
      attendees: {
        include: {
          user: {
            select: {
              username: true,
              id: true,
            },
          },
        },
      },
      user: {
        select: {
          username: true,
          id: true,
        },
      },
    },
  });
  return data;
};

export const updateEventAttendance = async (eventId: string, userClerkId: string, status: EventStatus) => {
  const user = await prisma.user.findFirstOrThrow({
    where: {
      clerkId: userClerkId,
    },
  });

  const existing = await prisma.eventAttendee.findFirst({
    where: {
      eventId: eventId,
      userId: user.id,
    },
  });

  if (existing) {
    await prisma.eventAttendee.update({
      where: {
        id: existing.id,
      },
      data: {
        status: status,
      },
    });
  } else {
    await prisma.eventAttendee.create({
      data: {
        eventId: eventId,
        userId: user.id,
        status: status,
        message: undefined,
      },
    });
  }
};
