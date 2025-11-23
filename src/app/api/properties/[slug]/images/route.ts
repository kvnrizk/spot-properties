import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { deleteImage } from "@/lib/cloudinary";
import { logActivity, ActivityAction, ActivityEntity } from "@/lib/activity-logger";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userEmail = session.user.email || "admin";

    const { slug } = await params;
    const { url, publicId } = await req.json();
    const propertyId = slug;

    // Validation
    const errors: Record<string, string> = {};

    if (!url || typeof url !== "string" || url.trim().length === 0) {
      errors.url = "Valid URL is required";
    } else if (url.length > 2000) {
      errors.url = "URL is too long";
    }

    if (
      !publicId ||
      typeof publicId !== "string" ||
      publicId.trim().length === 0
    ) {
      errors.publicId = "Valid publicId is required";
    } else if (publicId.length > 500) {
      errors.publicId = "PublicId is too long";
    }

    if (!propertyId || propertyId.trim().length === 0) {
      errors.propertyId = "Property ID is required";
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json(
        { error: "Validation failed", details: errors },
        { status: 400 }
      );
    }

    const existingImages = await prisma.propertyImage.findMany({
      where: { propertyId },
      orderBy: { order: "desc" },
      take: 1,
    });

    const nextOrder = existingImages.length > 0 ? existingImages[0].order + 1 : 0;

    const isFirstImage = await prisma.propertyImage.count({
      where: { propertyId },
    }) === 0;

    const image = await prisma.propertyImage.create({
      data: {
        url,
        publicId,
        propertyId,
        order: nextOrder,
        isPrimary: isFirstImage,
      },
    });

    // Log activity
    await logActivity({
      action: ActivityAction.UPLOAD,
      entity: ActivityEntity.PROPERTY_IMAGE,
      entityId: image.id,
      userEmail,
      details: {
        propertyId,
        url,
        isPrimary: isFirstImage,
      },
    });

    return NextResponse.json(image);
  } catch (error) {
    console.error("Error adding image:", error);
    return NextResponse.json(
      { error: "Failed to add image" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userEmail = session.user.email || "admin";

    const { searchParams } = new URL(req.url);
    const imageId = searchParams.get("imageId");

    if (!imageId || imageId.trim().length === 0) {
      return NextResponse.json(
        { error: "Valid imageId is required" },
        { status: 400 }
      );
    }

    const image = await prisma.propertyImage.findUnique({
      where: { id: imageId },
    });

    if (!image) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

    await deleteImage(image.publicId);

    await prisma.propertyImage.delete({
      where: { id: imageId },
    });

    if (image.isPrimary) {
      const nextImage = await prisma.propertyImage.findFirst({
        where: { propertyId: image.propertyId },
        orderBy: { order: "asc" },
      });

      if (nextImage) {
        await prisma.propertyImage.update({
          where: { id: nextImage.id },
          data: { isPrimary: true },
        });
      }
    }

    const remainingImages = await prisma.propertyImage.findMany({
      where: { propertyId: image.propertyId },
      orderBy: { order: "asc" },
    });

    for (let i = 0; i < remainingImages.length; i++) {
      await prisma.propertyImage.update({
        where: { id: remainingImages[i].id },
        data: { order: i },
      });
    }

    // Log activity
    await logActivity({
      action: ActivityAction.DELETE,
      entity: ActivityEntity.PROPERTY_IMAGE,
      entityId: imageId,
      userEmail,
      details: {
        propertyId: image.propertyId,
        publicId: image.publicId,
        wasPrimary: image.isPrimary,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting image:", error);
    return NextResponse.json(
      { error: "Failed to delete image" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userEmail = session.user.email || "admin";

    const { slug } = await params;
    const { imageId, action, newOrder } = await req.json();
    const propertyId = slug;

    // Validation
    const errors: Record<string, string> = {};

    if (!imageId || typeof imageId !== "string" || imageId.trim().length === 0) {
      errors.imageId = "Valid imageId is required";
    }

    if (!action || typeof action !== "string" || action.trim().length === 0) {
      errors.action = "Valid action is required";
    } else if (!["setPrimary", "updateOrder"].includes(action)) {
      errors.action = "Invalid action. Must be 'setPrimary' or 'updateOrder'";
    }

    if (action === "updateOrder") {
      if (typeof newOrder !== "number" || newOrder < 0) {
        errors.newOrder = "Valid newOrder (non-negative number) is required for updateOrder action";
      }
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json(
        { error: "Validation failed", details: errors },
        { status: 400 }
      );
    }

    if (action === "setPrimary") {
      await prisma.propertyImage.updateMany({
        where: { propertyId },
        data: { isPrimary: false },
      });

      await prisma.propertyImage.update({
        where: { id: imageId },
        data: { isPrimary: true },
      });
    } else if (action === "updateOrder" && typeof newOrder === "number") {
      await prisma.propertyImage.update({
        where: { id: imageId },
        data: { order: newOrder },
      });
    }

    // Log activity
    await logActivity({
      action: action === "setPrimary" ? ActivityAction.UPDATE : ActivityAction.REORDER,
      entity: ActivityEntity.PROPERTY_IMAGE,
      entityId: imageId,
      userEmail,
      details: {
        propertyId,
        action,
        newOrder: action === "updateOrder" ? newOrder : undefined,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating image:", error);
    return NextResponse.json(
      { error: "Failed to update image" },
      { status: 500 }
    );
  }
}
