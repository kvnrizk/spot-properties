import { PrismaClient, PropertyType, PropertyStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function createCompleteSample() {
  try {
    // Create a sample property first
    console.log("🏠 Creating sample property...");
    const property = await prisma.property.create({
      data: {
        title: "Luxury Apartment in Achrafieh",
        slug: "luxury-apartment-achrafieh-demo",
        description: "Beautiful 3-bedroom apartment in the heart of Achrafieh with stunning city views.",
        type: PropertyType.APARTMENT,
        status: PropertyStatus.FOR_SALE,
        price: 350000,
        currency: "USD",
        country: "Lebanon",
        city: "Beirut",
        region: "Achrafieh",
        bedrooms: 3,
        bathrooms: 2,
        area: 180,
        isPublished: true,
        isFeatured: false,
      },
    });
    console.log(`✅ Property created: ${property.title}`);

    // Create a Lead
    console.log("\n📝 Creating sample Lead...");
    const lead = await prisma.lead.create({
      data: {
        name: "John Doe",
        email: "john.doe@example.com",
        phone: "+961 70 123 456",
        message: "Hi, I'm interested in learning more about properties in Beirut. Do you have any apartments available for rent?",
        source: "contact_form",
        propertyId: null,
      },
    });
    console.log(`✅ Lead created: ${lead.name} (${lead.email})`);

    // Create an Appointment
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
    console.log(`✅ Appointment created: ${appointment.name}`);
    console.log(`   Property: ${property.title}`);
    console.log(`   Scheduled for: ${appointment.date.toLocaleString()}`);

    // Show summary
    console.log("\n✅ All sample data created successfully!");
    console.log("\n📊 Dashboard Summary:");
    console.log(`   Properties: ${await prisma.property.count()}`);
    console.log(`   Leads: ${await prisma.lead.count()}`);
    console.log(`   Appointments: ${await prisma.appointment.count()}`);

  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

createCompleteSample();
