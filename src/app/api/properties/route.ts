import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  buildPropertyWhereClause,
  getSortOrder,
  parseFiltersFromSearchParams,
  PropertyWithImages,
} from "@/lib/properties";
import { validatePropertyData } from "@/lib/validation";
import { sanitizeInput, sanitizeHTML } from "@/lib/sanitize";
import { logActivity, ActivityAction, ActivityEntity } from "@/lib/activity-logger";
import { auth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const searchParams = Object.fromEntries(request.nextUrl.searchParams);
    const filters = parseFiltersFromSearchParams(searchParams);

    const page = filters.page || 1;
    const perPage = filters.perPage || 12;
    const skip = (page - 1) * perPage;

    const where = buildPropertyWhereClause(filters);
    const orderBy = getSortOrder(filters.sort);

    const [properties, total] = await Promise.all([
      db.property.findMany({
        where,
        orderBy,
        skip,
        take: perPage,
        include: {
          images: {
            orderBy: {
              isPrimary: "desc",
            },
            take: 1,
          },
        },
      }),
      db.property.count({ where }),
    ]);

    const totalPages = Math.ceil(total / perPage);

    return NextResponse.json({
      data: properties as PropertyWithImages[],
      pagination: {
        page,
        perPage,
        total,
        totalPages,
      },
    });
  } catch (error) {
    console.error("Error fetching properties:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    const userEmail = session?.user?.email || "anonymous";

    const body = await request.json();
    const {
      title,
      slug,
      description,
      type,
      status,
      price,
      currency,
      country,
      city,
      region,
      area,
      bedrooms,
      bathrooms,
      isFeatured,
      isPublished,
      images,
    } = body;

    // Validate property data
    const validationErrors = validatePropertyData({
      title,
      price,
      city,
      country,
      area,
      bedrooms,
      bathrooms,
    });

    if (Object.keys(validationErrors).length > 0) {
      return NextResponse.json(
        { error: "Validation failed", details: validationErrors },
        { status: 400 }
      );
    }

    // Additional validations
    const errors: Record<string, string> = {};

    if (!slug || slug.length < 3) {
      errors.slug = "Slug is required and must be at least 3 characters";
    }

    if (!["APARTMENT", "HOUSE", "VILLA", "LAND", "OFFICE", "AIRBNB", "OTHER"].includes(type)) {
      errors.type = "Invalid property type";
    }

    if (!["FOR_SALE", "FOR_RENT"].includes(status)) {
      errors.status = "Invalid property status";
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json(
        { error: "Validation failed", details: { ...validationErrors, ...errors } },
        { status: 400 }
      );
    }

    // Sanitize inputs
    const sanitizedTitle = sanitizeInput(title);
    const sanitizedSlug = sanitizeInput(slug);
    const sanitizedDescription = description ? sanitizeHTML(description) : null;
    const sanitizedCity = sanitizeInput(city);
    const sanitizedCountry = sanitizeInput(country);
    const sanitizedRegion = region ? sanitizeInput(region) : null;

    // Create property
    const property = await db.property.create({
      data: {
        title: sanitizedTitle,
        slug: sanitizedSlug,
        description: sanitizedDescription,
        type,
        status,
        price,
        currency: currency || "USD",
        country: sanitizedCountry,
        city: sanitizedCity,
        region: sanitizedRegion,
        area,
        bedrooms,
        bathrooms,
        isFeatured: isFeatured || false,
        isPublished: isPublished || false,
      },
    });

    // Create images if provided
    if (images && Array.isArray(images) && images.length > 0) {
      await db.propertyImage.createMany({
        data: images.map((img: any, index: number) => ({
          propertyId: property.id,
          url: img.url,
          publicId: img.publicId,
          order: img.order !== undefined ? img.order : index,
          isPrimary: img.isPrimary !== undefined ? img.isPrimary : index === 0,
        })),
      });
    }

    // Fetch property with images
    const propertyWithImages = await db.property.findUnique({
      where: { id: property.id },
      include: {
        images: {
          orderBy: { order: "asc" },
        },
      },
    });

    // Log activity
    await logActivity({
      action: ActivityAction.CREATE,
      entity: ActivityEntity.PROPERTY,
      entityId: property.id,
      userEmail,
      details: {
        title: sanitizedTitle,
        slug: sanitizedSlug,
        type,
        status,
        price,
        city: sanitizedCity,
        country: sanitizedCountry,
      },
    });

    return NextResponse.json(propertyWithImages, { status: 201 });
  } catch (error) {
    console.error("Error creating property:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
