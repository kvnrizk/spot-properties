"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface SettingsFormProps {
  initialData: {
    platformName: string;
    supportEmail: string;
    defaultCurrency: string;
    whatsappNumber: string | null;
    contactPhone: string | null;
    contactEmail: string | null;
    defaultMetaTitle: string | null;
    defaultMetaDescription: string | null;
    homepageTitle: string | null;
    homepageSubtitle: string | null;
  };
}

export function SettingsForm({ initialData }: SettingsFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState(initialData);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/settings", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to save settings");
      }

      toast.success("Settings saved successfully");
      router.refresh();
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Failed to save settings");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* General Settings */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-spot-dark mb-4">
          General Settings
        </h2>
        <div className="space-y-4">
          <div>
            <Label htmlFor="platformName">Platform Name</Label>
            <Input
              id="platformName"
              value={formData.platformName}
              onChange={(e) => handleChange("platformName", e.target.value)}
              maxLength={100}
              required
              className="mt-1.5"
            />
            <p className="text-xs text-gray-500 mt-1">
              Maximum 100 characters
            </p>
          </div>

          <div>
            <Label htmlFor="supportEmail">Support Email</Label>
            <Input
              id="supportEmail"
              type="email"
              value={formData.supportEmail}
              onChange={(e) => handleChange("supportEmail", e.target.value)}
              required
              className="mt-1.5"
            />
          </div>

          <div>
            <Label htmlFor="defaultCurrency">Default Currency</Label>
            <Select
              value={formData.defaultCurrency}
              onValueChange={(value) => handleChange("defaultCurrency", value)}
            >
              <SelectTrigger className="mt-1.5">
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">USD - US Dollar</SelectItem>
                <SelectItem value="EUR">EUR - Euro</SelectItem>
                <SelectItem value="LBP">LBP - Lebanese Pound</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      <Separator />

      {/* Contact & WhatsApp */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-spot-dark mb-4">
          Contact & WhatsApp
        </h2>
        <div className="space-y-4">
          <div>
            <Label htmlFor="whatsappNumber">WhatsApp Number</Label>
            <Input
              id="whatsappNumber"
              type="tel"
              value={formData.whatsappNumber || ""}
              onChange={(e) => handleChange("whatsappNumber", e.target.value)}
              placeholder="+1234567890"
              className="mt-1.5"
            />
            <p className="text-xs text-gray-500 mt-1">
              International format required (e.g., +1234567890)
            </p>
          </div>

          <div>
            <Label htmlFor="contactPhone">Contact Phone</Label>
            <Input
              id="contactPhone"
              type="tel"
              value={formData.contactPhone || ""}
              onChange={(e) => handleChange("contactPhone", e.target.value)}
              className="mt-1.5"
            />
          </div>

          <div>
            <Label htmlFor="contactEmail">Contact Email</Label>
            <Input
              id="contactEmail"
              type="email"
              value={formData.contactEmail || ""}
              onChange={(e) => handleChange("contactEmail", e.target.value)}
              className="mt-1.5"
            />
          </div>
        </div>
      </Card>

      <Separator />

      {/* SEO Defaults */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-spot-dark mb-4">
          SEO Defaults
        </h2>
        <div className="space-y-4">
          <div>
            <Label htmlFor="defaultMetaTitle">Default Meta Title</Label>
            <Input
              id="defaultMetaTitle"
              value={formData.defaultMetaTitle || ""}
              onChange={(e) =>
                handleChange("defaultMetaTitle", e.target.value)
              }
              maxLength={160}
              className="mt-1.5"
            />
            <p className="text-xs text-gray-500 mt-1">
              Maximum 160 characters
            </p>
          </div>

          <div>
            <Label htmlFor="defaultMetaDescription">
              Default Meta Description
            </Label>
            <Textarea
              id="defaultMetaDescription"
              value={formData.defaultMetaDescription || ""}
              onChange={(e) =>
                handleChange("defaultMetaDescription", e.target.value)
              }
              maxLength={300}
              rows={4}
              className="mt-1.5"
            />
            <p className="text-xs text-gray-500 mt-1">
              Maximum 300 characters
            </p>
          </div>
        </div>
      </Card>

      <Separator />

      {/* Home Page Configuration */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-spot-dark mb-4">
          Home Page Configuration
        </h2>
        <div className="space-y-4">
          <div>
            <Label htmlFor="homepageTitle">Homepage Title</Label>
            <Input
              id="homepageTitle"
              value={formData.homepageTitle || ""}
              onChange={(e) => handleChange("homepageTitle", e.target.value)}
              className="mt-1.5"
            />
          </div>

          <div>
            <Label htmlFor="homepageSubtitle">Homepage Subtitle</Label>
            <Textarea
              id="homepageSubtitle"
              value={formData.homepageSubtitle || ""}
              onChange={(e) =>
                handleChange("homepageSubtitle", e.target.value)
              }
              rows={3}
              className="mt-1.5"
            />
          </div>
        </div>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading} size="lg">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Settings"
          )}
        </Button>
      </div>
    </form>
  );
}
