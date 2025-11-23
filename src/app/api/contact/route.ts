import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  validateEmail,
  validatePhone,
  validateRequired,
} from "@/lib/validation";
import { sanitizeInput, sanitizeHTML } from "@/lib/sanitize";
import { logActivity, ActivityAction, ActivityEntity } from "@/lib/activity-logger";

interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  message: string;
  propertyId?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: ContactFormData = await request.json();
    const { name, email, phone, message, propertyId } = body;

    // Validation errors object
    const errors: Record<string, string> = {};

    // Validate required fields
    if (!validateRequired(name)) {
      errors.name = "Name is required";
    } else if (name.length < 2) {
      errors.name = "Name must be at least 2 characters";
    } else if (name.length > 100) {
      errors.name = "Name must be less than 100 characters";
    }

    if (!validateRequired(email)) {
      errors.email = "Email is required";
    } else if (!validateEmail(email)) {
      errors.email = "Invalid email format";
    }

    if (!validateRequired(message)) {
      errors.message = "Message is required";
    } else if (message.length < 10) {
      errors.message = "Message must be at least 10 characters";
    } else if (message.length > 5000) {
      errors.message = "Message must be less than 5000 characters";
    }

    if (phone && !validatePhone(phone)) {
      errors.phone = "Invalid phone number format";
    }

    // Return validation errors if any
    if (Object.keys(errors).length > 0) {
      return NextResponse.json(
        { error: "Validation failed", details: errors },
        { status: 400 }
      );
    }

    // Sanitize inputs
    const sanitizedName = sanitizeInput(name);
    const sanitizedEmail = sanitizeInput(email);
    const sanitizedPhone = phone ? sanitizeInput(phone) : null;
    const sanitizedMessage = sanitizeHTML(message);

    // Create lead in database
    const lead = await db.lead.create({
      data: {
        name: sanitizedName,
        email: sanitizedEmail,
        phone: sanitizedPhone,
        message: sanitizedMessage,
        source: "contact_form",
        propertyId: propertyId || null,
      },
    });

    // Log activity
    await logActivity({
      action: ActivityAction.SUBMIT,
      entity: ActivityEntity.CONTACT,
      entityId: lead.id,
      userEmail: sanitizedEmail,
      details: {
        name: sanitizedName,
        source: "contact_form",
        propertyId: propertyId || null,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Your message has been sent. We will contact you shortly.",
      data: lead,
    });
  } catch (error) {
    console.error("Error creating lead:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
