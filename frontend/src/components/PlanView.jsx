import { useState, useEffect, useCallback } from 'react';
import { planesApi } from '../services/api';
import { logAction, getActionForEntity } from '../utils/actionLog';
import StatusBadge from './StatusBadge';
import PlanModal from './PlanModal';
import { ConfirmDialog, AlertDialog } from './Dialog';

const formatCOP = (v) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(v);

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
const ActivateIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
    <path fillRule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14Zm.75-10.25v2.5h2.5a.75.75 0 0 1 0 1.5h-2.5v2.5a.75.75 0 0 1-1.5 0v-2.5h-2.5a.75.75 0 0 1 0-1.5h2.5v-2.5a.75.75 0 0 1 1.5 0Z" clipRule="evenodd" />
  </svg>
);
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

const COLS = ['Nombre', 'Descripción', 'Precio', 'Duración', 'Estado', 'Acciones'];

export default function PlanView() {
  const [planes, setPlanes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editPlan, setEditPlan] = useState(null);

  // { open, planId, planNombre, action: 'desactivado'|'eliminado' }
  const [confirm, setConfirm] = useState({ open: false });
  const [alert, setAlert] = useState({ open: false, title: '', message: '' });

  const showAlert = (title, message) => setAlert({ open: true, title, message });

  const cargar = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const all = await planesApi.listar();
      setPlanes(all);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { cargar(); }, [cargar]);

  const handleCreate = () => { setEditPlan(null); setModalOpen(true); };
  const handleEdit = (p) => { setEditPlan(p); setModalOpen(true); };

  const handleSave = async (formData) => {
    try {
      if (editPlan) await planesApi.actualizar(editPlan.id, formData);
      else await planesApi.crear(formData);
      setModalOpen(false);
      cargar();
    } catch (err) {
      showAlert('Error al guardar', err.message);
    }
  };

  const openConfirm = (plan, action) =>
    setConfirm({ open: true, planId: plan.id, planNombre: plan.nombre, action });

  const handleConfirm = async () => {
    const { planId, planNombre, action } = confirm;
    setConfirm((s) => ({ ...s, open: false }));
    try {
      if (action === 'activado') {
        await planesApi.activar(planId);
      } else {
        await planesApi.eliminar(planId);
      }
      logAction('plan', planId, planNombre, action);
      cargar();
    } catch (err) {
      showAlert('Error', err.message);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Planes de membresía</h1>
          <p className="text-sm text-slate-400 mt-0.5">
            {loading ? 'Cargando…' : `${planes.length} plan${planes.length !== 1 ? 'es' : ''} activo${planes.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button id="btn-refrescar-planes" onClick={cargar} disabled={loading}
            className="inline-flex items-center px-3 py-2.5 text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-100 transition disabled:opacity-50">
            <RefreshIcon />
          </button>
          <button id="btn-crear-plan" onClick={handleCreate}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white text-sm font-semibold
                       rounded-lg shadow-md shadow-indigo-200 hover:bg-indigo-700 active:scale-95 transition-all">
            <PlusIcon /> Crear plan
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
                Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i}>{Array.from({ length: 6 }).map((_, j) => (
                    <td key={j} className="px-5 py-4">
                      <div className="h-4 bg-slate-100 rounded animate-pulse" style={{ width: j === 1 ? '70%' : '50%' }} />
                    </td>
                  ))}</tr>
                ))
              ) : planes.length === 0 ? (
                <tr><td colSpan={6} className="px-5 py-12 text-center text-slate-400 text-sm">No hay planes activos.</td></tr>
              ) : (
                planes.map((plan) => (
                  <tr key={plan.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-5 py-4 font-medium text-slate-800">{plan.nombre}</td>
                    <td className="px-5 py-4 text-slate-500 max-w-xs truncate">
                      {plan.descripcion || <span className="italic text-slate-300">Sin descripción</span>}
                    </td>
                    <td className="px-5 py-4 font-semibold text-slate-700">{formatCOP(plan.precio)}</td>
                    <td className="px-5 py-4 text-slate-500">{plan.tiempo} día{plan.tiempo !== 1 ? 's' : ''}</td>
                    <td className="px-5 py-4"><StatusBadge activo={plan.estado} /></td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5">
                        <button id={`btn-editar-plan-${plan.id}`} onClick={() => handleEdit(plan)}
                          className="action-btn text-indigo-600 bg-indigo-50 hover:bg-indigo-100 ring-1 ring-indigo-100">
                          <EditIcon /> Editar
                        </button>
                        {plan.estado === true ? (
                          <button id={`btn-desactivar-plan-${plan.id}`} onClick={() => openConfirm(plan, 'desactivado')}
                            className="action-btn text-amber-600 bg-amber-50 hover:bg-amber-100 ring-1 ring-amber-100">
                            <DeactivateIcon /> Desactivar
                          </button>
                        ) : (
                          <button id={`btn-activar-plan-${plan.id}`} onClick={() => openConfirm(plan, 'activado')}
                            className="action-btn text-emerald-600 bg-emerald-50 hover:bg-emerald-100 ring-1 ring-emerald-100">
                            <ActivateIcon /> Activar
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <PlanModal isOpen={modalOpen} plan={editPlan} onClose={() => setModalOpen(false)} onSave={handleSave} />

      <ConfirmDialog
        isOpen={confirm.open}
        variant={confirm.action === 'activado' ? 'info' : 'warning'}
        title={confirm.action === 'activado' ? 'Activar plan' : 'Desactivar plan'}
        message={
          confirm.action === 'activado'
            ? `¿Volver a activar el plan "${confirm.planNombre}"? Podrá volver a asignarse a los usuarios.`
            : `¿Desactivar el plan "${confirm.planNombre}"? No podrá asignarse a nuevos usuarios mientras esté inactivo.`
        }
        confirmText={confirm.action === 'activado' ? 'Sí, activar' : 'Sí, desactivar'}
        cancelText="Cancelar"
        onConfirm={handleConfirm}
        onCancel={() => setConfirm((s) => ({ ...s, open: false }))}
      />

      <AlertDialog isOpen={alert.open} title={alert.title} message={alert.message}
        variant="error" onClose={() => setAlert((s) => ({ ...s, open: false }))} />
    </div>
  );
}
