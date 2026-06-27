package co.edu.cun.gymapp.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import co.edu.cun.gymapp.domain.Plan;
import co.edu.cun.gymapp.dto.plan.PlanRequest;
import co.edu.cun.gymapp.dto.plan.PlanResponse;
import co.edu.cun.gymapp.persistence.PlanRepository;
import co.edu.cun.gymapp.service.PlanService;
import jakarta.persistence.EntityNotFoundException;

@Service
public class PlanServiceImpl implements PlanService {

	private final PlanRepository planRepository;

	public PlanServiceImpl(PlanRepository planRepository) {
		this.planRepository = planRepository;
	}

	@Override
	@Transactional(readOnly = true)
	public List<PlanResponse> listar() {
		return planRepository.findAll().stream().map(this::toResponse).toList();
	}

	@Override
	@Transactional(readOnly = true)
	public List<PlanResponse> listarActivos() {
		return planRepository.findByEstadoTrue().stream().map(this::toResponse).toList();
	}

	@Override
	@Transactional(readOnly = true)
	public PlanResponse obtenerPorId(Long id) {
		return planRepository.findById(id).map(this::toResponse)
				.orElseThrow(() -> new EntityNotFoundException("Plan no encontrado con id: " + id));
	}

	@Override
	@Transactional
	public PlanResponse crear(PlanRequest request) {
		Plan plan = new Plan();
		plan.setNombre(request.getNombre());
		plan.setDescripcion(request.getDescripcion());
		plan.setPrecio(request.getPrecio());
		plan.setTiempo(request.getTiempo());
		plan.setEstado(true);
		return toResponse(planRepository.save(plan));
	}

	@Override
	@Transactional
	public PlanResponse actualizar(Long id, PlanRequest request) {
		Plan plan = planRepository.findById(id)
				.orElseThrow(() -> new EntityNotFoundException("Plan no encontrado con id: " + id));
		plan.setNombre(request.getNombre());
		plan.setDescripcion(request.getDescripcion());
		plan.setPrecio(request.getPrecio());
		plan.setTiempo(request.getTiempo());
		return toResponse(planRepository.save(plan));
	}

	@Override
	@Transactional
	public void eliminar(Long id) {
		Plan plan = planRepository.findById(id)
				.orElseThrow(() -> new EntityNotFoundException("Plan no encontrado con id: " + id));
		plan.setEstado(false);
		planRepository.save(plan);
	}

	private PlanResponse toResponse(Plan plan) {
		return new PlanResponse(plan.getId(), plan.getNombre(), plan.getDescripcion(), plan.getPrecio(),
				plan.getTiempo(), plan.getEstado());
	}
}