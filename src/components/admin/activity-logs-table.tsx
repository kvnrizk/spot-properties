"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Eye } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ActivityLog {
  id: string;
  action: string;
  entity: string;
  entityId: string;
  userEmail: string;
  details: string | null;
  createdAt: Date;
}

interface ActivityLogsTableProps {
  logs: ActivityLog[];
  pagination: {
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
  };
}

export function ActivityLogsTable({ logs, pagination }: ActivityLogsTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedLog, setSelectedLog] = useState<ActivityLog | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", String(newPage));
    router.push(`/admin/activity?${params.toString()}`);
  };

  const handleViewDetails = (log: ActivityLog) => {
    setSelectedLog(log);
    setIsDialogOpen(true);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatActionBadge = (action: string) => {
    const colors: Record<string, string> = {
      create: "bg-green-100 text-green-800",
      update: "bg-blue-100 text-blue-800",
      delete: "bg-red-100 text-red-800",
      upload: "bg-purple-100 text-purple-800",
      reorder: "bg-yellow-100 text-yellow-800",
      status_change: "bg-orange-100 text-orange-800",
      submit: "bg-indigo-100 text-indigo-800",
    };

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${
          colors[action] || "bg-gray-100 text-gray-800"
        }`}
      >
        {action.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
      </span>
    );
  };

  const formatEntityBadge = (entity: string) => {
    return (
      <span className="px-2 py-1 rounded-md bg-gray-100 text-gray-800 text-xs font-mono">
        {entity}
      </span>
    );
  };

  const formatDetails = (details: string | null) => {
    if (!details) return null;
    try {
      return JSON.stringify(JSON.parse(details), null, 2);
    } catch {
      return details;
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Entity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Entity ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    No activity logs found
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {formatActionBadge(log.action)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {formatEntityBadge(log.entity)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                      {log.entityId.substring(0, 8)}...
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {log.userEmail}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(log.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleViewDetails(log)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Showing {(pagination.page - 1) * pagination.perPage + 1} to{" "}
              {Math.min(pagination.page * pagination.perPage, pagination.total)} of{" "}
              {pagination.total} results
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                  .filter((p) => {
                    return (
                      p === 1 ||
                      p === pagination.totalPages ||
                      Math.abs(p - pagination.page) <= 1
                    );
                  })
                  .map((p, i, arr) => (
                    <div key={p} className="flex items-center gap-1">
                      {i > 0 && arr[i - 1] !== p - 1 && (
                        <span className="text-gray-400">...</span>
                      )}
                      <Button
                        size="sm"
                        variant={p === pagination.page ? "default" : "outline"}
                        onClick={() => handlePageChange(p)}
                      >
                        {p}
                      </Button>
                    </div>
                  ))}
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Activity Log Details</DialogTitle>
          </DialogHeader>
          {selectedLog && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Action
                  </label>
                  <div className="mt-1">{formatActionBadge(selectedLog.action)}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Entity
                  </label>
                  <div className="mt-1">{formatEntityBadge(selectedLog.entity)}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Entity ID
                  </label>
                  <div className="mt-1 text-sm font-mono bg-gray-100 p-2 rounded">
                    {selectedLog.entityId}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    User Email
                  </label>
                  <div className="mt-1 text-sm">{selectedLog.userEmail}</div>
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium text-gray-500">
                    Date & Time
                  </label>
                  <div className="mt-1 text-sm">{formatDate(selectedLog.createdAt)}</div>
                </div>
              </div>

              {selectedLog.details && (
                <div>
                  <label className="text-sm font-medium text-gray-500 block mb-2">
                    Details
                  </label>
                  <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-xs font-mono">
                    {formatDetails(selectedLog.details)}
                  </pre>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
