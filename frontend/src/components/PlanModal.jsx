import { useState, useEffect } from 'react';

const EMPTY = { nombre: '', descripcion: '', precio: '', tiempo: '' };

export default function PlanModal({ isOpen, plan, onClose, onSave }) {
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (plan) {
      setForm({
        nombre: plan.nombre ?? '',
        descripcion: plan.descripcion ?? '',
        precio: plan.precio ?? '',
        tiempo: plan.tiempo ?? '',
      });
    } else {
      setForm(EMPTY);
    }
  }, [plan, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave({
        nombre: form.nombre,
        descripcion: form.descripcion,
        precio: Number(form.precio),   // BigDecimal en Java
        tiempo: parseInt(form.tiempo, 10), // Integer en Java
      });
    } finally {
      setSaving(false);
    }
  };

  const inputCls =
    'w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm text-slate-800 ' +
    'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-md p-7"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-bold text-slate-800 mb-5">
          {plan ? 'Editar plan' : 'Crear plan'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5">Nombre *</label>
            <input
              id="plan-nombre"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              required
              placeholder="Ej. Plan Básico"
              className={inputCls}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5">Descripción</label>
            <textarea
              id="plan-descripcion"
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
              rows={2}
              placeholder="Beneficios incluidos…"
              className={inputCls + ' resize-none'}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Precio (COP) *</label>
              <input
                id="plan-precio"
                name="precio"
                type="number"
                min="0"
                step="100"
                value={form.precio}
                onChange={handleChange}
                required
                placeholder="25000"
                className={inputCls}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Duración (días) *</label>
              <input
                id="plan-tiempo"
                name="tiempo"
                type="number"
                min="1"
                step="1"
                value={form.tiempo}
                onChange={handleChange}
                required
                placeholder="30"
                className={inputCls}
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              id="plan-modal-cancel"
              onClick={onClose}
              disabled={saving}
              className="px-4 py-2 text-sm font-semibold text-slate-600 rounded-lg hover:bg-slate-100 transition disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              id="plan-modal-submit"
              disabled={saving}
              className="px-5 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg
                         hover:bg-indigo-700 active:scale-95 transition shadow-md shadow-indigo-200
                         disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {saving ? 'Guardando…' : plan ? 'Guardar cambios' : 'Crear plan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
