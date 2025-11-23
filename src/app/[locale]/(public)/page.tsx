import { HomePageClient } from "@/components/pages/home-page-client";

export default async function HomePage() {
  // Temporarily removed database query to test routing
  const featured: any[] = [];

  return <HomePageClient properties={featured} />;
}
