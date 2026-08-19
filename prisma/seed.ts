import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, UserRole } from "@prisma/client";
import bcrypt from "bcrypt";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  const adminPassword = await bcrypt.hash("admin123", 10);
  const landlordPassword = await bcrypt.hash("landlord123", 10);
  const tenantPassword = await bcrypt.hash("tenant123", 10);

  await prisma.user.upsert({
    where: {
      email: "admin@rentnest.com",
    },
    update: {},
    create: {
      name: "RentNest Admin",
      email: "admin@rentnest.com",
      password: adminPassword,
      role: UserRole.ADMIN,
    },
  });

  await prisma.user.upsert({
    where: {
      email: "landlord@rentnest.com",
    },
    update: {},
    create: {
      name: "Demo Landlord",
      email: "landlord@rentnest.com",
      password: landlordPassword,
      role: UserRole.LANDLORD,
    },
  });

  await prisma.user.upsert({
    where: {
      email: "tenant@rentnest.com",
    },
    update: {},
    create: {
      name: "Demo Tenant",
      email: "tenant@rentnest.com",
      password: tenantPassword,
      role: UserRole.TENANT,
    },
  });

  await prisma.category.createMany({
    data: [
      {
        name: "Apartment",
        description: "Apartment rental properties",
      },
      {
        name: "House",
        description: "House rental properties",
      },
      {
        name: "Studio",
        description: "Studio rental properties",
      },
    ],
    skipDuplicates: true,
  });

  console.log("RentNest seed completed successfully.");
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });