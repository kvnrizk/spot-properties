import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { logActivity, ActivityAction, ActivityEntity } from "@/lib/activity-logger";
import { auth } from "@/lib/auth";

// Helper to validate CUID format
function isCUID(str: string): boolean {
  // CUID format: c + base36 string (25 chars total)
  const cuidRegex = /^c[a-z0-9]{24}$/i;
  return cuidRegex.test(str);
}

// PATCH - Toggle isHandled status
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const userEmail = session?.user?.email || "admin";

    const { id } = await params;

    // Validate ID format
    if (!id || !isCUID(id)) {
      return NextResponse.json(
        { error: "Invalid lead ID format" },
        { status: 400 }
      );
    }

    // Get current lead
    const currentLead = await prisma.lead.findUnique({
      where: { id },
    });

    if (!currentLead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    // Toggle isHandled
    const updatedLead = await prisma.lead.update({
      where: { id },
      data: {
        isHandled: !currentLead.isHandled,
      },
    });

    // Log activity
    await logActivity({
      action: ActivityAction.STATUS_CHANGE,
      entity: ActivityEntity.LEAD,
      entityId: id,
      userEmail,
      details: {
        from: currentLead.isHandled,
        to: updatedLead.isHandled,
        name: currentLead.name,
        email: currentLead.email,
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedLead,
    });
  } catch (error) {
    console.error("Error updating lead:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a lead
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const userEmail = session?.user?.email || "admin";

    const { id } = await params;

    // Validate ID format
    if (!id || !isCUID(id)) {
      return NextResponse.json(
        { error: "Invalid lead ID format" },
        { status: 400 }
      );
    }

    // Check if lead exists
    const lead = await prisma.lead.findUnique({
      where: { id },
    });

    if (!lead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    await prisma.lead.delete({
      where: { id },
    });

    // Log activity
    await logActivity({
      action: ActivityAction.DELETE,
      entity: ActivityEntity.LEAD,
      entityId: id,
      userEmail,
      details: {
        name: lead.name,
        email: lead.email,
        source: lead.source,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Lead deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting lead:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
