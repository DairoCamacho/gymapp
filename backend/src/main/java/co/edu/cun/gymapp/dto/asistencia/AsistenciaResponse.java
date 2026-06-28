package co.edu.cun.gymapp.dto.asistencia;

import java.time.LocalDateTime;

public class AsistenciaResponse {

	private Long id;
	private Long usuarioId;
	private String usuarioNombre;
	private LocalDateTime fecha;
	private Boolean estado;

	public AsistenciaResponse(Long id, Long usuarioId, String usuarioNombre, LocalDateTime fecha, Boolean estado) {
		this.id = id;
		this.usuarioId = usuarioId;
		this.usuarioNombre = usuarioNombre;
		this.fecha = fecha;
		this.estado = estado;
	}

	public Long getId() { return id; }
	public Long getUsuarioId() { return usuarioId; }
	public String getUsuarioNombre() { return usuarioNombre; }
	public LocalDateTime getFecha() { return fecha; }
	public Boolean getEstado() { return estado; }
}