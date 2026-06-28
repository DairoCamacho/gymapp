package co.edu.cun.gymapp.service.impl;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import co.edu.cun.gymapp.domain.Membresia;
import co.edu.cun.gymapp.domain.Plan;
import co.edu.cun.gymapp.domain.Usuario;
import co.edu.cun.gymapp.dto.membresia.MembresiaRequest;
import co.edu.cun.gymapp.dto.membresia.MembresiaResponse;
import co.edu.cun.gymapp.persistence.MembresiaRepository;
import co.edu.cun.gymapp.persistence.PlanRepository;
import co.edu.cun.gymapp.persistence.UsuarioRepository;
import co.edu.cun.gymapp.service.MembresiaService;
import jakarta.persistence.EntityNotFoundException;

@Service
public class MembresiaServiceImpl implements MembresiaService {

	private final MembresiaRepository membresiaRepository;
	private final UsuarioRepository usuarioRepository;
	private final PlanRepository planRepository;

	public MembresiaServiceImpl(MembresiaRepository membresiaRepository, UsuarioRepository usuarioRepository,
			PlanRepository planRepository) {
		this.membresiaRepository = membresiaRepository;
		this.usuarioRepository = usuarioRepository;
		this.planRepository = planRepository;
	}

	@Override
	@Transactional(readOnly = true)
	public List<MembresiaResponse> listar() {
		return membresiaRepository.findAll().stream().map(this::toResponse).toList();
	}

	@Override
	@Transactional(readOnly = true)
	public List<MembresiaResponse> listarPorUsuario(Long usuarioId) {
		return membresiaRepository.findByUsuarioIdAndEstadoTrue(usuarioId).stream().map(this::toResponse).toList();
	}

	@Override
	@Transactional(readOnly = true)
	public List<MembresiaResponse> listarActivasPorUsuario(Long usuarioId) {
		LocalDate hoy = LocalDate.now();
		return membresiaRepository.findByUsuarioIdAndEstadoTrue(usuarioId).stream()
				.filter(m -> m.getFechaFin() != null && !m.getFechaFin().isBefore(hoy))
				.map(this::toResponse).toList();
	}

	@Override
	@Transactional(readOnly = true)
	public MembresiaResponse obtenerPorId(Long id) {
		return membresiaRepository.findById(id).map(this::toResponse)
				.orElseThrow(() -> new EntityNotFoundException("Membresía no encontrada con id: " + id));
	}

	@Override
	@Transactional
	public MembresiaResponse registrar(MembresiaRequest request) {
		Usuario usuario = usuarioRepository.findByIdAndEstadoTrue(request.getUsuarioId())
				.orElseThrow(() -> new EntityNotFoundException(
						"Usuario no encontrado con id: " + request.getUsuarioId()));
		Plan plan = planRepository.findByIdAndEstadoTrue(request.getPlanId())
				.orElseThrow(() -> new EntityNotFoundException("Plan no encontrado con id: " + request.getPlanId()));

		LocalDate hoy = LocalDate.now();
		LocalDate fechaInicio = calcularFechaInicio(usuario.getId(), hoy);
		LocalDate fechaFin = fechaInicio.plusDays(plan.getTiempo());

		Membresia membresia = new Membresia();
		membresia.setUsuario(usuario);
		membresia.setPlan(plan);
		membresia.setFechaInicio(fechaInicio);
		membresia.setFechaFin(fechaFin);
		membresia.setEstado(true);
		return toResponse(membresiaRepository.save(membresia));
	}

	@Override
	@Transactional
	public void anular(Long id) {
		Membresia membresia = membresiaRepository.findById(id)
				.orElseThrow(() -> new EntityNotFoundException("Membresía no encontrada con id: " + id));
		membresia.setEstado(false);
		membresiaRepository.save(membresia);
	}

	@Override
	@Transactional
	public void activar(Long id) {
		Membresia membresia = membresiaRepository.findById(id)
				.orElseThrow(() -> new EntityNotFoundException("Membresía no encontrada con id: " + id));
		membresia.setEstado(true);
		membresiaRepository.save(membresia);
	}

	private LocalDate calcularFechaInicio(Long usuarioId, LocalDate hoy) {
		Optional<Membresia> vigente = membresiaRepository
				.findTopByUsuarioIdAndEstadoTrueAndFechaFinAfterOrderByFechaFinDesc(usuarioId, hoy);
		return vigente.map(m -> m.getFechaFin().plusDays(1)).orElse(hoy);
	}

	private MembresiaResponse toResponse(Membresia membresia) {
		return new MembresiaResponse(membresia.getId(), membresia.getUsuario().getId(),
				membresia.getUsuario().getNombre() + " " + membresia.getUsuario().getApellido(),
				membresia.getPlan().getId(), membresia.getPlan().getNombre(), membresia.getFechaInicio(),
				membresia.getFechaFin(), membresia.getEstado());
	}
}