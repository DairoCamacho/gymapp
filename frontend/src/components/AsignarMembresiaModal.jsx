import { useState, useEffect } from 'react';

const EMPTY = { usuarioId: '', planId: '' };

export default function AsignarMembresiaModal({ isOpen, usuarios, planes, onClose, onSave }) {
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);

  // Plan seleccionado para mostrar el resumen de duración/precio
  const planSeleccionado = planes.find((p) => String(p.id) === String(form.planId)) || null;

  useEffect(() => {
    if (isOpen) { setForm(EMPTY); setSaveError(null); }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveError(null);
    try {
      await onSave({ usuarioId: Number(form.usuarioId), planId: Number(form.planId) });
    } catch (err) {
      setSaveError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const selectCls =
    'w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm text-slate-800 ' +
    'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition';

  const formatCOP = (v) =>
    new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(v);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-md p-7"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
              className="w-5 h-5 text-indigo-600">
              <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800">Asignar membresía</h2>
            <p className="text-xs text-slate-400">Vincula un usuario con un plan de membresía</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Selector de Usuario */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5">
              Usuario *
            </label>
            <select
              id="mem-usuario"
              name="usuarioId"
              value={form.usuarioId}
              onChange={handleChange}
              required
              className={selectCls}
            >
              <option value="">Selecciona un usuario…</option>
              {usuarios
                .filter((u) => u.estado === true) // solo usuarios activos
                .map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.nombre} {u.apellido} — {u.email}
                  </option>
                ))}
            </select>
          </div>

          {/* Selector de Plan */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5">
              Plan de membresía *
            </label>
            <select
              id="mem-plan"
              name="planId"
              value={form.planId}
              onChange={handleChange}
              required
              className={selectCls}
            >
              <option value="">Selecciona un plan…</option>
              {planes.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nombre} — {p.tiempo} días
                </option>
              ))}
            </select>
          </div>

          {/* Resumen del plan seleccionado */}
          {planSeleccionado && (
            <div className="rounded-lg bg-slate-50 border border-slate-200 p-4 space-y-2">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Resumen del plan</p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-slate-400 text-xs">Precio</span>
                  <p className="font-semibold text-indigo-600">
                    {formatCOP(planSeleccionado.precio)}
                  </p>
                </div>
                <div>
                  <span className="text-slate-400 text-xs">Duración</span>
                  <p className="font-semibold text-slate-700">{planSeleccionado.tiempo} días</p>
                </div>
                {planSeleccionado.descripcion && (
                  <div className="col-span-2">
                    <span className="text-slate-400 text-xs">Descripción</span>
                    <p className="text-slate-600 text-xs mt-0.5">{planSeleccionado.descripcion}</p>
                  </div>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-1">
                📅 La membresía iniciará <strong>hoy</strong> y expirará en{' '}
                <strong>{planSeleccionado.tiempo} días</strong>.
              </p>
            </div>
          )}

          {/* Error del backend */}
          {saveError && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
              {saveError}
            </div>
          )}

          {/* Acciones */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              id="mem-cancel"
              onClick={onClose}
              disabled={saving}
              className="px-4 py-2 text-sm font-semibold text-slate-600 rounded-lg
                         hover:bg-slate-100 transition disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              id="mem-submit"
              disabled={saving || !form.usuarioId || !form.planId}
              className="px-5 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg
                         hover:bg-indigo-700 active:scale-95 transition shadow-md shadow-indigo-200
                         disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Asignando…' : 'Asignar plan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
