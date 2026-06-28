package co.edu.cun.gymapp.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import co.edu.cun.gymapp.dto.plan.PlanRequest;
import co.edu.cun.gymapp.dto.plan.PlanResponse;
import co.edu.cun.gymapp.service.PlanService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/planes")
@Validated
public class PlanController {

	private final PlanService planService;

	public PlanController(PlanService planService) {
		this.planService = planService;
	}

	@GetMapping
	public ResponseEntity<List<PlanResponse>> listar() {
		return ResponseEntity.ok(planService.listar());
	}

	@GetMapping("/activos")
	public ResponseEntity<List<PlanResponse>> listarActivos() {
		return ResponseEntity.ok(planService.listarActivos());
	}

	@GetMapping("/{id}")
	public ResponseEntity<PlanResponse> obtenerPorId(@PathVariable Long id) {
		return ResponseEntity.ok(planService.obtenerPorId(id));
	}

	@PostMapping
	public ResponseEntity<PlanResponse> crear(@Valid @RequestBody PlanRequest request) {
		return ResponseEntity.status(HttpStatus.CREATED).body(planService.crear(request));
	}

	@PutMapping("/{id}")
	public ResponseEntity<PlanResponse> actualizar(@PathVariable Long id, @Valid @RequestBody PlanRequest request) {
		return ResponseEntity.ok(planService.actualizar(id, request));
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> eliminar(@PathVariable Long id) {
		planService.eliminar(id);
		return ResponseEntity.noContent().build();
	}
}