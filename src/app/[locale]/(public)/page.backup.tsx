import { prisma } from "@/lib/db";
import { HomePageClient } from "@/components/pages/home-page-client";

export default async function HomePage() {
  const featured = await prisma.property.findMany({
    where: { isFeatured: true, isPublished: true },
    include: { images: true },
    take: 3,
    orderBy: { createdAt: "desc" },
  });

  return <HomePageClient properties={featured} />;
}
