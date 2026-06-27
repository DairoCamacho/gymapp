package co.edu.cun.gymapp.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import co.edu.cun.gymapp.domain.Usuario;
import co.edu.cun.gymapp.dto.usuario.UsuarioRequest;
import co.edu.cun.gymapp.dto.usuario.UsuarioResponse;
import co.edu.cun.gymapp.persistence.UsuarioRepository;
import co.edu.cun.gymapp.service.UsuarioService;
import jakarta.persistence.EntityNotFoundException;

@Service
public class UsuarioServiceImpl implements UsuarioService {

	private final UsuarioRepository usuarioRepository;

	public UsuarioServiceImpl(UsuarioRepository usuarioRepository) {
		this.usuarioRepository = usuarioRepository;
	}

	@Override
	@Transactional(readOnly = true)
	public List<UsuarioResponse> listar() {
		return usuarioRepository.findByEstadoTrue().stream().map(this::toResponse).toList();
	}

	@Override
	@Transactional(readOnly = true)
	public UsuarioResponse obtenerPorId(Long id) {
		return usuarioRepository.findByIdAndEstadoTrue(id).map(this::toResponse)
				.orElseThrow(() -> new EntityNotFoundException("Usuario no encontrado con id: " + id));
	}

	@Override
	@Transactional(readOnly = true)
	public UsuarioResponse obtenerPorEmail(String email) {
		return usuarioRepository.findByEmailAndEstadoTrue(email).map(this::toResponse)
				.orElseThrow(() -> new EntityNotFoundException("Usuario no encontrado con email: " + email));
	}

	@Override
	@Transactional
	public UsuarioResponse crear(UsuarioRequest request) {
		if (usuarioRepository.existsByEmailAndEstadoTrue(request.getEmail())) {
			throw new IllegalArgumentException("Ya existe un usuario activo con el email: " + request.getEmail());
		}
		Usuario usuario = new Usuario();
		usuario.setNombre(request.getNombre());
		usuario.setApellido(request.getApellido());
		usuario.setTelefono(request.getTelefono());
		usuario.setEmail(request.getEmail());
		usuario.setEstado(true);
		return toResponse(usuarioRepository.save(usuario));
	}

	@Override
	@Transactional
	public UsuarioResponse actualizar(Long id, UsuarioRequest request) {
		Usuario usuario = usuarioRepository.findByIdAndEstadoTrue(id)
				.orElseThrow(() -> new EntityNotFoundException("Usuario no encontrado con id: " + id));
		usuario.setNombre(request.getNombre());
		usuario.setApellido(request.getApellido());
		usuario.setTelefono(request.getTelefono());
		usuario.setEmail(request.getEmail());
		return toResponse(usuarioRepository.save(usuario));
	}

	@Override
	@Transactional
	public void eliminar(Long id) {
		Usuario usuario = usuarioRepository.findByIdAndEstadoTrue(id)
				.orElseThrow(() -> new EntityNotFoundException("Usuario no encontrado con id: " + id));
		usuario.setEstado(false);
		usuarioRepository.save(usuario);
	}

	private UsuarioResponse toResponse(Usuario usuario) {
		return new UsuarioResponse(usuario.getId(), usuario.getNombre(), usuario.getApellido(), usuario.getTelefono(),
				usuario.getEmail(), usuario.getEstado());
	}
}