import { db } from "@/lib/db";

/**
 * Get property statistics
 */
export async function getPropertyStats() {
  const [total, published, draft] = await Promise.all([
    db.property.count(),
    db.property.count({ where: { isPublished: true } }),
    db.property.count({ where: { isPublished: false } }),
  ]);

  return {
    total,
    published,
    draft,
  };
}

/**
 * Get lead statistics
 */
export async function getLeadStats() {
  const [total, pending, handled] = await Promise.all([
    db.lead.count(),
    db.lead.count({ where: { isHandled: false } }),
    db.lead.count({ where: { isHandled: true } }),
  ]);

  return {
    total,
    pending,
    handled,
  };
}

/**
 * Get appointment statistics
 */
export async function getAppointmentStats() {
  const now = new Date();

  const [total, upcoming] = await Promise.all([
    db.appointment.count(),
    db.appointment.count({
      where: {
        date: {
          gte: now,
        },
      },
    }),
  ]);

  return {
    total,
    upcoming,
  };
}

/**
 * Get properties created per month for the last 12 months
 */
export async function getPropertiesPerMonth() {
  const twelveMonthsAgo = new Date();
  twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

  const properties = await db.property.findMany({
    where: {
      createdAt: {
        gte: twelveMonthsAgo,
      },
    },
    select: {
      createdAt: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  // Group by month
  const monthlyData = new Map<string, number>();

  // Initialize all 12 months with 0
  for (let i = 11; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    monthlyData.set(key, 0);
  }

  // Count properties per month
  properties.forEach((property) => {
    const date = property.createdAt;
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    monthlyData.set(key, (monthlyData.get(key) || 0) + 1);
  });

  return Array.from(monthlyData.entries()).map(([month, count]) => ({
    month,
    count,
  }));
}

/**
 * Get leads received per month for the last 12 months
 */
export async function getLeadsPerMonth() {
  const twelveMonthsAgo = new Date();
  twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

  const leads = await db.lead.findMany({
    where: {
      createdAt: {
        gte: twelveMonthsAgo,
      },
    },
    select: {
      createdAt: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  // Group by month
  const monthlyData = new Map<string, number>();

  // Initialize all 12 months with 0
  for (let i = 11; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    monthlyData.set(key, 0);
  }

  // Count leads per month
  leads.forEach((lead) => {
    const date = lead.createdAt;
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    monthlyData.set(key, (monthlyData.get(key) || 0) + 1);
  });

  return Array.from(monthlyData.entries()).map(([month, count]) => ({
    month,
    count,
  }));
}

/**
 * Get appointments booked per month for the last 12 months
 */
export async function getAppointmentsPerMonth() {
  const twelveMonthsAgo = new Date();
  twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

  const appointments = await db.appointment.findMany({
    where: {
      createdAt: {
        gte: twelveMonthsAgo,
      },
    },
    select: {
      createdAt: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  // Group by month
  const monthlyData = new Map<string, number>();

  // Initialize all 12 months with 0
  for (let i = 11; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    monthlyData.set(key, 0);
  }

  // Count appointments per month
  appointments.forEach((appointment) => {
    const date = appointment.createdAt;
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    monthlyData.set(key, (monthlyData.get(key) || 0) + 1);
  });

  return Array.from(monthlyData.entries()).map(([month, count]) => ({
    month,
    count,
  }));
}

/**
 * Get all analytics data for dashboard
 */
export async function getDashboardAnalytics() {
  const [
    propertyStats,
    leadStats,
    appointmentStats,
    propertiesPerMonth,
    leadsPerMonth,
    appointmentsPerMonth,
  ] = await Promise.all([
    getPropertyStats(),
    getLeadStats(),
    getAppointmentStats(),
    getPropertiesPerMonth(),
    getLeadsPerMonth(),
    getAppointmentsPerMonth(),
  ]);

  return {
    propertyStats,
    leadStats,
    appointmentStats,
    charts: {
      propertiesPerMonth,
      leadsPerMonth,
      appointmentsPerMonth,
    },
  };
}
