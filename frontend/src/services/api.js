const API = '/api/v1';

const jsonHeaders = { 'Content-Type': 'application/json' };

async function handleResponse(res) {
  if (!res.ok) {
    let errorMsg = `Error ${res.status}`;
    try {
      const body = await res.json();
      errorMsg = body.message || body.error || JSON.stringify(body);
    } catch {
      errorMsg = (await res.text().catch(() => res.statusText)) || errorMsg;
    }
    throw new Error(errorMsg);
  }
  // 204 No Content → no intentar parsear JSON
  if (res.status === 204) return null;
  return res.json();
}

// ── PLANES (/api/v1/planes) ──────────────────────────────────────────

export const planesApi = {
  listar: () => fetch(`${API}/planes`).then(handleResponse),
  listarActivos: () => fetch(`${API}/planes/activos`).then(handleResponse),
  obtener: (id) => fetch(`${API}/planes/${id}`).then(handleResponse),
  crear: (data) => fetch(`${API}/planes`, { method: 'POST', headers: jsonHeaders, body: JSON.stringify(data) }).then(handleResponse),
  actualizar: (id, data) => fetch(`${API}/planes/${id}`, { method: 'PUT', headers: jsonHeaders, body: JSON.stringify(data) }).then(handleResponse),
  eliminar: (id) => fetch(`${API}/planes/${id}`, { method: 'DELETE' }).then(handleResponse),
  activar: (id) => fetch(`${API}/planes/${id}/activar`, { method: 'PATCH' }).then(handleResponse),
};

// ── USUARIOS (/api/v1/usuarios) ─────────────────────────────────────

export const usuariosApi = {
  listar: () => fetch(`${API}/usuarios`).then(handleResponse),
  obtener: (id) => fetch(`${API}/usuarios/${id}`).then(handleResponse),
  crear: (data) => fetch(`${API}/usuarios`, { method: 'POST', headers: jsonHeaders, body: JSON.stringify(data) }).then(handleResponse),
  actualizar: (id, data) => fetch(`${API}/usuarios/${id}`, { method: 'PUT', headers: jsonHeaders, body: JSON.stringify(data) }).then(handleResponse),
  eliminar: (id) => fetch(`${API}/usuarios/${id}`, { method: 'DELETE' }).then(handleResponse),
};

// ── MEMBRESÍAS (/api/v1/membresias) ─────────────────────────────────

export const membresiasApi = {
  listar: () => fetch(`${API}/membresias`).then(handleResponse),
  obtener: (id) => fetch(`${API}/membresias/${id}`).then(handleResponse),
  listarPorUsuario: (usuarioId) => fetch(`${API}/membresias/usuario/${usuarioId}`).then(handleResponse),
  listarActivas: (usuarioId) => fetch(`${API}/membresias/usuario/${usuarioId}/activas`).then(handleResponse),
  registrar: (data) => fetch(`${API}/membresias`, { method: 'POST', headers: jsonHeaders, body: JSON.stringify(data) }).then(handleResponse),
  anular: (id) => fetch(`${API}/membresias/${id}`, { method: 'DELETE' }).then(handleResponse),
  activar: (id) => fetch(`${API}/membresias/${id}/activar`, { method: 'PATCH' }).then(handleResponse),
};

// ── ASISTENCIAS (/api/v1/asistencias) ───────────────────────────────

export const asistenciasApi = {
  listar: () => fetch(`${API}/asistencias`).then(handleResponse),
  listarPorUsuario: (usuarioId) => fetch(`${API}/asistencias/usuario/${usuarioId}`).then(handleResponse),
  registrar: (data) => fetch(`${API}/asistencias`, { method: 'POST', headers: jsonHeaders, body: JSON.stringify(data) }).then(handleResponse),
  eliminar: (id) => fetch(`${API}/asistencias/${id}`, { method: 'DELETE' }).then(handleResponse),
};
