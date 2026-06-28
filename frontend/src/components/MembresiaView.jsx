import { useState, useEffect, useCallback } from 'react';
import { membresiasApi, usuariosApi, planesApi } from '../services/api';
import { logAction, getActionForEntity } from '../utils/actionLog';
import StatusBadge from './StatusBadge';
import AsignarMembresiaModal from './AsignarMembresiaModal';
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
const BanIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
    <path fillRule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14Zm2.78-4.22a.75.75 0 0 1-1.06 0L8 9.06l-1.72 1.72a.75.75 0 0 1-1.06-1.06L6.94 8 5.22 6.28a.75.75 0 0 1 1.06-1.06L8 6.94l1.72-1.72a.75.75 0 1 1 1.06 1.06L9.06 8l1.72 1.72a.75.75 0 0 1 0 1.06Z" clipRule="evenodd" />
  </svg>
);
const ActivateIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
    <path fillRule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14Zm.75-10.25v2.5h2.5a.75.75 0 0 1 0 1.5h-2.5v2.5a.75.75 0 0 1-1.5 0v-2.5h-2.5a.75.75 0 0 1 0-1.5h2.5v-2.5a.75.75 0 0 1 1.5 0Z" clipRule="evenodd" />
  </svg>
);
const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
    <path fillRule="evenodd" d="M5 3.25V4H2.75a.75.75 0 0 0 0 1.5h.3l.815 8.15A1.5 1.5 0 0 0 5.357 15h5.285a1.5 1.5 0 0 0 1.493-1.35l.815-8.15h.3a.75.75 0 0 0 0-1.5H11v-.75A2.25 2.25 0 0 0 8.75 1h-1.5A2.25 2.25 0 0 0 5 3.25Zm2.25-.75a.75.75 0 0 0-.75.75V4h3v-.75a.75.75 0 0 0-.75-.75h-1.5ZM6.05 6a.75.75 0 0 1 .787.713l.275 5.5a.75.75 0 0 1-1.498.075l-.275-5.5A.75.75 0 0 1 6.05 6Zm3.9 0a.75.75 0 0 1 .712.787l-.275 5.5a.75.75 0 0 1-1.498-.075l.275-5.5a.75.75 0 0 1 .786-.712Z" clipRule="evenodd" />
  </svg>
);

const formatDate = (str) => {
  if (!str) return '—';
  const [y, m, d] = str.split('-');
  return `${d}/${m}/${y}`;
};
const diasRestantes = (fechaFin) => {
  if (!fechaFin) return null;
  const fin = new Date(fechaFin); const hoy = new Date();
  fin.setHours(0, 0, 0, 0); hoy.setHours(0, 0, 0, 0);
  return Math.ceil((fin - hoy) / (1000 * 60 * 60 * 24));
};

const COLS = ['Usuario', 'Plan', 'Fecha inicio', 'Fecha fin', 'Días restantes', 'Estado', 'Acciones'];

