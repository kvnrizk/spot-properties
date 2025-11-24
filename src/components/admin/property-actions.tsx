"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { toast } from "sonner";
import Link from "next/link";

interface PropertyActionsProps {
  propertyId: string;
  propertyTitle: string;
}

export function PropertyActions({
  propertyId,
  propertyTitle,
}: PropertyActionsProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleConfirmDelete = async () => {
    if (isDeleting) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/properties/${propertyId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error || "Failed to delete property";
        throw new Error(errorMessage);
      }

      toast.success("Property deleted successfully");
      router.refresh();
      // Modal will be closed by ConfirmModal component after this completes
    } catch (error) {
      console.error("Error deleting property:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to delete property";
      toast.error(errorMessage);
      throw error; // Re-throw to prevent modal from closing on error
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="flex gap-2">
        <Link href={`/admin/properties/${propertyId}`}>
          <Button
            variant="outline"
            size="sm"
            className="border-gray-300 hover:bg-gray-50"
          >
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
        </Link>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowDeleteModal(true)}
          className="border-red-300 text-red-600 hover:bg-red-50"
          disabled={isDeleting}
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Delete
        </Button>
      </div>

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Property"
        message={`Are you sure you want to delete "${propertyTitle}"? This action cannot be undone.`}
        confirmText="Yes, Delete"
        cancelText="Cancel"
      />
    </>
  );
}
