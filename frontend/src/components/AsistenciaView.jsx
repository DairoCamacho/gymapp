import { useState, useEffect, useCallback } from 'react';
import { asistenciasApi, usuariosApi } from '../services/api';
import { logAction, getActionForEntity } from '../utils/actionLog';
import StatusBadge from './StatusBadge';
import { ConfirmDialog, AlertDialog } from './Dialog';

const RefreshIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
    <path fillRule="evenodd" d="M15.312 11.424a5.5 5.5 0 0 1-9.201 2.466l-.312-.311h2.433a.75.75 0 0 0 0-1.5H3.989a.75.75 0 0 0-.75.75v4.242a.75.75 0 0 0 1.5 0v-2.43l.31.31a7 7 0 0 0 11.712-3.138.75.75 0 0 0-1.449-.39Zm1.23-3.723a.75.75 0 0 0 .219-.53V2.929a.75.75 0 0 0-1.5 0V5.36l-.31-.31A7 7 0 0 0 3.239 8.188a.75.75 0 1 0 1.448.389A5.5 5.5 0 0 1 13.89 6.11l.311.31h-2.432a.75.75 0 0 0 0 1.5h4.243a.75.75 0 0 0 .53-.219Z" clipRule="evenodd" />
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

const formatFecha = (str) => {
  if (!str) return '—';
  return new Date(str).toLocaleString('es-CO', { dateStyle: 'short', timeStyle: 'short' });
};

const COLS = ['ID', 'Usuario', 'Fecha de entrada', 'Estado', 'Acciones'];

export default function AsistenciaView() {
  const [asistencias, setAsistencias] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUsr, setSelectedUsr] = useState('');
  const [registrando, setRegistrando] = useState(false);
  const [registroError, setRegistroError] = useState(null);

  const [confirm, setConfirm] = useState({ open: false });
  const [alert, setAlert] = useState({ open: false, title: '', message: '' });

  const showAlert = (title, message) => setAlert({ open: true, title, message });

  const cargar = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [asist, usrs] = await Promise.all([
        asistenciasApi.listar(),
        usuariosApi.listar(),
      ]);
      setRegistroError(null);
      setAsistencias(asist.filter((a) => {
        if (a.estado === true) return true;
        const log = getActionForEntity('asistencia', a.id);
        return log?.action !== 'eliminado';
      }));
      setUsuarios(usrs);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { cargar(); }, [cargar]);

  const handleRegistrar = async () => {
    if (!selectedUsr) return;
    setRegistrando(true);
    setRegistroError(null);
    try {
      await asistenciasApi.registrar({ usuarioId: Number(selectedUsr) });
      setSelectedUsr('');
      cargar();
    } catch (err) {
      setRegistroError(err.message);
    } finally {
      setRegistrando(false);
    }
  };

  const openConfirm = (a, action) =>
    setConfirm({ open: true, asistenciaId: a.id, nombre: `${a.usuarioNombre} — ${formatFecha(a.fecha)}`, action });

  const handleConfirm = async () => {
    const { asistenciaId, nombre, action } = confirm;
    setConfirm((s) => ({ ...s, open: false }));
    try {
      await asistenciasApi.eliminar(asistenciaId);
      logAction('asistencia', asistenciaId, nombre, action);
      cargar();
    } catch (err) {
      showAlert('Error', err.message);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Asistencias</h1>
          <p className="text-sm text-slate-400 mt-0.5">
            {loading ? 'Cargando…' : `${asistencias.length} registro${asistencias.length !== 1 ? 's' : ''} activo${asistencias.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        <button id="btn-refrescar-asistencias" onClick={cargar} disabled={loading}
          className="inline-flex items-center px-3 py-2.5 text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-100 transition disabled:opacity-50">
          <RefreshIcon />
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 mb-5">
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-semibold text-slate-500 mb-1.5">
              Registrar entrada de usuario
            </label>
            <select
              id="asistencia-usuario-select"
              value={selectedUsr}
              onChange={(e) => setSelectedUsr(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm text-slate-800
                         focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            >
              <option value="">Selecciona un usuario…</option>
              {usuarios.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.nombre} {u.apellido} — {u.email}
                </option>
              ))}
            </select>
          </div>
          <button
            id="btn-registrar-asistencia"
            onClick={handleRegistrar}
            disabled={!selectedUsr || registrando}
            className="px-5 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg
                       shadow-md shadow-indigo-200 hover:bg-indigo-700 active:scale-95 transition
                       disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {registrando ? 'Registrando…' : '✓ Registrar entrada'}
          </button>
        </div>

        {registroError && (
          <div className="mt-3 p-4 rounded-lg bg-amber-50 border border-amber-200 flex items-start gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5">
              <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495ZM10 5a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 10 5Zm0 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="text-sm font-semibold text-amber-800">{registroError}</p>
              <p className="text-xs text-amber-600 mt-1">
                El usuario debe tener una membresía activa y vigente. Ve a{' '}
                <strong>Membresías</strong> y asígnale un plan primero.
              </p>
            </div>
            <button onClick={() => setRegistroError(null)}
              className="ml-auto text-amber-400 hover:text-amber-600 transition text-lg leading-none">
              ×
            </button>
          </div>
        )}
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
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>{Array.from({ length: 5 }).map((_, j) => (
                    <td key={j} className="px-5 py-4">
                      <div className="h-4 bg-slate-100 rounded animate-pulse" style={{ width: j === 2 ? '75%' : '50%' }} />
                    </td>
                  ))}</tr>
                ))
              ) : asistencias.length === 0 ? (
                <tr><td colSpan={5} className="px-5 py-12 text-center text-slate-400 text-sm">No hay asistencias activas.</td></tr>
              ) : (
                asistencias.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-5 py-4 text-slate-400 font-mono text-xs">#{a.id}</td>
                    <td className="px-5 py-4 font-medium text-slate-800">{a.usuarioNombre}</td>
                    <td className="px-5 py-4 text-slate-500">{formatFecha(a.fecha)}</td>
                    <td className="px-5 py-4"><StatusBadge activo={a.estado} /></td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5">
                        {a.estado === true && (
                          <button id={`btn-desactivar-asistencia-${a.id}`} onClick={() => openConfirm(a, 'desactivado')}
                            className="action-btn text-amber-600 bg-amber-50 hover:bg-amber-100 ring-1 ring-amber-100">
                            <DeactivateIcon /> Desactivar
                          </button>
                        )}
                        <button id={`btn-eliminar-asistencia-${a.id}`} onClick={() => openConfirm(a, 'eliminado')}
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

      <ConfirmDialog
        isOpen={confirm.open}
        variant={confirm.action === 'eliminado' ? 'danger' : 'warning'}
        title={confirm.action === 'eliminado' ? 'Eliminar asistencia' : 'Desactivar asistencia'}
        message={
          confirm.action === 'eliminado'
            ? `¿Eliminar el registro de asistencia de "${confirm.nombre}"? Desaparecerá de la vista y quedará en el historial.`
            : `¿Desactivar el registro de asistencia de "${confirm.nombre}"?`
        }
        confirmText={confirm.action === 'eliminado' ? 'Sí, eliminar' : 'Sí, desactivar'}
        cancelText="Cancelar"
        onConfirm={handleConfirm}
        onCancel={() => setConfirm((s) => ({ ...s, open: false }))}
      />

      <AlertDialog isOpen={alert.open} title={alert.title} message={alert.message}
        variant="error" onClose={() => setAlert((s) => ({ ...s, open: false }))} />
    </div>
  );
}
