import { useState, useEffect } from 'react';

const EMPTY_FORM = {
  nombre: '',
  descripcion: '',
  precio: '',
  tiempo: '',
  estado: 'Activo',
};

/**
 * @param {boolean}  isOpen    - Si el modal está visible
 * @param {Object|null} membresia - null → crear, Object → editar
 * @param {Function} onClose   - Callback para cerrar sin guardar
 * @param {Function} onSave    - Callback (formData) => void
 */
export default function MembresiaModal({ isOpen, membresia, onClose, onSave }) {
  const [form, setForm] = useState(EMPTY_FORM);

  // Sincronizar formulario cuando el modal se abre con datos existentes
  useEffect(() => {
    if (membresia) {
      setForm({
        nombre: membresia.nombre,
        descripcion: membresia.descripcion,
        precio: membresia.precio,
        tiempo: membresia.tiempo,
        estado: membresia.estado,
      });
    } else {
      setForm(EMPTY_FORM);
    }
  }, [membresia, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...form, precio: Number(form.precio) });
  };

  const inputClass =
    'w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm text-slate-800 ' +
    'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition';

  return (
    /* Overlay */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      {/* Panel del modal */}
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-md p-7 animate-[fadeIn_0.15s_ease]"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-bold text-slate-800 mb-5">
          {membresia ? 'Editar membresía' : 'Crear membresía'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5">Nombre</label>
            <input
              id="modal-nombre"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              required
              placeholder="Ej. Plan Básico"
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5">Descripción</label>
            <textarea
              id="modal-descripcion"
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
              rows={2}
              placeholder="Describe los beneficios del plan"
              className={inputClass + ' resize-none'}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Precio (COP)</label>
              <input
                id="modal-precio"
                name="precio"
                type="number"
                min="0"
                value={form.precio}
                onChange={handleChange}
                required
                placeholder="25000"
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Tiempo</label>
              <input
                id="modal-tiempo"
                name="tiempo"
                value={form.tiempo}
                onChange={handleChange}
                required
                placeholder="Ej. 1 mes"
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5">Estado</label>
            <select
              id="modal-estado"
              name="estado"
              value={form.estado}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
            </select>
          </div>

          {/* Acciones */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              id="modal-cancel"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-slate-600 rounded-lg hover:bg-slate-100 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              id="modal-submit"
              className="px-5 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg
                         hover:bg-indigo-700 active:scale-95 transition shadow-md shadow-indigo-200"
            >
              {membresia ? 'Guardar cambios' : 'Crear membresía'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
