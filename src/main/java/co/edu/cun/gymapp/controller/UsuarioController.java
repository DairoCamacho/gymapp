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

import co.edu.cun.gymapp.dto.usuario.UsuarioRequest;
import co.edu.cun.gymapp.dto.usuario.UsuarioResponse;
import co.edu.cun.gymapp.service.UsuarioService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/usuarios")
@Validated
public class UsuarioController {

	private final UsuarioService usuarioService;

	public UsuarioController(UsuarioService usuarioService) {
		this.usuarioService = usuarioService;
	}

	@GetMapping
	public ResponseEntity<List<UsuarioResponse>> listar() {
		return ResponseEntity.ok(usuarioService.listar());
	}

	@GetMapping("/{id}")
	public ResponseEntity<UsuarioResponse> obtenerPorId(@PathVariable Long id) {
		return ResponseEntity.ok(usuarioService.obtenerPorId(id));
	}

	@GetMapping("/email/{email}")
	public ResponseEntity<UsuarioResponse> obtenerPorEmail(@PathVariable String email) {
		return ResponseEntity.ok(usuarioService.obtenerPorEmail(email));
	}

	@PostMapping
	public ResponseEntity<UsuarioResponse> crear(@Valid @RequestBody UsuarioRequest request) {
		return ResponseEntity.status(HttpStatus.CREATED).body(usuarioService.crear(request));
	}

	@PutMapping("/{id}")
	public ResponseEntity<UsuarioResponse> actualizar(@PathVariable Long id,
			@Valid @RequestBody UsuarioRequest request) {
		return ResponseEntity.ok(usuarioService.actualizar(id, request));
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> eliminar(@PathVariable Long id) {
		usuarioService.eliminar(id);
		return ResponseEntity.noContent().build();
	}
}