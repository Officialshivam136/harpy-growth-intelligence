import React from 'react';
import { AlertTriangle, Trash2 } from 'lucide-react';
import { Button } from '../common/Button';

export function DeleteConfirmModal({ isOpen, onClose, onConfirm, brand, isDeleting = false }) {
  if (!isOpen || !brand) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="relative w-full max-w-md bg-harpy-charcoal border border-rose-900/50 rounded-2xl shadow-2xl p-6 z-10 animate-in fade-in zoom-in-95 duration-150">
        <div className="w-12 h-12 rounded-xl bg-rose-950/60 border border-rose-700/50 flex items-center justify-center text-rose-400 mb-4 shadow-lg shadow-rose-950/50">
          <AlertTriangle className="w-6 h-6" />
        </div>

        <h3 className="text-base font-bold text-white mb-1.5">
          Delete Brand: {brand.name}?
        </h3>
        <p className="text-xs text-harpy-subtle leading-relaxed mb-6">
          Are you sure you want to disconnect and delete <span className="text-slate-100 font-semibold">{brand.name}</span> ({brand.code}) from your agency portfolio? All cached SP-API settlement history, advertising snapshots, and custom bid rules will be removed.
        </p>

        <div className="flex items-center justify-end gap-3 pt-2 border-t border-harpy-cardBorder/60">
          <Button variant="outline" size="sm" onClick={onClose} disabled={isDeleting}>
            Cancel
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={onConfirm}
            isLoading={isDeleting}
            leftIcon={<Trash2 className="w-3.5 h-3.5" />}
          >
            Confirm & Delete
          </Button>
        </div>
      </div>
    </div>
  );
}

export default DeleteConfirmModal;

