"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { useState } from "react";

interface ActivityLogsFiltersProps {
  entities: string[];
  actions: string[];
  currentFilters: {
    search?: string;
    entity?: string;
    action?: string;
    startDate?: string;
    endDate?: string;
  };
}

export function ActivityLogsFilters({
  entities,
  actions,
  currentFilters,
}: ActivityLogsFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(currentFilters.search || "");
  const [entity, setEntity] = useState(currentFilters.entity || "");
  const [action, setAction] = useState(currentFilters.action || "");
  const [startDate, setStartDate] = useState(currentFilters.startDate || "");
  const [endDate, setEndDate] = useState(currentFilters.endDate || "");

  const handleFilter = () => {
    const params = new URLSearchParams(searchParams);

    if (search) params.set("search", search);
    else params.delete("search");

    if (entity) params.set("entity", entity);
    else params.delete("entity");

    if (action) params.set("action", action);
    else params.delete("action");

    if (startDate) params.set("startDate", startDate);
    else params.delete("startDate");

    if (endDate) params.set("endDate", endDate);
    else params.delete("endDate");

    params.set("page", "1");

    router.push(`/admin/activity?${params.toString()}`);
  };

  const handleReset = () => {
    setSearch("");
    setEntity("");
    setAction("");
    setStartDate("");
    setEndDate("");
    router.push("/admin/activity");
  };

  const hasFilters =
    currentFilters.search ||
    currentFilters.entity ||
    currentFilters.action ||
    currentFilters.startDate ||
    currentFilters.endDate;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Search
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Entity
          </label>
          <select
            value={entity}
            onChange={(e) => setEntity(e.target.value)}
            className="w-full h-10 px-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-spot-red"
          >
            <option value="">All Entities</option>
            {entities.map((e) => (
              <option key={e} value={e}>
                {e.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Action
          </label>
          <select
            value={action}
            onChange={(e) => setAction(e.target.value)}
            className="w-full h-10 px-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-spot-red"
          >
            <option value="">All Actions</option>
            {actions.map((a) => (
              <option key={a} value={a}>
                {a.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Start Date
          </label>
          <Input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            End Date
          </label>
          <Input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </div>

      <div className="flex gap-2">
        <Button onClick={handleFilter} className="flex-1 md:flex-initial">
          <Search className="h-4 w-4 mr-2" />
          Apply Filters
        </Button>
        {hasFilters && (
          <Button onClick={handleReset} variant="outline">
            <X className="h-4 w-4 mr-2" />
            Reset
          </Button>
        )}
      </div>
    </div>
  );
}
