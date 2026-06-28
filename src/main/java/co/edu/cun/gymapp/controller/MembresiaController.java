package co.edu.cun.gymapp.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import co.edu.cun.gymapp.dto.membresia.MembresiaRequest;
import co.edu.cun.gymapp.dto.membresia.MembresiaResponse;
import co.edu.cun.gymapp.service.MembresiaService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/membresias")
@Validated
public class MembresiaController {

	private final MembresiaService membresiaService;

	public MembresiaController(MembresiaService membresiaService) {
		this.membresiaService = membresiaService;
	}

	@GetMapping
	public ResponseEntity<List<MembresiaResponse>> listar() {
		return ResponseEntity.ok(membresiaService.listar());
	}

	@GetMapping("/{id}")
	public ResponseEntity<MembresiaResponse> obtenerPorId(@PathVariable Long id) {
		return ResponseEntity.ok(membresiaService.obtenerPorId(id));
	}

	@GetMapping("/usuario/{usuarioId}")
	public ResponseEntity<List<MembresiaResponse>> listarPorUsuario(@PathVariable Long usuarioId) {
		return ResponseEntity.ok(membresiaService.listarPorUsuario(usuarioId));
	}

	@GetMapping("/usuario/{usuarioId}/activas")
	public ResponseEntity<List<MembresiaResponse>> listarActivasPorUsuario(@PathVariable Long usuarioId) {
		return ResponseEntity.ok(membresiaService.listarActivasPorUsuario(usuarioId));
	}

	@PostMapping
	public ResponseEntity<MembresiaResponse> registrar(@Valid @RequestBody MembresiaRequest request) {
		return ResponseEntity.status(HttpStatus.CREATED).body(membresiaService.registrar(request));
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> anular(@PathVariable Long id) {
		membresiaService.anular(id);
		return ResponseEntity.noContent().build();
	}
}