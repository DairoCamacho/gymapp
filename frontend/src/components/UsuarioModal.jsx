import { useState, useEffect } from 'react';

const EMPTY = { nombre: '', apellido: '', telefono: '', email: '' };

export default function UsuarioModal({ isOpen, usuario, onClose, onSave }) {
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (usuario) {
      setForm({
        nombre: usuario.nombre ?? '',
        apellido: usuario.apellido ?? '',
        telefono: usuario.telefono ?? '',
        email: usuario.email ?? '',
      });
    } else {
      setForm(EMPTY);
    }
  }, [usuario, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave({ ...form });
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
          {usuario ? 'Editar usuario' : 'Crear usuario'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Nombre *</label>
              <input id="usr-nombre" name="nombre" value={form.nombre} onChange={handleChange}
                required placeholder="Juan" className={inputCls} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Apellido *</label>
              <input id="usr-apellido" name="apellido" value={form.apellido} onChange={handleChange}
                required placeholder="Pérez" className={inputCls} />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5">Email *</label>
            <input id="usr-email" name="email" type="email" value={form.email} onChange={handleChange}
              required placeholder="juan@ejemplo.com" className={inputCls} />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5">Teléfono</label>
            <input id="usr-telefono" name="telefono" value={form.telefono} onChange={handleChange}
              placeholder="+57 300 123 4567" className={inputCls} />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button type="button" id="usr-cancel" onClick={onClose} disabled={saving}
              className="px-4 py-2 text-sm font-semibold text-slate-600 rounded-lg hover:bg-slate-100 transition disabled:opacity-50">
              Cancelar
            </button>
            <button type="submit" id="usr-submit" disabled={saving}
              className="px-5 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg
                         hover:bg-indigo-700 active:scale-95 transition shadow-md shadow-indigo-200
                         disabled:opacity-60 disabled:cursor-not-allowed">
              {saving ? 'Guardando…' : usuario ? 'Guardar cambios' : 'Crear usuario'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
