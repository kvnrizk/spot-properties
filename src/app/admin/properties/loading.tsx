import { TableLoading } from "@/components/admin/table-loading";

export default function PropertiesLoading() {
  return (
    <div>
      <div className="animate-pulse mb-6">
        <div className="h-8 bg-gray-200 rounded w-48 mb-2" />
        <div className="h-4 bg-gray-100 rounded w-64" />
      </div>

      <div className="mb-4 animate-pulse">
        <div className="h-10 bg-gray-200 rounded w-full max-w-md" />
      </div>

      <TableLoading rows={10} columns={7} />
    </div>
  );
}
