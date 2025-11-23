"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/admin/page-header";
import {
  Server,
  Database,
  GitBranch,
  Clock,
  AlertCircle,
  CheckCircle,
  Activity,
  HardDrive,
  Cpu,
  Calendar,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";

interface SystemStatus {
  deployment: {
    version: string;
    commitMessage: string;
    branch: string;
    deployedAt: string | null;
  };
  database: {
    status: "healthy" | "slow" | "error";
    responseTime: number;
  };
  recentErrors: Array<{
    id: string;
    level: string;
    type: string;
    message: string;
    source: string | null;
    createdAt: string;
  }>;
  cronStatus: Array<{
    name: string;
    displayName: string;
    schedule: string;
    lastRun: {
      status: string;
      startedAt: string;
      completedAt: string | null;
      duration: number | null;
      message: string | null;
    } | null;
  }>;
  systemInfo: {
    uptime: number;
    nodeVersion: string;
    platform: string;
    memory: {
      used: number;
      total: number;
      rss: number;
    };
  };
  logStats: {
    totalLogs: number;
    last24h: number;
    errorCounts: Record<string, number>;
  };
}

export default function SystemDashboardPage() {
  const [status, setStatus] = useState<SystemStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  const fetchStatus = async () => {
    try {
      const response = await fetch("/api/admin/system-status");
      const data = await response.json();
      setStatus(data);
      setLastRefresh(new Date());
    } catch (error) {
      console.error("Failed to fetch system status:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (days > 0) return `${days}d ${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const formatBytes = (bytes: number) => {
    const mb = bytes / 1024 / 1024;
    return `${mb.toFixed(2)} MB`;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
      case "SUCCESS":
        return "text-green-600";
      case "slow":
      case "RUNNING":
        return "text-yellow-600";
      case "error":
      case "FAILED":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "healthy":
      case "SUCCESS":
        return <CheckCircle className="w-5 h-5" />;
      case "slow":
      case "RUNNING":
        return <Clock className="w-5 h-5" />;
      case "error":
      case "FAILED":
        return <AlertCircle className="w-5 h-5" />;
      default:
        return <Activity className="w-5 h-5" />;
    }
  };

  if (loading) {
    return (
      <div>
        <PageHeader
          title="System Status"
          description="Production deployment and system health"
        />
        <div className="text-center py-8 text-gray-500">
          Loading system status...
        </div>
      </div>
    );
  }

  if (!status) {
    return (
      <div>
        <PageHeader
          title="System Status"
          description="Production deployment and system health"
        />
        <div className="text-center py-8 text-red-500">
          Failed to load system status
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <PageHeader
          title="System Status"
          description="Production deployment and system health"
        />
        <div className="text-sm text-gray-500">
          Last refresh: {lastRefresh.toLocaleTimeString()}
          <button
            onClick={fetchStatus}
            className="ml-4 text-spot-red hover:underline"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Deployment Info */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <GitBranch className="w-5 h-5 text-spot-red" />
            <h3 className="font-semibold text-gray-800">Deployment</h3>
          </div>
          <div className="space-y-2 text-sm">
            <div>
              <div className="text-gray-500">Version</div>
              <div className="font-mono text-gray-900">
                {status.deployment.version}
              </div>
            </div>
            <div>
              <div className="text-gray-500">Branch</div>
              <div className="text-gray-900">{status.deployment.branch}</div>
            </div>
          </div>
        </div>

        {/* Database Status */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Database className="w-5 h-5 text-spot-red" />
            <h3 className="font-semibold text-gray-800">Database</h3>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <span
                className={`flex items-center gap-1 ${getStatusColor(status.database.status)}`}
              >
                {getStatusIcon(status.database.status)}
                {status.database.status}
              </span>
            </div>
            <div>
              <div className="text-gray-500">Response Time</div>
              <div className="text-gray-900">
                {status.database.responseTime}ms
              </div>
            </div>
          </div>
        </div>

        {/* System Uptime */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Server className="w-5 h-5 text-spot-red" />
            <h3 className="font-semibold text-gray-800">System</h3>
          </div>
          <div className="space-y-2 text-sm">
            <div>
              <div className="text-gray-500">Uptime</div>
              <div className="text-gray-900">
                {formatUptime(status.systemInfo.uptime)}
              </div>
            </div>
            <div>
              <div className="text-gray-500">Node</div>
              <div className="text-gray-900">{status.systemInfo.nodeVersion}</div>
            </div>
          </div>
        </div>

        {/* Logs */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Activity className="w-5 h-5 text-spot-red" />
            <h3 className="font-semibold text-gray-800">Logs</h3>
          </div>
          <div className="space-y-2 text-sm">
            <div>
              <div className="text-gray-500">Last 24h</div>
              <div className="text-gray-900">{status.logStats.last24h}</div>
            </div>
            <div>
              <div className="text-gray-500">Errors</div>
              <div className="text-red-600">
                {(status.logStats.errorCounts.ERROR || 0) +
                  (status.logStats.errorCounts.CRITICAL || 0)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Memory Usage */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
        <div className="flex items-center gap-3 mb-4">
          <HardDrive className="w-5 h-5 text-spot-red" />
          <h3 className="font-semibold text-gray-800">Memory Usage</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <div className="text-sm text-gray-500 mb-1">Heap Used</div>
            <div className="text-2xl font-semibold text-gray-900">
              {formatBytes(status.systemInfo.memory.used)}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-500 mb-1">Heap Total</div>
            <div className="text-2xl font-semibold text-gray-900">
              {formatBytes(status.systemInfo.memory.total)}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-500 mb-1">RSS</div>
            <div className="text-2xl font-semibold text-gray-900">
              {formatBytes(status.systemInfo.memory.rss)}
            </div>
          </div>
        </div>
        <div className="mt-4">
          <div className="bg-gray-200 rounded-full h-2">
            <div
              className="bg-spot-red rounded-full h-2"
              style={{
                width: `${(status.systemInfo.memory.used / status.systemInfo.memory.total) * 100}%`,
              }}
            />
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {(
              (status.systemInfo.memory.used / status.systemInfo.memory.total) *
              100
            ).toFixed(1)}
            % used
          </div>
        </div>
      </div>

      {/* Cron Jobs */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Calendar className="w-5 h-5 text-spot-red" />
          <h3 className="font-semibold text-gray-800">Cron Jobs</h3>
        </div>
        <div className="space-y-4">
          {status.cronStatus.map((cron) => (
            <div
              key={cron.name}
              className="border border-gray-200 rounded-lg p-4"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="font-medium text-gray-900">
                    {cron.displayName}
                  </div>
                  <div className="text-sm text-gray-500">{cron.schedule}</div>
                </div>
                {cron.lastRun && (
                  <span
                    className={`flex items-center gap-1 text-sm ${getStatusColor(cron.lastRun.status)}`}
                  >
                    {getStatusIcon(cron.lastRun.status)}
                    {cron.lastRun.status}
                  </span>
                )}
              </div>
              {cron.lastRun ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="text-gray-500">Last Run</div>
                    <div className="text-gray-900">
                      {formatDate(cron.lastRun.startedAt)}
                    </div>
                  </div>
                  {cron.lastRun.duration && (
                    <div>
                      <div className="text-gray-500">Duration</div>
                      <div className="text-gray-900">
                        {cron.lastRun.duration}ms
                      </div>
                    </div>
                  )}
                  {cron.lastRun.message && (
                    <div className="col-span-2">
                      <div className="text-gray-500">Message</div>
                      <div className="text-gray-900">{cron.lastRun.message}</div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-sm text-gray-500">Never executed</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Recent Errors */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-spot-red" />
            <h3 className="font-semibold text-gray-800">
              Recent Errors (Last 24h)
            </h3>
          </div>
          <Link
            href="/admin/system-logs"
            className="text-spot-red hover:underline text-sm"
          >
            View All Logs
          </Link>
        </div>
        {status.recentErrors.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No errors in the last 24 hours
          </div>
        ) : (
          <div className="space-y-3">
            {status.recentErrors.map((error) => (
              <div
                key={error.id}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`text-xs px-2 py-1 rounded ${error.level === "CRITICAL" ? "bg-purple-100 text-purple-800" : "bg-red-100 text-red-800"}`}
                      >
                        {error.level}
                      </span>
                      <span className="text-xs text-gray-500">
                        {error.type.replace(/_/g, " ")}
                      </span>
                    </div>
                    <div className="text-sm text-gray-900 mb-1">
                      {error.message}
                    </div>
                    {error.source && (
                      <div className="text-xs text-gray-500">
                        Source: {error.source}
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-gray-500 ml-4 whitespace-nowrap">
                    {formatDate(error.createdAt)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
