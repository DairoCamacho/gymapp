// =====================================================================
// actionLog.js — Registro de acciones en localStorage
// Guarda cuándo se eliminó o desactivó un registro, y con qué intención.
// Esto es necesario porque el backend usa soft-delete para ambas acciones.
// =====================================================================

const STORAGE_KEY = 'gymapp_action_log';

/**
 * @typedef {Object} LogEntry
 * @property {string} entityType  - 'plan' | 'usuario' | 'membresia' | 'asistencia'
 * @property {number} id          - ID del registro
 * @property {string} nombre      - Nombre legible del registro en el momento de la acción
 * @property {'eliminado'|'desactivado'|'anulado'} action
 * @property {string} timestamp   - ISO 8601
 */

/** Obtiene todos los logs guardados */
export function getLogs() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

/**
 * Registra una acción en el log.
 * @param {'plan'|'usuario'|'membresia'|'asistencia'} entityType
 * @param {number} id
 * @param {string} nombre
 * @param {'eliminado'|'desactivado'|'anulado'} action
 */
export function logAction(entityType, id, nombre, action) {
  const logs = getLogs();
  // Si ya existe una entrada para este registro, la actualizamos
  const existing = logs.findIndex((l) => l.entityType === entityType && l.id === id);
  const entry = { entityType, id, nombre, action, timestamp: new Date().toISOString() };
  if (existing !== -1) {
    logs[existing] = entry;
  } else {
    logs.push(entry);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
}

/**
 * Obtiene la acción más reciente de un registro específico.
 * @returns {LogEntry|undefined}
 */
export function getActionForEntity(entityType, id) {
  return getLogs()
    .filter((l) => l.entityType === entityType && Number(l.id) === Number(id))
    .at(-1); // más reciente
}

/**
 * Obtiene todos los logs de un tipo de entidad.
 * @param {'plan'|'usuario'|'membresia'|'asistencia'} entityType
 * @returns {LogEntry[]}
 */
export function getLogsByType(entityType) {
  return getLogs().filter((l) => l.entityType === entityType);
}

/** Limpia TODO el log (para testing) */
export function clearLogs() {
  localStorage.removeItem(STORAGE_KEY);
}
