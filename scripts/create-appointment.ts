import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function createAppointment() {
  try {
    // Find ANY property (published or not)
    const property = await prisma.property.findFirst();

    if (!property) {
      console.log("❌ No properties found in database. Please create a property first.");
      process.exit(1);
    }

    console.log(`✅ Found property: ${property.title} (${property.isPublished ? 'Published' : 'Unpublished'})`);

    // Create appointment
    console.log("\n📅 Creating sample Appointment...");
    const appointment = await prisma.appointment.create({
      data: {
        name: "Sarah Smith",
        email: "sarah.smith@example.com",
        phone: "+961 71 987 654",
        message: "Looking forward to seeing the property! I'm available any time after 2 PM.",
        date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
        propertyId: property.id,
      },
    });

    console.log(`✅ Appointment created successfully!`);
    console.log(`   Name: ${appointment.name}`);
    console.log(`   Email: ${appointment.email}`);
    console.log(`   Property: ${property.title}`);
    console.log(`   Scheduled for: ${appointment.date.toLocaleString()}`);

    // Show totals
    const totalAppointments = await prisma.appointment.count();
    console.log(`\n📊 Total Appointments: ${totalAppointments}`);

  } catch (error) {
    console.error("❌ Error creating appointment:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

createAppointment();
