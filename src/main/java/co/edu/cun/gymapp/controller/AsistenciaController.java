package co.edu.cun.gymapp.controller;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import co.edu.cun.gymapp.dto.asistencia.AsistenciaRequest;
import co.edu.cun.gymapp.dto.asistencia.AsistenciaResponse;
import co.edu.cun.gymapp.service.AsistenciaService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/asistencias")
@Validated
public class AsistenciaController {

	private final AsistenciaService asistenciaService;

	public AsistenciaController(AsistenciaService asistenciaService) {
		this.asistenciaService = asistenciaService;
	}

	@GetMapping
	public ResponseEntity<List<AsistenciaResponse>> listar() {
		return ResponseEntity.ok(asistenciaService.listar());
	}

	@GetMapping("/usuario/{usuarioId}")
	public ResponseEntity<List<AsistenciaResponse>> listarPorUsuario(@PathVariable Long usuarioId) {
		return ResponseEntity.ok(asistenciaService.listarPorUsuario(usuarioId));
	}

	@GetMapping("/usuario/{usuarioId}/rango")
	public ResponseEntity<List<AsistenciaResponse>> listarPorUsuarioYRango(@PathVariable Long usuarioId,
			@RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime inicio,
			@RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fin) {
		return ResponseEntity.ok(asistenciaService.listarPorUsuarioYRango(usuarioId, inicio, fin));
	}

	@PostMapping
	public ResponseEntity<AsistenciaResponse> registrar(@Valid @RequestBody AsistenciaRequest request) {
		return ResponseEntity.status(HttpStatus.CREATED).body(asistenciaService.registrar(request));
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> eliminar(@PathVariable Long id) {
		asistenciaService.eliminar(id);
		return ResponseEntity.noContent().build();
	}
}