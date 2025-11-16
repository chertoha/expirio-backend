// seed-storages.ts
import { Alert, AlertType, PrismaClient } from "@prisma/client";

type SeedAlert = Omit<Alert, "id" | "createdAt" | "updatedAt"> & {
  channels: Array<{ type: AlertType }>;
};

const alerts: SeedAlert[] = [
  {
    name: "7-day Expiry Alert",
    daysBefore: 7,
    isEnabled: true,
    channels: [{ type: "EMAIL" }, { type: "PUSH" }],
  },
  {
    name: "15-day Expiry Alert",
    daysBefore: 15,
    isEnabled: false,
    channels: [{ type: "SMS" }],
  },
  {
    name: "30-day Expiry Alert",
    daysBefore: 30,
    isEnabled: true,
    channels: [{ type: "EMAIL" }, { type: "SMS" }],
  },
  {
    name: "60-day Expiry Alert",
    daysBefore: 60,
    isEnabled: true,
    channels: [{ type: "EMAIL" }, { type: "SMS" }, { type: "PUSH" }],
  },
  {
    name: "90-day Expiry Alert",
    daysBefore: 90,
    isEnabled: false,
    channels: [{ type: "PUSH" }],
  },
];

export async function seedAlerts(prisma: PrismaClient) {
  console.log("🌱 Checking alerts...");

  const count = await prisma.alert.count();
  if (count > 0) {
    console.log(`ℹ️ Found ${count} existing alerts — skipping seeding.`);
    return;
  }

  for (const alert of alerts) {
    await prisma.alert.create({
      data: {
        name: alert.name,
        daysBefore: alert.daysBefore,
        isEnabled: alert.isEnabled,
        channels: {
          createMany: { data: alert.channels },
        },
      },
    });
  }

  console.log(`✅ Seeded ${alerts.length} alerts.`);
}
