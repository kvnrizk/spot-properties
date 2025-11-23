import { Suspense } from "react";
import { PageHeader } from "@/components/admin/page-header";
import { ActivityLogsTable } from "@/components/admin/activity-logs-table";
import { ActivityLogsFilters } from "@/components/admin/activity-logs-filters";
import { getActivityLogs, getUniqueEntities, getUniqueActions } from "@/lib/activity-logs";

interface ActivityPageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    entity?: string;
    action?: string;
    startDate?: string;
    endDate?: string;
  }>;
}

export default async function ActivityLogsPage({ searchParams }: ActivityPageProps) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const search = params.search || "";
  const entity = params.entity || undefined;
  const action = params.action || undefined;
  const startDate = params.startDate || undefined;
  const endDate = params.endDate || undefined;

  const [{ logs, pagination }, entities, actions] = await Promise.all([
    getActivityLogs({
      page,
      search,
      entity,
      action,
      startDate,
      endDate,
    }),
    getUniqueEntities(),
    getUniqueActions(),
  ]);

  return (
    <div>
      <PageHeader
        title="Activity Logs"
        description="Track all administrative actions and system events"
      />

      <Suspense fallback={<div>Loading filters...</div>}>
        <ActivityLogsFilters
          entities={entities}
          actions={actions}
          currentFilters={{
            search,
            entity,
            action,
            startDate,
            endDate,
          }}
        />
      </Suspense>

      <div className="mt-6">
        <Suspense fallback={<div>Loading activity logs...</div>}>
          <ActivityLogsTable logs={logs} pagination={pagination} />
        </Suspense>
      </div>
    </div>
  );
}
