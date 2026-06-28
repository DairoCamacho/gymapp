package co.edu.cun.gymapp.dto.membresia;

import jakarta.validation.constraints.NotNull;

public class MembresiaRequest {

	@NotNull(message = "El usuario es obligatorio")
	private Long usuarioId;

	@NotNull(message = "El plan es obligatorio")
	private Long planId;

	public Long getUsuarioId() { return usuarioId; }
	public void setUsuarioId(Long usuarioId) { this.usuarioId = usuarioId; }
	public Long getPlanId() { return planId; }
	public void setPlanId(Long planId) { this.planId = planId; }
}