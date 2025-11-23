import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/admin/page-header";
import { SettingsForm } from "./settings-form";

async function getSettings() {
  // Get the first (and should be only) settings record
  let settings = await prisma.settings.findFirst();

  // If no settings exist, create default settings
  if (!settings) {
    settings = await prisma.settings.create({
      data: {
        platformName: "Spot Properties",
        supportEmail: "support@spotproperties.com",
        defaultCurrency: "USD",
      },
    });
  }

  return settings;
}

export default async function SettingsPage() {
  const settings = await getSettings();

  return (
    <div>
      <PageHeader
        title="Settings"
        description="Manage global configuration for Spot Properties."
      />

      <SettingsForm initialData={settings} />
    </div>
  );
}
