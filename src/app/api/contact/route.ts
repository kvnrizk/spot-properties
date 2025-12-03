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

// Test endpoint to verify API is working
export async function GET() {
  try {
    // Test database connection
    await db.$queryRaw`SELECT 1`;
    return NextResponse.json({
      status: "ok",
      message: "Contact API is working",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Database connection error:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "Database connection failed",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
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
    } else if (message.length < 3) {
      errors.message = "Message must be at least 3 characters";
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

    // Format phone number for WhatsApp: +961 XX XXX XXX
    let sanitizedPhone = null;
    if (phone) {
      try {
        // Remove all non-digit characters
        const digitsOnly = phone.replace(/\D/g, "");

        // Check if it starts with 961 (Lebanon country code)
        if (digitsOnly.startsWith("961")) {
          // Format: +961 XX XXX XXX
          const countryCode = "961";
          const rest = digitsOnly.substring(3);
          if (rest.length >= 8) {
            sanitizedPhone = `+${countryCode} ${rest.substring(0, 2)} ${rest.substring(2, 5)} ${rest.substring(5)}`;
          } else {
            sanitizedPhone = `+${countryCode} ${rest}`;
          }
        } else if (digitsOnly.length >= 8) {
          // Assume it's a local number, add +961
          sanitizedPhone = `+961 ${digitsOnly.substring(0, 2)} ${digitsOnly.substring(2, 5)} ${digitsOnly.substring(5)}`;
        } else {
          sanitizedPhone = sanitizeInput(phone);
        }
      } catch (error) {
        // If formatting fails, just sanitize the input
        sanitizedPhone = sanitizeInput(phone);
      }
    }

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

    // Log more detailed error information
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    const errorStack = error instanceof Error ? error.stack : "";

    console.error("Error details:", {
      message: errorMessage,
      stack: errorStack,
    });

    return NextResponse.json(
      {
        error: "Internal server error",
        details: process.env.NODE_ENV === "development" ? errorMessage : undefined
      },
      { status: 500 }
    );
  }
}
