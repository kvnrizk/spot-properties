"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/admin/page-header";
import {
  AlertCircle,
  AlertTriangle,
  Info,
  XCircle,
  Filter,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface SystemLog {
  id: string;
  level: "INFO" | "WARN" | "ERROR" | "CRITICAL";
  type: string;
  message: string;
  source: string | null;
  method: string | null;
  url: string | null;
  statusCode: number | null;
  responseTime: number | null;
  errorStack: string | null;
  errorName: string | null;
  userEmail: string | null;
  createdAt: string;
  metadata: string | null;
}

interface LogsResponse {
  logs: SystemLog[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

const levelColors = {
  INFO: "bg-blue-100 text-blue-800 border-blue-200",
  WARN: "bg-yellow-100 text-yellow-800 border-yellow-200",
  ERROR: "bg-red-100 text-red-800 border-red-200",
  CRITICAL: "bg-purple-100 text-purple-800 border-purple-200",
};

const levelIcons = {
  INFO: Info,
  WARN: AlertTriangle,
  ERROR: AlertCircle,
  CRITICAL: XCircle,
};

export default function SystemLogsPage() {
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLog, setSelectedLog] = useState<SystemLog | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    total: 0,
    pages: 0,
  });

  // Filters
  const [level, setLevel] = useState("ALL");
  const [type, setType] = useState("ALL");
  const [source, setSource] = useState("");

  useEffect(() => {
    fetchLogs();
  }, [pagination.page, level, type, source]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      });

      if (level !== "ALL") params.append("level", level);
      if (type !== "ALL") params.append("type", type);
      if (source) params.append("source", source);

      const response = await fetch(`/api/admin/system-logs?${params}`);
      const data: LogsResponse = await response.json();

      setLogs(data.logs);
      setPagination(data.pagination);
    } catch (error) {
      console.error("Failed to fetch logs:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString();
  };

  const LogIcon = ({ level }: { level: SystemLog["level"] }) => {
    const Icon = levelIcons[level];
    return <Icon className="w-4 h-4" />;
  };

  return (
    <div>
      <PageHeader
        title="System Logs"
        description="View and filter system logs, errors, and events"
      />

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-gray-600" />
          <h3 className="font-semibold text-gray-800">Filters</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Level
            </label>
            <select
              value={level}
              onChange={(e) => {
                setLevel(e.target.value);
                setPagination({ ...pagination, page: 1 });
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-spot-red"
            >
              <option value="ALL">All Levels</option>
              <option value="INFO">Info</option>
              <option value="WARN">Warning</option>
              <option value="ERROR">Error</option>
              <option value="CRITICAL">Critical</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type
            </label>
            <select
              value={type}
              onChange={(e) => {
                setType(e.target.value);
                setPagination({ ...pagination, page: 1 });
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-spot-red"
            >
              <option value="ALL">All Types</option>
              <option value="API_REQUEST">API Request</option>
              <option value="API_ERROR">API Error</option>
              <option value="SYSTEM_ERROR">System Error</option>
              <option value="CRON_JOB">Cron Job</option>
              <option value="DATABASE">Database</option>
              <option value="AUTH">Authentication</option>
              <option value="PERFORMANCE">Performance</option>
              <option value="SECURITY">Security</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Source
            </label>
            <input
              type="text"
              value={source}
              onChange={(e) => {
                setSource(e.target.value);
                setPagination({ ...pagination, page: 1 });
              }}
              placeholder="Filter by source..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-spot-red"
            />
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
          <div>
            Showing {logs.length} of {pagination.total} logs
          </div>
          <button
            onClick={() => {
              setLevel("ALL");
              setType("ALL");
              setSource("");
              setPagination({ ...pagination, page: 1 });
            }}
            className="text-spot-red hover:underline"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading logs...</div>
        ) : logs.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No logs found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Level
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Message
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Source
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium border ${levelColors[log.level]}`}
                      >
                        <LogIcon level={log.level} />
                        {log.level}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {log.type.replace(/_/g, " ")}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 max-w-md truncate">
                      {log.message}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {log.source || "-"}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {formatDate(log.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setSelectedLog(log)}
                        className="text-spot-red hover:underline text-sm"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Page {pagination.page} of {pagination.pages}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() =>
                  setPagination({ ...pagination, page: pagination.page - 1 })
                }
                disabled={pagination.page === 1}
                className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>
              <button
                onClick={() =>
                  setPagination({ ...pagination, page: pagination.page + 1 })
                }
                disabled={pagination.page === pagination.pages}
                className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Log Details Modal */}
      {selectedLog && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedLog(null)}
        >
          <div
            className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">Log Details</h3>
                <button
                  onClick={() => setSelectedLog(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm font-medium text-gray-500 mb-1">
                      Level
                    </div>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium border ${levelColors[selectedLog.level]}`}
                    >
                      <LogIcon level={selectedLog.level} />
                      {selectedLog.level}
                    </span>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-500 mb-1">
                      Type
                    </div>
                    <div className="text-sm text-gray-900">
                      {selectedLog.type.replace(/_/g, " ")}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-500 mb-1">
                      Time
                    </div>
                    <div className="text-sm text-gray-900">
                      {formatDate(selectedLog.createdAt)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-500 mb-1">
                      Source
                    </div>
                    <div className="text-sm text-gray-900">
                      {selectedLog.source || "-"}
                    </div>
                  </div>
                </div>

                <div>
                  <div className="text-sm font-medium text-gray-500 mb-1">
                    Message
                  </div>
                  <div className="text-sm text-gray-900 bg-gray-50 p-3 rounded-md">
                    {selectedLog.message}
                  </div>
                </div>

                {selectedLog.method && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm font-medium text-gray-500 mb-1">
                        Method
                      </div>
                      <div className="text-sm text-gray-900">
                        {selectedLog.method}
                      </div>
                    </div>
                    {selectedLog.statusCode && (
                      <div>
                        <div className="text-sm font-medium text-gray-500 mb-1">
                          Status Code
                        </div>
                        <div className="text-sm text-gray-900">
                          {selectedLog.statusCode}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {selectedLog.url && (
                  <div>
                    <div className="text-sm font-medium text-gray-500 mb-1">
                      URL
                    </div>
                    <div className="text-sm text-gray-900 break-all bg-gray-50 p-3 rounded-md">
                      {selectedLog.url}
                    </div>
                  </div>
                )}

                {selectedLog.responseTime && (
                  <div>
                    <div className="text-sm font-medium text-gray-500 mb-1">
                      Response Time
                    </div>
                    <div className="text-sm text-gray-900">
                      {selectedLog.responseTime}ms
                    </div>
                  </div>
                )}

                {selectedLog.userEmail && (
                  <div>
                    <div className="text-sm font-medium text-gray-500 mb-1">
                      User
                    </div>
                    <div className="text-sm text-gray-900">
                      {selectedLog.userEmail}
                    </div>
                  </div>
                )}

                {selectedLog.errorStack && (
                  <div>
                    <div className="text-sm font-medium text-gray-500 mb-1">
                      Error Stack
                    </div>
                    <pre className="text-xs text-gray-900 bg-gray-50 p-3 rounded-md overflow-x-auto">
                      {selectedLog.errorStack}
                    </pre>
                  </div>
                )}

                {selectedLog.metadata && (
                  <div>
                    <div className="text-sm font-medium text-gray-500 mb-1">
                      Metadata
                    </div>
                    <pre className="text-xs text-gray-900 bg-gray-50 p-3 rounded-md overflow-x-auto">
                      {JSON.stringify(JSON.parse(selectedLog.metadata), null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
