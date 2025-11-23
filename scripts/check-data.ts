import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function checkData() {
  try {
    const appointmentsCount = await prisma.appointment.count();
    const leadsCount = await prisma.lead.count();

    console.log(`Total appointments: ${appointmentsCount}`);
    console.log(`Total leads: ${leadsCount}`);

    if (appointmentsCount > 0) {
      console.log("\nAppointments:");
      const appointments = await prisma.appointment.findMany();
      console.log(appointments);
    }

    if (leadsCount > 0) {
      console.log("\nLeads:");
      const leads = await prisma.lead.findMany();
      console.log(leads);
    }
  } catch (error) {
    console.error("Error checking data:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkData();
