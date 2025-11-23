"use client";

import { X } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Yes",
  cancelText = "No",
}: ConfirmModalProps) {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-spot-dark/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-2xl max-w-md w-full mx-4 border-2 border-spot-dark/20">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b-2 border-spot-dark/10">
          <h3 className="text-xl font-bold text-spot-dark">{title}</h3>
          <button
            onClick={onClose}
            className="text-spot-dark/50 hover:text-spot-dark transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-hidden">
          <p className="text-spot-dark/80 leading-relaxed break-words whitespace-normal w-full [overflow-wrap:anywhere]">
            {message}
          </p>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t-2 border-spot-dark/10">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 rounded-md border-2 border-spot-dark/20 text-spot-dark font-semibold hover:bg-spot-beige transition-all"
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 px-6 py-3 rounded-md bg-spot-red hover:bg-spot-red/90 text-white font-semibold border-2 border-spot-red transition-all"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
