import { useState, useEffect, useCallback } from 'react';
import { usuariosApi, membresiasApi } from '../services/api';
import { logAction } from '../utils/actionLog';
import StatusBadge from './StatusBadge';
import UsuarioModal from './UsuarioModal';
import { ConfirmDialog, AlertDialog } from './Dialog';

const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
    <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
  </svg>
);
const RefreshIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
    <path fillRule="evenodd" d="M15.312 11.424a5.5 5.5 0 0 1-9.201 2.466l-.312-.311h2.433a.75.75 0 0 0 0-1.5H3.989a.75.75 0 0 0-.75.75v4.242a.75.75 0 0 0 1.5 0v-2.43l.31.31a7 7 0 0 0 11.712-3.138.75.75 0 0 0-1.449-.39Zm1.23-3.723a.75.75 0 0 0 .219-.53V2.929a.75.75 0 0 0-1.5 0V5.36l-.31-.31A7 7 0 0 0 3.239 8.188a.75.75 0 1 0 1.448.389A5.5 5.5 0 0 1 13.89 6.11l.311.31h-2.432a.75.75 0 0 0 0 1.5h4.243a.75.75 0 0 0 .53-.219Z" clipRule="evenodd" />
  </svg>
);
const EditIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
    <path d="M13.488 2.513a1.75 1.75 0 0 0-2.475 0L6.75 6.774a2.75 2.75 0 0 0-.596.892l-.392 1.099a.75.75 0 0 0 .96.96l1.099-.392c.34-.12.647-.318.892-.596l4.261-4.263a1.75 1.75 0 0 0 0-2.475ZM4.75 7.5a.75.75 0 0 0-.75.75v.25H3.5v-.25a.75.75 0 0 0-.75-.75H2.5a.75.75 0 0 0-.75.75v4a.75.75 0 0 0 .75.75H6a.75.75 0 0 0 .75-.75v-.25h.25a.75.75 0 0 0 .75-.75v-.25h.25a.75.75 0 0 0 0-1.5H7.5v-.25A.75.75 0 0 0 6.75 9H6.5v-.25A.75.75 0 0 0 5.75 8H4.75v-.5Z" />
  </svg>
);
const DeactivateIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
    <path fillRule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14Zm2.78-4.22a.75.75 0 0 1-1.06 0L8 9.06l-1.72 1.72a.75.75 0 0 1-1.06-1.06L6.94 8 5.22 6.28a.75.75 0 0 1 1.06-1.06L8 6.94l1.72-1.72a.75.75 0 1 1 1.06 1.06L9.06 8l1.72 1.72a.75.75 0 0 1 0 1.06Z" clipRule="evenodd" />
  </svg>
);
const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
    <path fillRule="evenodd" d="M5 3.25V4H2.75a.75.75 0 0 0 0 1.5h.3l.815 8.15A1.5 1.5 0 0 0 5.357 15h5.285a1.5 1.5 0 0 0 1.493-1.35l.815-8.15h.3a.75.75 0 0 0 0-1.5H11v-.75A2.25 2.25 0 0 0 8.75 1h-1.5A2.25 2.25 0 0 0 5 3.25Zm2.25-.75a.75.75 0 0 0-.75.75V4h3v-.75a.75.75 0 0 0-.75-.75h-1.5ZM6.05 6a.75.75 0 0 1 .787.713l.275 5.5a.75.75 0 0 1-1.498.075l-.275-5.5A.75.75 0 0 1 6.05 6Zm3.9 0a.75.75 0 0 1 .712.787l-.275 5.5a.75.75 0 0 1-1.498-.075l.275-5.5a.75.75 0 0 1 .786-.712Z" clipRule="evenodd" />
  </svg>
);

const COLS = ['Nombre', 'Apellido', 'Teléfono', 'Email', 'Estado', 'Acciones'];

