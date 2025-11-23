import { PageHeader } from "@/components/admin/page-header";
import { Loader2 } from "lucide-react";

export default function SettingsLoading() {
  return (
    <div>
      <PageHeader
        title="Settings"
        description="Manage global configuration for Spot Properties."
      />

      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-spot-red" />
      </div>
    </div>
  );
}
