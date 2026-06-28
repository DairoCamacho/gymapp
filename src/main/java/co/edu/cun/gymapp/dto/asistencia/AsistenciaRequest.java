package co.edu.cun.gymapp.dto.asistencia;

import jakarta.validation.constraints.NotNull;

public class AsistenciaRequest {

	@NotNull(message = "El usuario es obligatorio")
	private Long usuarioId;

	public Long getUsuarioId() { return usuarioId; }
	public void setUsuarioId(Long usuarioId) { this.usuarioId = usuarioId; }
}