import { db } from "@/lib/db";

interface GetActivityLogsParams {
  page?: number;
  perPage?: number;
  search?: string;
  entity?: string;
  action?: string;
  startDate?: string;
  endDate?: string;
}

export async function getActivityLogs({
  page = 1,
  perPage = 30,
  search = "",
  entity,
  action,
  startDate,
  endDate,
}: GetActivityLogsParams = {}) {
  const skip = (page - 1) * perPage;

  // Build where clause
  const where: any = {};

  if (search) {
    where.OR = [
      { action: { contains: search, mode: "insensitive" } },
      { entity: { contains: search, mode: "insensitive" } },
      { userEmail: { contains: search, mode: "insensitive" } },
      { entityId: { contains: search, mode: "insensitive" } },
    ];
  }

  if (entity) {
    where.entity = entity;
  }

  if (action) {
    where.action = action;
  }

  if (startDate || endDate) {
    where.createdAt = {};
    if (startDate) {
      where.createdAt.gte = new Date(startDate);
    }
    if (endDate) {
      const endDateTime = new Date(endDate);
      endDateTime.setHours(23, 59, 59, 999);
      where.createdAt.lte = endDateTime;
    }
  }

  const [logs, total] = await Promise.all([
    db.activityLog.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: perPage,
    }),
    db.activityLog.count({ where }),
  ]);

  const totalPages = Math.ceil(total / perPage);

  return {
    logs,
    pagination: {
      page,
      perPage,
      total,
      totalPages,
    },
  };
}

export async function getUniqueEntities() {
  const result = await db.activityLog.groupBy({
    by: ["entity"],
    _count: {
      entity: true,
    },
    orderBy: {
      _count: {
        entity: "desc",
      },
    },
  });

  return result.map((r) => r.entity);
}

export async function getUniqueActions() {
  const result = await db.activityLog.groupBy({
    by: ["action"],
    _count: {
      action: true,
    },
    orderBy: {
      _count: {
        action: "desc",
      },
    },
  });

  return result.map((r) => r.action);
}
