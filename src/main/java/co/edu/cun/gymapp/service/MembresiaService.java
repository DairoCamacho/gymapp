package co.edu.cun.gymapp.service;

import java.util.List;

import co.edu.cun.gymapp.dto.membresia.MembresiaRequest;
import co.edu.cun.gymapp.dto.membresia.MembresiaResponse;

public interface MembresiaService {

	List<MembresiaResponse> listar();

	List<MembresiaResponse> listarPorUsuario(Long usuarioId);

	List<MembresiaResponse> listarActivasPorUsuario(Long usuarioId);

	MembresiaResponse obtenerPorId(Long id);

	MembresiaResponse registrar(MembresiaRequest request);

	void anular(Long id);
}