import { useEffect } from 'react';

// ── Iconos ────────────────────────────────────────────────────────────

const WarningIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
  </svg>
);

const ErrorIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z" clipRule="evenodd" />
  </svg>
);

const InfoIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 0 1 .67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 1 1-.671-1.34l.041-.022ZM12 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
  </svg>
);

// ── Variantes de estilo ───────────────────────────────────────────────

const VARIANTS = {
  danger: {
    iconBg: 'bg-red-100',
    iconColor: 'text-red-600',
    Icon: WarningIcon,
    confirmCls: 'bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-200',
  },
  warning: {
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
    Icon: WarningIcon,
    confirmCls: 'bg-amber-500 hover:bg-amber-600 text-white shadow-md shadow-amber-200',
  },
  info: {
    iconBg: 'bg-indigo-100',
    iconColor: 'text-indigo-600',
    Icon: InfoIcon,
    confirmCls: 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-200',
  },
  error: {
    iconBg: 'bg-red-100',
    iconColor: 'text-red-600',
    Icon: ErrorIcon,
    confirmCls: 'bg-indigo-600 hover:bg-indigo-700 text-white',
  },
};

// ── ConfirmDialog ─────────────────────────────────────────────────────
export function ConfirmDialog({
  isOpen,
  title = 'Confirmar acción',
  message = '¿Estás seguro?',
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'danger',
  onConfirm,
  onCancel,
}) {
  // Cerrar con Escape
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => { if (e.key === 'Escape') onCancel?.(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  const { iconBg, iconColor, Icon, confirmCls } = VARIANTS[variant] ?? VARIANTS.danger;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 animate-[fadeIn_0.15s_ease]">
        <div className="flex items-start gap-4">
          <div className={`flex-shrink-0 w-11 h-11 rounded-full ${iconBg} flex items-center justify-center`}>
            <span className={iconColor}><Icon /></span>
          </div>
          <div className="pt-0.5 flex-1">
            <h3 className="text-base font-bold text-slate-800">{title}</h3>
            <p className="text-sm text-slate-500 mt-1 leading-relaxed">{message}</p>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button
            id="dialog-cancel"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-semibold text-slate-600 rounded-lg hover:bg-slate-100 transition"
          >
            {cancelText}
          </button>
          <button
            id="dialog-confirm"
            onClick={onConfirm}
            className={`px-5 py-2 text-sm font-semibold rounded-lg active:scale-95 transition ${confirmCls}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── AlertDialog ───────────────────────────────────────────────────────

export function AlertDialog({
  isOpen,
  title = 'Aviso',
  message = '',
  variant = 'error',
  onClose,
}) {
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => { if (e.key === 'Escape') onClose?.(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const { iconBg, iconColor, Icon } = VARIANTS[variant] ?? VARIANTS.error;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 animate-[fadeIn_0.15s_ease]">
        <div className="flex items-start gap-4">
          <div className={`flex-shrink-0 w-11 h-11 rounded-full ${iconBg} flex items-center justify-center`}>
            <span className={iconColor}><Icon /></span>
          </div>
          <div className="pt-0.5 flex-1">
            <h3 className="text-base font-bold text-slate-800">{title}</h3>
            <p className="text-sm text-slate-500 mt-1 leading-relaxed whitespace-pre-wrap">{message}</p>
          </div>
        </div>
        <div className="flex justify-end mt-6">
          <button
            id="dialog-ok"
            onClick={onClose}
            className="px-6 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg
                       hover:bg-indigo-700 active:scale-95 transition shadow-md shadow-indigo-200"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
}



