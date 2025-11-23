import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { logActivity, ActivityAction, ActivityEntity } from "@/lib/activity-logger";
import { auth } from "@/lib/auth";
import { Currency } from "@prisma/client";

// PATCH - Update settings
export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();

    // Only admins can update settings
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userEmail = session.user.email || "admin";

    const body = await request.json();

    // Validate required fields
    if (!body.platformName || !body.supportEmail || !body.defaultCurrency) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.supportEmail)) {
      return NextResponse.json(
        { error: "Invalid support email format" },
        { status: 400 }
      );
    }

    // Validate contact email if provided
    if (body.contactEmail && !emailRegex.test(body.contactEmail)) {
      return NextResponse.json(
        { error: "Invalid contact email format" },
        { status: 400 }
      );
    }

    // Validate platform name length
    if (body.platformName.length > 100) {
      return NextResponse.json(
        { error: "Platform name must be 100 characters or less" },
        { status: 400 }
      );
    }

    // Validate currency
    if (!["USD", "EUR", "LBP"].includes(body.defaultCurrency)) {
      return NextResponse.json(
        { error: "Invalid currency" },
        { status: 400 }
      );
    }

    // Validate meta title length
    if (body.defaultMetaTitle && body.defaultMetaTitle.length > 160) {
      return NextResponse.json(
        { error: "Default meta title must be 160 characters or less" },
        { status: 400 }
      );
    }

    // Validate meta description length
    if (body.defaultMetaDescription && body.defaultMetaDescription.length > 300) {
      return NextResponse.json(
        { error: "Default meta description must be 300 characters or less" },
        { status: 400 }
      );
    }

    // Get the first settings record (there should only be one)
    let settings = await prisma.settings.findFirst();

    // Prepare update data
    const updateData = {
      platformName: body.platformName,
      supportEmail: body.supportEmail,
      defaultCurrency: body.defaultCurrency as Currency,
      whatsappNumber: body.whatsappNumber || null,
      contactPhone: body.contactPhone || null,
      contactEmail: body.contactEmail || null,
      defaultMetaTitle: body.defaultMetaTitle || null,
      defaultMetaDescription: body.defaultMetaDescription || null,
      homepageTitle: body.homepageTitle || null,
      homepageSubtitle: body.homepageSubtitle || null,
    };

    // Update or create settings
    if (settings) {
      settings = await prisma.settings.update({
        where: { id: settings.id },
        data: updateData,
      });
    } else {
      settings = await prisma.settings.create({
        data: updateData,
      });
    }

    // Log activity
    await logActivity({
      action: ActivityAction.UPDATE,
      entity: ActivityEntity.SETTINGS,
      entityId: settings.id,
      userEmail,
      details: {
        platformName: body.platformName,
        defaultCurrency: body.defaultCurrency,
      },
    });

    return NextResponse.json({
      success: true,
      data: settings,
    });
  } catch (error) {
    console.error("Error updating settings:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET - Fetch settings
export async function GET() {
  try {
    let settings = await prisma.settings.findFirst();

    // If no settings exist, create default settings
    if (!settings) {
      settings = await prisma.settings.create({
        data: {
          platformName: "Spot Properties",
          supportEmail: "support@spotproperties.com",
          defaultCurrency: "USD",
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: settings,
    });
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
