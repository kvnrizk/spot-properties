import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  validateEmail,
  validatePhone,
  validateRequired,
} from "@/lib/validation";
import { sanitizeInput, sanitizeHTML } from "@/lib/sanitize";
import { logActivity, ActivityAction, ActivityEntity } from "@/lib/activity-logger";

interface AppointmentFormData {
  name: string;
  email: string;
  phone?: string;
  date: string;
  propertyId: string;
  message?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: AppointmentFormData = await request.json();
    const { name, email, phone, date, propertyId, message } = body;

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

    if (phone && !validatePhone(phone)) {
      errors.phone = "Invalid phone number format";
    }

    if (!validateRequired(propertyId)) {
      errors.propertyId = "Property is required";
    }

    // Validate date
    if (!validateRequired(date)) {
      errors.date = "Date is required";
    } else {
      const appointmentDate = new Date(date);
      if (isNaN(appointmentDate.getTime())) {
        errors.date = "Invalid date format";
      } else if (appointmentDate < new Date()) {
        errors.date = "Appointment date must be in the future";
      }
    }

    if (message && message.length > 1000) {
      errors.message = "Message must be less than 1000 characters";
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
    let sanitizedPhone = "";
    if (phone) {
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
    }

    const sanitizedMessage = message ? sanitizeHTML(message) : null;
    const appointmentDate = new Date(date);

    // Create appointment in database
    const appointment = await db.appointment.create({
      data: {
        name: sanitizedName,
        email: sanitizedEmail,
        phone: sanitizedPhone,
        date: appointmentDate,
        propertyId,
        message: sanitizedMessage,
      },
    });

    // Log activity
    await logActivity({
      action: ActivityAction.CREATE,
      entity: ActivityEntity.APPOINTMENT,
      entityId: appointment.id,
      userEmail: sanitizedEmail,
      details: {
        name: sanitizedName,
        propertyId,
        date: appointmentDate.toISOString(),
      },
    });

    return NextResponse.json({
      success: true,
      message:
        "Your appointment request has been submitted. We will contact you to confirm.",
      data: appointment,
    });
  } catch (error) {
    console.error("Error creating appointment:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