export default function UsuarioView() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);

  const [confirm, setConfirm] = useState({ open: false });
  const [alert, setAlert] = useState({ open: false, title: '', message: '' });

  const showAlert = (title, message) => setAlert({ open: true, title, message });

  const cargar = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setUsuarios(await usuariosApi.listar());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { cargar(); }, [cargar]);

  const handleCreate = () => { setEditUser(null); setModalOpen(true); };
  const handleEdit = (u) => { setEditUser(u); setModalOpen(true); };

  const handleSave = async (formData) => {
    try {
      if (editUser) await usuariosApi.actualizar(editUser.id, formData);
      else await usuariosApi.crear(formData);
      setModalOpen(false);
      cargar();
    } catch (err) {
      showAlert('Error al guardar', err.message);
    }
  };

  const openConfirm = (u, action) =>
    setConfirm({ open: true, userId: u.id, userName: `${u.nombre} ${u.apellido}`, action });

  const handleConfirm = async () => {
    const { userId, userName, action } = confirm;
    setConfirm((s) => ({ ...s, open: false }));
    try {
      // 1. Obtener membresías activas del usuario
      const membresiasActivas = await membresiasApi.listarActivas(userId);

      // 2. Anular cada membresía activa (cascada manual desde frontend)
      for (const mem of membresiasActivas) {
        await membresiasApi.anular(mem.id);
        logAction('membresia', mem.id, `${mem.usuarioNombre} — ${mem.planNombre}`, 'anulado');
      }

      // 3. Eliminar (soft-delete) el usuario
      await usuariosApi.eliminar(userId);
      logAction('usuario', userId, userName, action);

      cargar();
    } catch (err) {
      showAlert('Error', err.message);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Usuarios</h1>
          <p className="text-sm text-slate-400 mt-0.5">
            {loading ? 'Cargando…' : `${usuarios.length} usuario${usuarios.length !== 1 ? 's' : ''} activo${usuarios.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button id="btn-refrescar-usuarios" onClick={cargar} disabled={loading}
            className="inline-flex items-center px-3 py-2.5 text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-100 transition disabled:opacity-50">
            <RefreshIcon />
          </button>
          <button id="btn-crear-usuario" onClick={handleCreate}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white text-sm font-semibold
                       rounded-lg shadow-md shadow-indigo-200 hover:bg-indigo-700 active:scale-95 transition-all">
            <PlusIcon /> Crear usuario
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700 flex justify-between">
          <span><strong>Error:</strong> {error}</span>
          <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600 font-bold">×</button>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                {COLS.map((c) => (
                  <th key={c} className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">{c}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i}>{Array.from({ length: 6 }).map((_, j) => (
                    <td key={j} className="px-5 py-4">
                      <div className="h-4 bg-slate-100 rounded animate-pulse" style={{ width: j === 3 ? '80%' : '60%' }} />
                    </td>
                  ))}</tr>
                ))
              ) : usuarios.length === 0 ? (
                <tr><td colSpan={6} className="px-5 py-12 text-center text-slate-400 text-sm">No hay usuarios activos.</td></tr>
              ) : (
                usuarios.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-5 py-4 font-medium text-slate-800">{u.nombre}</td>
                    <td className="px-5 py-4 text-slate-600">{u.apellido}</td>
                    <td className="px-5 py-4 text-slate-500">{u.telefono || '—'}</td>
                    <td className="px-5 py-4 text-slate-500">{u.email}</td>
                    <td className="px-5 py-4"><StatusBadge activo={u.estado} /></td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5">
                        <button id={`btn-editar-usuario-${u.id}`} onClick={() => handleEdit(u)}
                          className="action-btn text-indigo-600 bg-indigo-50 hover:bg-indigo-100 ring-1 ring-indigo-100">
                          <EditIcon /> Editar
                        </button>
                        <button id={`btn-eliminar-usuario-${u.id}`} onClick={() => openConfirm(u, 'eliminado')}
                          className="action-btn text-slate-500 bg-slate-50 hover:bg-red-50 hover:text-red-600
                                     ring-1 ring-slate-100 hover:ring-red-100">
                          <TrashIcon /> Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <UsuarioModal isOpen={modalOpen} usuario={editUser} onClose={() => setModalOpen(false)} onSave={handleSave} />

      <ConfirmDialog
        isOpen={confirm.open}
        variant="danger"
        title="Eliminar usuario"
        message={`¿Eliminar a "${confirm.userName}"? Desaparecerá de la vista y quedará registrado en el historial.`}
        confirmText="Sí, eliminar"
        cancelText="Cancelar"
        onConfirm={handleConfirm}
        onCancel={() => setConfirm((s) => ({ ...s, open: false }))}
      />

      <AlertDialog isOpen={alert.open} title={alert.title} message={alert.message}
        variant="error" onClose={() => setAlert((s) => ({ ...s, open: false }))} />
    </div>
  );
}
