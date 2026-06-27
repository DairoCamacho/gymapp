package co.edu.cun.gymapp.service;

import java.time.LocalDateTime;
import java.util.List;

import co.edu.cun.gymapp.dto.asistencia.AsistenciaRequest;
import co.edu.cun.gymapp.dto.asistencia.AsistenciaResponse;

public interface AsistenciaService {

	List<AsistenciaResponse> listar();

	List<AsistenciaResponse> listarPorUsuario(Long usuarioId);

	List<AsistenciaResponse> listarPorUsuarioYRango(Long usuarioId, LocalDateTime inicio, LocalDateTime fin);

	AsistenciaResponse registrar(AsistenciaRequest request);

	void eliminar(Long id);
}