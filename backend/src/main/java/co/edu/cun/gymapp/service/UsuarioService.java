package co.edu.cun.gymapp.service;

import java.util.List;

import co.edu.cun.gymapp.dto.usuario.UsuarioRequest;
import co.edu.cun.gymapp.dto.usuario.UsuarioResponse;

public interface UsuarioService {

	List<UsuarioResponse> listar();

	UsuarioResponse obtenerPorId(Long id);

	UsuarioResponse obtenerPorEmail(String email);

	UsuarioResponse crear(UsuarioRequest request);

	UsuarioResponse actualizar(Long id, UsuarioRequest request);

	void eliminar(Long id);
}