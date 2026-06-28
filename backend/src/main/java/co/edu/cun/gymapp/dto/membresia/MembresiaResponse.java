package co.edu.cun.gymapp.dto.membresia;

import java.time.LocalDate;

public class MembresiaResponse {

	private Long id;
	private Long usuarioId;
	private String usuarioNombre;
	private Long planId;
	private String planNombre;
	private LocalDate fechaInicio;
	private LocalDate fechaFin;
	private Boolean estado;

	public MembresiaResponse(Long id, Long usuarioId, String usuarioNombre, Long planId, String planNombre,
			LocalDate fechaInicio, LocalDate fechaFin, Boolean estado) {
		this.id = id;
		this.usuarioId = usuarioId;
		this.usuarioNombre = usuarioNombre;
		this.planId = planId;
		this.planNombre = planNombre;
		this.fechaInicio = fechaInicio;
		this.fechaFin = fechaFin;
		this.estado = estado;
	}

	public Long getId() { return id; }
	public Long getUsuarioId() { return usuarioId; }
	public String getUsuarioNombre() { return usuarioNombre; }
	public Long getPlanId() { return planId; }
	public String getPlanNombre() { return planNombre; }
	public LocalDate getFechaInicio() { return fechaInicio; }
	public LocalDate getFechaFin() { return fechaFin; }
	public Boolean getEstado() { return estado; }
}