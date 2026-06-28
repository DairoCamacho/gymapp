package co.edu.cun.gymapp.service.impl;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import co.edu.cun.gymapp.domain.Asistencia;
import co.edu.cun.gymapp.domain.Membresia;
import co.edu.cun.gymapp.domain.Usuario;
import co.edu.cun.gymapp.dto.asistencia.AsistenciaRequest;
import co.edu.cun.gymapp.dto.asistencia.AsistenciaResponse;
import co.edu.cun.gymapp.persistence.AsistenciaRepository;
import co.edu.cun.gymapp.persistence.MembresiaRepository;
import co.edu.cun.gymapp.persistence.UsuarioRepository;
import co.edu.cun.gymapp.service.AsistenciaService;
import jakarta.persistence.EntityNotFoundException;

@Service
public class AsistenciaServiceImpl implements AsistenciaService {

	private final AsistenciaRepository asistenciaRepository;
	private final UsuarioRepository usuarioRepository;
	private final MembresiaRepository membresiaRepository;

	public AsistenciaServiceImpl(AsistenciaRepository asistenciaRepository, UsuarioRepository usuarioRepository,
			MembresiaRepository membresiaRepository) {
		this.asistenciaRepository = asistenciaRepository;
		this.usuarioRepository = usuarioRepository;
		this.membresiaRepository = membresiaRepository;
	}

	@Override
	@Transactional(readOnly = true)
	public List<AsistenciaResponse> listar() {
		return asistenciaRepository.findAll().stream().map(this::toResponse).toList();
	}

	@Override
	@Transactional(readOnly = true)
	public List<AsistenciaResponse> listarPorUsuario(Long usuarioId) {
		return asistenciaRepository.findByUsuarioIdAndEstadoTrue(usuarioId).stream().map(this::toResponse).toList();
	}

	@Override
	@Transactional(readOnly = true)
	public List<AsistenciaResponse> listarPorUsuarioYRango(Long usuarioId, LocalDateTime inicio, LocalDateTime fin) {
		return asistenciaRepository
				.findByUsuarioIdAndEstadoTrueAndFechaBetween(usuarioId, inicio, fin).stream()
				.map(this::toResponse).toList();
	}

	@Override
	@Transactional
	public AsistenciaResponse registrar(AsistenciaRequest request) {
		Usuario usuario = usuarioRepository.findByIdAndEstadoTrue(request.getUsuarioId())
				.orElseThrow(() -> new EntityNotFoundException(
						"Usuario no encontrado con id: " + request.getUsuarioId()));

		validarMembresiaVigente(usuario.getId());

		Asistencia asistencia = new Asistencia();
		asistencia.setUsuario(usuario);
		asistencia.setFecha(LocalDateTime.now());
		asistencia.setEstado(true);
		return toResponse(asistenciaRepository.save(asistencia));
	}

	@Override
	@Transactional
	public void eliminar(Long id) {
		Asistencia asistencia = asistenciaRepository.findById(id)
				.orElseThrow(() -> new EntityNotFoundException("Asistencia no encontrada con id: " + id));
		asistencia.setEstado(false);
		asistenciaRepository.save(asistencia);
	}

	private void validarMembresiaVigente(Long usuarioId) {
		Membresia membresia = membresiaRepository
				.findTopByUsuarioIdAndEstadoTrueOrderByFechaFinDesc(usuarioId)
				.orElseThrow(() -> new IllegalStateException(
						"El usuario no tiene una membresía vigente para registrar la asistencia"));
		if (membresia.getFechaFin().isBefore(java.time.LocalDate.now())) {
			throw new IllegalStateException("La membresía del usuario ha expirado");
		}
	}

	private AsistenciaResponse toResponse(Asistencia asistencia) {
		return new AsistenciaResponse(asistencia.getId(), asistencia.getUsuario().getId(),
				asistencia.getUsuario().getNombre() + " " + asistencia.getUsuario().getApellido(),
				asistencia.getFecha(), asistencia.getEstado());
	}
}