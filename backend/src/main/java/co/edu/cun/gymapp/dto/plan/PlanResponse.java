package co.edu.cun.gymapp.dto.plan;

import java.math.BigDecimal;

public class PlanResponse {

	private Long id;
	private String nombre;
	private String descripcion;
	private BigDecimal precio;
	private Integer tiempo;
	private Boolean estado;

	public PlanResponse(Long id, String nombre, String descripcion, BigDecimal precio, Integer tiempo, Boolean estado) {
		this.id = id;
		this.nombre = nombre;
		this.descripcion = descripcion;
		this.precio = precio;
		this.tiempo = tiempo;
		this.estado = estado;
	}

	public Long getId() { return id; }
	public String getNombre() { return nombre; }
	public String getDescripcion() { return descripcion; }
	public BigDecimal getPrecio() { return precio; }
	public Integer getTiempo() { return tiempo; }
	public Boolean getEstado() { return estado; }
}