import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function clearData() {
  try {
    console.log("Clearing appointments...");
    const deletedAppointments = await prisma.appointment.deleteMany({});
    console.log(`Deleted ${deletedAppointments.count} appointments`);

    console.log("Clearing leads...");
    const deletedLeads = await prisma.lead.deleteMany({});
    console.log(`Deleted ${deletedLeads.count} leads`);

    console.log("✅ All data cleared successfully!");
  } catch (error) {
    console.error("Error clearing data:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

clearData();
