"use client";

import { useState } from "react";
import { Trash2, Check, X, MessageCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { generateWhatsAppLink, getAdminLeadWhatsAppMessage } from "@/lib/whatsapp";
import { toast } from "sonner";

interface LeadActionsProps {
  leadId: string;
  isHandled: boolean;
  leadName: string;
  leadPhone?: string | null;
  propertyTitle?: string | null;
}

export function LeadActions({ leadId, isHandled, leadName, leadPhone, propertyTitle }: LeadActionsProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleWhatsAppClick = () => {
    if (!leadPhone) {
      toast.error('No phone number available for this lead');
      return;
    }

    const message = getAdminLeadWhatsAppMessage(leadName, propertyTitle || undefined);
    const link = generateWhatsAppLink(message);
    window.open(link, '_blank', 'noopener,noreferrer');
    toast.success('Opening WhatsApp...');
  };

  const handleToggleStatus = async () => {
    if (isToggling) return;

    setIsToggling(true);
    try {
      const response = await fetch(`/api/leads/${leadId}`, {
        method: "PATCH",
      });

      if (!response.ok) {
        throw new Error("Failed to update lead");
      }

      toast.success(`Lead marked as ${!isHandled ? 'done' : 'pending'}`);
      router.refresh();
    } catch (error) {
      console.error("Error toggling lead status:", error);
      toast.error("Failed to update lead status");
    } finally {
      setIsToggling(false);
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (isDeleting) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/leads/${leadId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete lead");
      }

      toast.success("Lead deleted successfully");
      router.refresh();
    } catch (error) {
      console.error("Error deleting lead:", error);
      toast.error("Failed to delete lead");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="flex items-center gap-2">
        {/* WhatsApp Button */}
        <button
          onClick={handleWhatsAppClick}
          disabled={!leadPhone}
          className="p-2 rounded-md bg-[#25D366] text-white hover:bg-[#22c55e] transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-300"
          title={leadPhone ? "Contact via WhatsApp" : "No phone number available"}
        >
          <MessageCircle className="w-4 h-4" />
        </button>

        {/* Toggle Done Button */}
        <button
          onClick={handleToggleStatus}
          disabled={isToggling}
          className={`p-2 rounded-md transition-colors ${
            isHandled
              ? "bg-green-100 text-green-700 hover:bg-green-200"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          } disabled:opacity-50 disabled:cursor-not-allowed`}
          title={isHandled ? "Mark as pending" : "Mark as done"}
        >
          {isHandled ? (
            <Check className="w-4 h-4" />
          ) : (
            <X className="w-4 h-4" />
          )}
        </button>

        {/* Delete Button */}
        <button
          onClick={handleDeleteClick}
          disabled={isDeleting}
          className="p-2 rounded-md bg-red-100 text-red-700 hover:bg-red-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Delete lead"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Lead"
        message="Are you sure you want to delete this lead? This action cannot be undone."
        confirmText="Yes, Delete"
        cancelText="No, Cancel"
      />
    </>
  );
}