export default function MembresiaView() {
  const [membresias, setMembresias] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [planes, setPlanes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const [confirm, setConfirm] = useState({ open: false });
  const [alert, setAlert] = useState({ open: false, title: '', message: '' });

  const showAlert = (title, message) => setAlert({ open: true, title, message });

  const cargar = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [mems, usrs, pls] = await Promise.all([
        membresiasApi.listar(),
        usuariosApi.listar(),
        planesApi.listarActivos(),
      ]);
      setMembresias(mems.filter((m) => {
        if (m.estado === true) return true;
        const log = getActionForEntity('membresia', m.id);
        return log?.action !== 'eliminado';
      }));
      setUsuarios(usrs);
      setPlanes(pls);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { cargar(); }, [cargar]);

  const handleAsignar = async ({ usuarioId, planId }) => {
    try {
      await membresiasApi.registrar({ usuarioId, planId });
      setModalOpen(false);
      cargar();
    } catch (err) {
      showAlert('Error al asignar', err.message);
    }
  };

  const openConfirm = (m, action) =>
    setConfirm({ open: true, membresiaId: m.id, nombre: `${m.usuarioNombre} — ${m.planNombre}`, action });

  const handleConfirm = async () => {
    const { membresiaId, nombre, action } = confirm;
    setConfirm((s) => ({ ...s, open: false }));
    try {
      if (action === 'activado') {
        await membresiasApi.activar(membresiaId);
      } else {
        await membresiasApi.anular(membresiaId);
      }
      logAction('membresia', membresiaId, nombre, action);
      cargar();
    } catch (err) {
      showAlert('Error', err.message);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Membresías</h1>
          <p className="text-sm text-slate-400 mt-0.5">
            {loading ? 'Cargando…' : `${membresias.length} membresía${membresias.length !== 1 ? 's' : ''} activa${membresias.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button id="btn-refrescar-membresias" onClick={cargar} disabled={loading}
            className="inline-flex items-center px-3 py-2.5 text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-100 transition disabled:opacity-50">
            <RefreshIcon />
          </button>
          <button id="btn-asignar-membresia" onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white text-sm font-semibold
                       rounded-lg shadow-md shadow-indigo-200 hover:bg-indigo-700 active:scale-95 transition-all">
            <PlusIcon /> Asignar membresía
          </button>
        </div>
      </div>

      <div className="mb-5 p-4 rounded-lg bg-indigo-50 border border-indigo-100 flex items-start gap-3">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5">
          <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-7-4a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM9 9a.75.75 0 0 0 0 1.5h.253a.25.25 0 0 1 .244.304l-.459 2.066A1.75 1.75 0 0 0 10.747 15H11a.75.75 0 0 0 0-1.5h-.253a.25.25 0 0 1-.244-.304l.459-2.066A1.75 1.75 0 0 0 9.253 9H9Z" clipRule="evenodd" />
        </svg>
        <p className="text-sm text-indigo-700">
          Aquí asignas un <strong>Plan</strong> a un <strong>Usuario</strong>. El usuario necesita
          una membresía vigente para poder registrar asistencia.
        </p>
      </div>

      {error && (
        <div className="mb-4 p-4 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700 flex justify-between items-center">
          <span><strong>Error:</strong> {error}</span>
          <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600 font-bold ml-4">×</button>
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
                Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i}>{Array.from({ length: 7 }).map((_, j) => (
                    <td key={j} className="px-5 py-4">
                      <div className="h-4 bg-slate-100 rounded animate-pulse" style={{ width: '50%' }} />
                    </td>
                  ))}</tr>
                ))
              ) : membresias.length === 0 ? (
                <tr><td colSpan={7} className="px-5 py-12 text-center text-slate-400 text-sm">
                  No hay membresías activas. Usa <strong className="text-slate-500">Asignar membresía</strong>.
                </td></tr>
              ) : (
                membresias.map((m) => {
                  const dias = diasRestantes(m.fechaFin);
                  return (
                    <tr key={m.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-5 py-4 font-medium text-slate-800">{m.usuarioNombre}</td>
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 text-xs font-semibold ring-1 ring-indigo-100">
                          {m.planNombre}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-slate-500 whitespace-nowrap">{formatDate(m.fechaInicio)}</td>
                      <td className="px-5 py-4 text-slate-500 whitespace-nowrap">{formatDate(m.fechaFin)}</td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        {dias !== null ? (
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${dias <= 0 ? 'bg-red-50 text-red-600 ring-1 ring-red-200' :
                              dias <= 7 ? 'bg-amber-50 text-amber-600 ring-1 ring-amber-200' :
                                'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
                            }`}>
                            {dias <= 0 ? 'Expirada' : `${dias} día${dias !== 1 ? 's' : ''}`}
                          </span>
                        ) : <span className="text-slate-300 text-xs">—</span>}
                      </td>
                      <td className="px-5 py-4"><StatusBadge activo={m.estado} /></td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5">
                          {m.estado === true ? (
                            <button id={`btn-anular-membresia-${m.id}`} onClick={() => openConfirm(m, 'anulado')}
                              className="action-btn text-amber-600 bg-amber-50 hover:bg-amber-100 ring-1 ring-amber-100">
                              <BanIcon /> Anular
                            </button>
                          ) : usuarios.some(u => u.id === m.usuarioId) ? (
                            <button id={`btn-activar-membresia-${m.id}`} onClick={() => openConfirm(m, 'activado')}
                              className="action-btn text-emerald-600 bg-emerald-50 hover:bg-emerald-100 ring-1 ring-emerald-100">
                              <ActivateIcon /> Activar
                            </button>
                          ) : null}
                          <button id={`btn-eliminar-membresia-${m.id}`} onClick={() => openConfirm(m, 'eliminado')}
                            className="action-btn text-slate-500 bg-slate-50 hover:bg-red-50 hover:text-red-600
                                       ring-1 ring-slate-100 hover:ring-red-100">
                            <TrashIcon /> Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AsignarMembresiaModal isOpen={modalOpen} usuarios={usuarios} planes={planes}
        onClose={() => setModalOpen(false)} onSave={handleAsignar} />

      <ConfirmDialog
        isOpen={confirm.open}
        variant={confirm.action === 'eliminado' ? 'danger' : confirm.action === 'activado' ? 'info' : 'warning'}
        title={confirm.action === 'eliminado' ? 'Eliminar membresía' : confirm.action === 'activado' ? 'Activar membresía' : 'Anular membresía'}
        message={
          confirm.action === 'eliminado'
            ? `¿Eliminar la membresía de "${confirm.nombre}"? Desaparecerá de la vista y quedará en el historial como eliminada.`
            : confirm.action === 'activado'
              ? `¿Activar nuevamente la membresía de "${confirm.nombre}"?`
              : `¿Anular la membresía de "${confirm.nombre}"? El usuario no podrá registrar asistencias hasta que se le asigne un nuevo plan.`
        }
        confirmText={confirm.action === 'eliminado' ? 'Sí, eliminar' : confirm.action === 'activado' ? 'Sí, activar' : 'Sí, anular'}
        cancelText="Cancelar"
        onConfirm={handleConfirm}
        onCancel={() => setConfirm((s) => ({ ...s, open: false }))}
      />

      <AlertDialog isOpen={alert.open} title={alert.title} message={alert.message}
        variant="error" onClose={() => setAlert((s) => ({ ...s, open: false }))} />
    </div>
  );
}
