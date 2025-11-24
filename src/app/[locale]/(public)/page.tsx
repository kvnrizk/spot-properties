import { HomePageClient } from "@/components/pages/home-page-client";
import { db } from "@/lib/db";

export default async function HomePage() {
  // Fetch featured properties that are published
  const featured = await db.property.findMany({
    where: {
      isFeatured: true,
      isPublished: true,
    },
    include: {
      images: {
        orderBy: {
          order: "asc",
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 6, // Show up to 6 featured properties
  });

  return <HomePageClient properties={featured} />;
}
