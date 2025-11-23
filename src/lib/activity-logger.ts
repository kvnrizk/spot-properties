import { db } from "@/lib/db";

interface LogActivityParams {
  action: string;
  entity: string;
  entityId: string;
  userEmail: string;
  details?: string | object;
}

/**
 * Logs an activity to the database
 * @param params - The activity parameters
 */
export async function logActivity({
  action,
  entity,
  entityId,
  userEmail,
  details,
}: LogActivityParams): Promise<void> {
  try {
    // Convert details object to JSON string if needed
    const detailsString =
      typeof details === "object" ? JSON.stringify(details) : details;

    await db.activityLog.create({
      data: {
        action,
        entity,
        entityId,
        userEmail,
        details: detailsString || null,
      },
    });
  } catch (error) {
    // Log error but don't throw - activity logging should not break main functionality
    console.error("Failed to log activity:", error);
  }
}

/**
 * Common activity action types
 */
export const ActivityAction = {
  CREATE: "create",
  UPDATE: "update",
  DELETE: "delete",
  UPLOAD: "upload",
  REORDER: "reorder",
  STATUS_CHANGE: "status_change",
  SUBMIT: "submit",
} as const;

/**
 * Common entity types
 */
export const ActivityEntity = {
  PROPERTY: "property",
  PROPERTY_IMAGE: "property_image",
  LEAD: "lead",
  APPOINTMENT: "appointment",
  CONTACT: "contact",
  SETTINGS: "settings",
} as const;
