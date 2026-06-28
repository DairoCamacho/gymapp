import { useState, useEffect, useCallback } from 'react';
import { planesApi, membresiasApi, asistenciasApi } from '../services/api';
import { getLogs, getActionForEntity, clearLogs } from '../utils/actionLog';
import StatusBadge from './StatusBadge';

const formatFecha = (str) => {
  if (!str) return '—';
  return new Date(str).toLocaleString('es-CO', { dateStyle: 'short', timeStyle: 'short' });
};
const formatCOP = (v) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(v);

// Badge de acción
const ACTION_STYLES = {
  eliminado: 'bg-red-50   text-red-600   ring-1 ring-red-200',
  desactivado: 'bg-slate-100 text-slate-500 ring-1 ring-slate-200',
  anulado: 'bg-amber-50 text-amber-600 ring-1 ring-amber-200',
};
const ActionBadge = ({ action }) => (
  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${ACTION_STYLES[action] ?? ACTION_STYLES.desactivado}`}>
    {action ?? 'desactivado'}
  </span>
);

// ── Sub-secciones ─────────────────────────────────────────────────────

function Section({ title, children, count }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border-b border-slate-100 last:border-0">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-5 py-3 text-sm font-semibold
                   text-slate-600 hover:bg-slate-50 transition"
      >
        <span className="flex items-center gap-2">
          {title}
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
            {count}
          </span>
        </span>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor"
          className={`w-4 h-4 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`}>
          <path fillRule="evenodd" d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
        </svg>
      </button>
      {open && <div className="pb-2">{children}</div>}
    </div>
  );
}

function EmptyRow() {
  return (
    <p className="px-5 py-3 text-xs text-slate-400 italic">Sin registros inactivos.</p>
  );
}

// ── Panel principal ───────────────────────────────────────────────────

export default function HistoryPanel({ isOpen, onClose }) {
  const [planes, setPlanes] = useState([]);
  const [membresias, setMembresias] = useState([]);
  const [asistencias, setAsistencias] = useState([]);
  const [userLogs, setUserLogs] = useState([]);  // usuarios: solo desde log
  const [loading, setLoading] = useState(false);

  const cargar = useCallback(async () => {
    if (!isOpen) return;
    setLoading(true);
    try {
      const [pls, mems, asist] = await Promise.all([
        planesApi.listar(),
        membresiasApi.listar(),
        asistenciasApi.listar(),
      ]);
      setPlanes(pls.filter((p) => p.estado === false));
      setMembresias(mems.filter((m) => m.estado === false));
      setAsistencias(asist.filter((a) => a.estado === false));
      // Usuarios: el API solo retorna activos, usamos el log local
      setUserLogs(getLogs().filter((l) => l.entityType === 'usuario'));
    } catch (err) {
      console.error('Error cargando historial:', err);
    } finally {
      setLoading(false);
    }
  }, [isOpen]);

  useEffect(() => { cargar(); }, [cargar]);

  const total = planes.length + membresias.length + asistencias.length + userLogs.length;

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-[2px]"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed right-0 top-0 h-full z-50 w-full max-w-md bg-white shadow-2xl flex flex-col
                      animate-[slideInRight_0.25s_ease]"
        style={{ animation: 'slideInRight 0.25s ease' }}
      >
        {/* Cabecera del panel */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
                className="w-4 h-4 text-indigo-600">
                <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm.75-13a.75.75 0 0 0-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 0 0 0-1.5h-3.25V5Z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-800">Historial de registros</h2>
              <p className="text-xs text-slate-400">{total} registro{total !== 1 ? 's' : ''} inactivo{total !== 1 ? 's' : ''}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => { cargar(); }}
              title="Actualizar"
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
                <path fillRule="evenodd" d="M13.836 2.477a.75.75 0 0 1 .75.75v3.182a.75.75 0 0 1-.75.75h-3.182a.75.75 0 0 1 0-1.5h1.37l-.84-.841a4.5 4.5 0 0 0-7.08 1.01.75.75 0 0 1-1.3-.75 6 6 0 0 1 9.44-1.346l.842.841V3.227a.75.75 0 0 1 .75-.75Zm-.911 7.5A.75.75 0 0 1 13.199 11a6 6 0 0 1-9.44 1.346l-.842-.841v1.371a.75.75 0 0 1-1.5 0V9.694a.75.75 0 0 1 .75-.75h3.182a.75.75 0 0 1 0 1.5H4.013l.841.841a4.5 4.5 0 0 0 7.08-1.011.75.75 0 0 1 1.39.703Z" clipRule="evenodd" />
              </svg>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
                <path d="M5.28 4.22a.75.75 0 0 0-1.06 1.06L6.94 8l-2.72 2.72a.75.75 0 1 0 1.06 1.06L8 9.06l2.72 2.72a.75.75 0 1 0 1.06-1.06L9.06 8l2.72-2.72a.75.75 0 0 0-1.06-1.06L8 6.94 5.28 4.22Z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Contenido scrollable */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-32 text-slate-400 text-sm">
              Cargando historial…
            </div>
          ) : total === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-slate-400 gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 text-slate-200">
                <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm.75-13a.75.75 0 0 0-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 0 0 0-1.5h-3.25V5Z" clipRule="evenodd" />
              </svg>
              <p className="text-sm">No hay registros inactivos aún.</p>
            </div>
          ) : (
            <>
              {/* ── Planes ── */}
              <Section title="Planes" count={planes.length}>
                {planes.length === 0 ? <EmptyRow /> : planes.map((p) => {
                  const log = getActionForEntity('plan', p.id);
                  return (
                    <div key={p.id} className="mx-3 mb-2 p-3 rounded-lg bg-slate-50 border border-slate-200">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-sm font-semibold text-slate-700">{p.nombre}</p>
                          <p className="text-xs text-slate-400 mt-0.5">
                            {formatCOP(p.precio)} · {p.tiempo} días
                          </p>
                          {log && (
                            <p className="text-xs text-slate-400 mt-1">
                              {formatFecha(log.timestamp)}
                            </p>
                          )}
                        </div>
                        <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                          <StatusBadge activo={false} />
                          <ActionBadge action={log?.action} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </Section>

              {/* ── Usuarios ── */}
              <Section title="Usuarios" count={userLogs.length}>
                {userLogs.length === 0 ? <EmptyRow /> : userLogs.map((log) => (
                  <div key={log.id} className="mx-3 mb-2 p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold text-slate-700">{log.nombre}</p>
                        <p className="text-xs text-slate-400 mt-1">{formatFecha(log.timestamp)}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                        <StatusBadge activo={false} />
                        <ActionBadge action={log.action} />
                      </div>
                    </div>
                  </div>
                ))}
              </Section>

              {/* ── Membresías ── */}
              <Section title="Membresías" count={membresias.length}>
                {membresias.length === 0 ? <EmptyRow /> : membresias.map((m) => {
                  const log = getActionForEntity('membresia', m.id);
                  return (
                    <div key={m.id} className="mx-3 mb-2 p-3 rounded-lg bg-slate-50 border border-slate-200">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-sm font-semibold text-slate-700">{m.usuarioNombre}</p>
                          <p className="text-xs text-slate-400 mt-0.5">Plan: {m.planNombre}</p>
                          {log && (
                            <p className="text-xs text-slate-400 mt-1">{formatFecha(log.timestamp)}</p>
                          )}
                        </div>
                        <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                          <StatusBadge activo={false} />
                          <ActionBadge action={log?.action ?? 'anulado'} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </Section>

              {/* ── Asistencias ── */}
              <Section title="Asistencias" count={asistencias.length}>
                {asistencias.length === 0 ? <EmptyRow /> : asistencias.map((a) => {
                  const log = getActionForEntity('asistencia', a.id);
                  return (
                    <div key={a.id} className="mx-3 mb-2 p-3 rounded-lg bg-slate-50 border border-slate-200">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-sm font-semibold text-slate-700">{a.usuarioNombre}</p>
                          <p className="text-xs text-slate-400 mt-0.5">{formatFecha(a.fecha)}</p>
                          {log && (
                            <p className="text-xs text-slate-400 mt-1">{formatFecha(log.timestamp)}</p>
                          )}
                        </div>
                        <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                          <StatusBadge activo={false} />
                          <ActionBadge action={log?.action} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </Section>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <p className="text-xs text-slate-400">Los registros inactivos siguen en la base de datos.</p>
          <button
            onClick={() => { clearLogs(); cargar(); }}
            className="text-xs text-slate-400 hover:text-red-500 transition underline"
          >
            Limpiar log
          </button>
        </div>
      </div>

      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to   { transform: translateX(0); }
        }
      `}</style>
    </>
  );
}
