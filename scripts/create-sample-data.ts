import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function createSampleData() {
  try {
    // Check if we have any properties
    const property = await prisma.property.findFirst({
      where: { isPublished: true },
    });

    if (!property) {
      console.log("⚠️  No published properties found. Creating sample data without property link for appointment.");
    } else {
      console.log(`✅ Found property: ${property.title}`);
    }

    // Create a sample Lead (general inquiry - no property)
    console.log("\n📝 Creating sample Lead...");
    const lead = await prisma.lead.create({
      data: {
        name: "John Doe",
        email: "john.doe@example.com",
        phone: "+961 70 123 456",
        message: "Hi, I'm interested in learning more about properties in Beirut. Do you have any apartments available for rent?",
        source: "contact_form",
        propertyId: null, // General inquiry
      },
    });
    console.log(`✅ Lead created: ${lead.name} (${lead.email})`);

    // Create a sample Appointment (with property if available)
    if (property) {
      console.log("\n📅 Creating sample Appointment...");
      const appointment = await prisma.appointment.create({
        data: {
          name: "Sarah Smith",
          email: "sarah.smith@example.com",
          phone: "+961 71 987 654",
          message: "Looking forward to seeing the property!",
          date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
          propertyId: property.id,
        },
      });
      console.log(`✅ Appointment created: ${appointment.name} for ${property.title}`);
      console.log(`   Scheduled for: ${appointment.date.toLocaleString()}`);
    } else {
      console.log("\n⚠️  Skipping appointment creation - no properties available");
    }

    console.log("\n✅ Sample data created successfully!");

    // Show summary
    const totalLeads = await prisma.lead.count();
    const totalAppointments = await prisma.appointment.count();
    console.log(`\n📊 Current totals:`);
    console.log(`   Leads: ${totalLeads}`);
    console.log(`   Appointments: ${totalAppointments}`);

  } catch (error) {
    console.error("❌ Error creating sample data:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

createSampleData();
