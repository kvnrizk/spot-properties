import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { validatePropertyData } from "@/lib/validation";
import { sanitizeInput, sanitizeHTML } from "@/lib/sanitize";
import { logActivity, ActivityAction, ActivityEntity } from "@/lib/activity-logger";
import { auth } from "@/lib/auth";

// Helper to check if string is a CUID (Prisma default ID format)
// CUIDs start with 'c' and are 25 characters long, alphanumeric
function isCUID(str: string): boolean {
  const cuidRegex = /^c[a-z0-9]{24}$/i;
  return cuidRegex.test(str);
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const isId = isCUID(slug);

    const property = await db.property.findUnique({
      where: isId ? { id: slug } : { slug },
      include: {
        images: {
          orderBy: {
            order: "asc",
          },
        },
      },
    });

    if (!property) {
      return NextResponse.json(
        { error: "Property not found" },
        { status: 404 }
      );
    }

    // Only check isPublished for slug-based lookups (public pages)
    // ID-based lookups are for admin, so skip this check
    if (!isId && !property.isPublished) {
      return NextResponse.json(
        { error: "Property not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(property);
  } catch (error) {
    console.error("Error fetching property:", error);
    return NextResponse.json(
      { error: "Failed to fetch property" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const session = await auth();
    const userEmail = session?.user?.email || "anonymous";

    const { slug } = await params;
    const body = await request.json();

    // PATCH should only work with IDs (admin operation)
    if (!isCUID(slug)) {
      return NextResponse.json(
        { error: "Invalid property ID" },
        { status: 400 }
      );
    }

    // Check if property exists
    const existingProperty = await db.property.findUnique({
      where: { id: slug },
    });

    if (!existingProperty) {
      return NextResponse.json(
        { error: "Property not found" },
        { status: 404 }
      );
    }

    // Validate property data if core fields are being updated
    if (body.title || body.price || body.city || body.country) {
      const validationErrors = validatePropertyData({
        title: body.title || existingProperty.title,
        price: body.price !== undefined ? body.price : existingProperty.price,
        city: body.city || existingProperty.city,
        country: body.country || existingProperty.country,
        area: body.area !== undefined ? body.area : existingProperty.area,
        bedrooms:
          body.bedrooms !== undefined
            ? body.bedrooms
            : existingProperty.bedrooms,
        bathrooms:
          body.bathrooms !== undefined
            ? body.bathrooms
            : existingProperty.bathrooms,
      });

      if (Object.keys(validationErrors).length > 0) {
        return NextResponse.json(
          { error: "Validation failed", details: validationErrors },
          { status: 400 }
        );
      }
    }

    // Validate type and status if provided
    if (
      body.type &&
      !["APARTMENT", "HOUSE", "VILLA", "LAND", "OFFICE", "AIRBNB", "OTHER"].includes(
        body.type
      )
    ) {
      return NextResponse.json(
        { error: "Validation failed", details: { type: "Invalid property type" } },
        { status: 400 }
      );
    }

    if (body.status && !["FOR_SALE", "FOR_RENT"].includes(body.status)) {
      return NextResponse.json(
        { error: "Validation failed", details: { status: "Invalid property status" } },
        { status: 400 }
      );
    }

    // Sanitize text inputs
    const updateData: any = { ...body };
    if (body.title) updateData.title = sanitizeInput(body.title);
    if (body.description)
      updateData.description = sanitizeHTML(body.description);
    if (body.city) updateData.city = sanitizeInput(body.city);
    if (body.country) updateData.country = sanitizeInput(body.country);
    if (body.region) updateData.region = sanitizeInput(body.region);

    const property = await db.property.update({
      where: { id: slug },
      data: updateData,
      include: {
        images: {
          orderBy: { order: "asc" },
        },
      },
    });

    // Log activity
    await logActivity({
      action: ActivityAction.UPDATE,
      entity: ActivityEntity.PROPERTY,
      entityId: slug,
      userEmail,
      details: updateData,
    });

    return NextResponse.json(property);
  } catch (error) {
    console.error("Error updating property:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const session = await auth();
    const userEmail = session?.user?.email || "anonymous";

    const { slug } = await params;

    // DELETE should only work with IDs (admin operation)
    if (!isCUID(slug)) {
      return NextResponse.json(
        { error: "Invalid property ID" },
        { status: 400 }
      );
    }

    // Check if property exists and get its images
    const property = await db.property.findUnique({
      where: { id: slug },
      include: {
        images: true,
      },
    });

    if (!property) {
      return NextResponse.json(
        { error: "Property not found" },
        { status: 404 }
      );
    }

    // Delete images from Cloudinary first
    if (property.images && property.images.length > 0) {
      const { deleteImage } = await import("@/lib/cloudinary");

      // Delete all images from Cloudinary in parallel
      await Promise.allSettled(
        property.images.map((image) => deleteImage(image.publicId))
      );
    }

    // Delete property from database (cascade will delete image records)
    await db.property.delete({
      where: { id: slug },
    });

    // Log activity
    await logActivity({
      action: ActivityAction.DELETE,
      entity: ActivityEntity.PROPERTY,
      entityId: slug,
      userEmail,
      details: {
        title: property.title,
        slug: property.slug,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting property:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
