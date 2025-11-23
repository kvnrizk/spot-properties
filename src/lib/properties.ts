import { Property, PropertyImage, PropertyType, PropertyStatus } from "@prisma/client";
import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";

export type PropertyWithImages = Property & {
  images: PropertyImage[];
};

// Optimized type for property listing cards - only fields we need
export type PropertyListItem = {
  id: string;
  title: string;
  slug: string;
  price: number;
  status: PropertyStatus;
  type: PropertyType;
  country: string;
  city: string;
  bedrooms: number | null;
  bathrooms: number | null;
  area: number | null;
  images: {
    id: string;
    url: string;
    isPrimary: boolean;
  }[];
};

export interface PropertyFilters {
  country?: string;
  city?: string;
  type?: PropertyType;
  status?: PropertyStatus;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  page?: number;
  perPage?: number;
  sort?: "newest" | "oldest" | "price_low_to_high" | "price_high_to_low";
}

export function buildPropertyWhereClause(filters: PropertyFilters): Prisma.PropertyWhereInput {
  const where: Prisma.PropertyWhereInput = {
    isPublished: true,
  };

  if (filters.country) {
    where.country = {
      equals: filters.country,
      mode: "insensitive",
    };
  }

  if (filters.city) {
    where.city = {
      equals: filters.city,
      mode: "insensitive",
    };
  }

  if (filters.type) {
    where.type = filters.type;
  }

  if (filters.status) {
    where.status = filters.status;
  }

  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    where.price = {};
    if (filters.minPrice !== undefined) {
      where.price.gte = filters.minPrice;
    }
    if (filters.maxPrice !== undefined) {
      where.price.lte = filters.maxPrice;
    }
  }

  if (filters.bedrooms !== undefined) {
    where.bedrooms = {
      gte: filters.bedrooms,
    };
  }

  return where;
}

export function getSortOrder(sort?: string): Prisma.PropertyOrderByWithRelationInput {
  switch (sort) {
    case "price_low_to_high":
      return { price: "asc" };
    case "price_high_to_low":
      return { price: "desc" };
    case "oldest":
      return { createdAt: "asc" };
    case "newest":
    default:
      return { createdAt: "desc" };
  }
}

export function parseFiltersFromSearchParams(searchParams: Record<string, string | string[] | undefined>): PropertyFilters {
  const filters: PropertyFilters = {};

  if (searchParams.country && typeof searchParams.country === "string") {
    filters.country = searchParams.country;
  }

  if (searchParams.city && typeof searchParams.city === "string") {
    filters.city = searchParams.city;
  }

  if (searchParams.type && typeof searchParams.type === "string") {
    filters.type = searchParams.type as PropertyType;
  }

  if (searchParams.status && typeof searchParams.status === "string") {
    filters.status = searchParams.status as PropertyStatus;
  }

  if (searchParams.minPrice && typeof searchParams.minPrice === "string") {
    const parsed = parseInt(searchParams.minPrice, 10);
    if (!isNaN(parsed)) {
      filters.minPrice = parsed;
    }
  }

  if (searchParams.maxPrice && typeof searchParams.maxPrice === "string") {
    const parsed = parseInt(searchParams.maxPrice, 10);
    if (!isNaN(parsed)) {
      filters.maxPrice = parsed;
    }
  }

  if (searchParams.bedrooms && typeof searchParams.bedrooms === "string") {
    const parsed = parseInt(searchParams.bedrooms, 10);
    if (!isNaN(parsed)) {
      filters.bedrooms = parsed;
    }
  }

  if (searchParams.page && typeof searchParams.page === "string") {
    const parsed = parseInt(searchParams.page, 10);
    if (!isNaN(parsed) && parsed > 0) {
      filters.page = parsed;
    }
  }

  if (searchParams.perPage && typeof searchParams.perPage === "string") {
    const parsed = parseInt(searchParams.perPage, 10);
    if (!isNaN(parsed) && parsed > 0) {
      filters.perPage = parsed;
    }
  }

  if (searchParams.sort && typeof searchParams.sort === "string") {
    if (["newest", "oldest", "price_low_to_high", "price_high_to_low"].includes(searchParams.sort)) {
      filters.sort = searchParams.sort as "newest" | "oldest" | "price_low_to_high" | "price_high_to_low";
    }
  }

  return filters;
}

// Optimized function to fetch properties with only required fields
export async function getProperties(filters: PropertyFilters): Promise<PropertyListItem[]> {
  const where = buildPropertyWhereClause(filters);
  const orderBy = getSortOrder(filters.sort);
  const page = filters.page || 1;
  const perPage = filters.perPage || 12;
  const skip = (page - 1) * perPage;

  const properties = await db.property.findMany({
    where,
    orderBy,
    skip,
    take: perPage,
    select: {
      id: true,
      title: true,
      slug: true,
      price: true,
      status: true,
      type: true,
      country: true,
      city: true,
      bedrooms: true,
      bathrooms: true,
      area: true,
      images: {
        select: {
          id: true,
          url: true,
          isPrimary: true,
        },
        orderBy: {
          isPrimary: "desc",
        },
        take: 1,
      },
    },
  });

  return properties;
}

// Optimized function to count properties with filters
export async function getPropertiesCount(filters: PropertyFilters): Promise<number> {
  const where = buildPropertyWhereClause(filters);
  return await db.property.count({ where });
}
