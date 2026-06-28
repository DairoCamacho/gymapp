package co.edu.cun.gymapp.service;

import java.util.List;

import co.edu.cun.gymapp.dto.plan.PlanRequest;
import co.edu.cun.gymapp.dto.plan.PlanResponse;

public interface PlanService {

	List<PlanResponse> listar();

	List<PlanResponse> listarActivos();

	PlanResponse obtenerPorId(Long id);

	PlanResponse crear(PlanRequest request);

	PlanResponse actualizar(Long id, PlanRequest request);

	void eliminar(Long id);

	void activar(Long id);
}