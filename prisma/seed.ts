import prisma from "./client";

async function main() {
  await seedData();
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

async function seedData() {
  const user1Id = crypto.randomUUID();
  const user2Id = crypto.randomUUID();
  const user3Id = crypto.randomUUID();

  await prisma.user.createMany({
    data: [
      {
        id: user1Id,
        username: "alice_wonder",
        email: "alice@example.com",
        clerkId: "clerk_alice_123",
      },
      {
        id: user2Id,
        username: "bob_builder",
        email: "bob@example.com",
        clerkId: "clerk_bob_456",
      },
      {
        id: user3Id,
        username: "charlie_day",
        email: "charlie@example.com",
        clerkId: "clerk_charlie_789",
      },
    ],
  });

  await prisma.event.createMany({
    data: [
      {
        id: crypto.randomUUID(),
        name: "Summer BBQ Party",
        description: "Join us for a fun summer cookout!",
        date: new Date("2026-06-15T18:00:00"),
        location: "123 Park Avenue",
        userId: user1Id,
      },
      {
        id: crypto.randomUUID(),
        name: "Book Club Meeting",
        description: 'Discussing "The Great Gatsby"',
        date: new Date("2026-07-20T19:00:00"),
        location: "Central Library",
        userId: user1Id,
      },
      {
        id: crypto.randomUUID(),
        name: "Yoga in the Park",
        description: "Morning yoga session for all levels",
        date: new Date("2026-05-10T08:00:00"),
        location: "Riverside Park",
        userId: user1Id,
      },
      {
        id: crypto.randomUUID(),
        name: "Tech Meetup",
        description: "Networking event for developers",
        date: new Date("2026-08-05T18:30:00"),
        location: "Innovation Hub",
        userId: user1Id,
      },
      {
        id: crypto.randomUUID(),
        name: "Gaming Tournament",
        description: "Competitive gaming night",
        date: new Date("2026-06-01T20:00:00"),
        location: "GameZone Cafe",
        userId: user2Id,
      },
      {
        id: crypto.randomUUID(),
        name: "Hiking Adventure",
        description: "Trail hike with scenic views",
        date: new Date("2026-07-12T07:00:00"),
        location: "Mountain Trail Head",
        userId: user2Id,
      },
      {
        id: crypto.randomUUID(),
        name: "Cooking Class",
        description: "Learn to make Italian pasta",
        date: new Date("2026-09-15T17:00:00"),
        location: "Culinary Institute",
        userId: user2Id,
      },
      {
        id: crypto.randomUUID(),
        name: "Movie Night",
        description: "Outdoor cinema experience",
        date: new Date("2026-08-22T20:30:00"),
        location: "Community Park",
        userId: user2Id,
      },
      {
        id: crypto.randomUUID(),
        name: "Art Gallery Opening",
        description: "Contemporary art exhibition",
        date: new Date("2026-06-30T18:00:00"),
        location: "Downtown Gallery",
        userId: user3Id,
      },
      {
        id: crypto.randomUUID(),
        name: "Marathon Training",
        description: "Weekly running group",
        date: new Date("2026-07-05T06:00:00"),
        location: "City Stadium",
        userId: user3Id,
      },
      {
        id: crypto.randomUUID(),
        name: "Wine Tasting",
        description: "Sample local wines",
        date: new Date("2026-09-10T19:00:00"),
        location: "Vineyard Estate",
        userId: user3Id,
      },
      {
        id: crypto.randomUUID(),
        name: "Photography Workshop",
        description: "Learn landscape photography",
        date: new Date("2026-08-18T09:00:00"),
        location: "Nature Reserve",
        userId: user3Id,
      },
    ],
  });

  const allEvents = await prisma.event.findMany();
  const statuses = ["Going", "NotGoing", "Maybe"] as const;

  const attendeeData = [];

  for (const event of allEvents) {
    const userIds = [user1Id, user2Id, user3Id];

    for (const userId of userIds) {
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
      attendeeData.push({
        id: crypto.randomUUID(),
        status: randomStatus,
        message: randomStatus === "Maybe" ? "Not sure about my schedule yet" : null,
        eventId: event.id,
        userId: userId,
      });
    }
  }

  await prisma.eventAttendee.createMany({
    data: attendeeData,
  });
}
