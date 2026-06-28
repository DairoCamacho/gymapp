package co.edu.cun.gymapp.dto.plan;

import java.math.BigDecimal;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class PlanRequest {

	@NotBlank(message = "El nombre es obligatorio")
	private String nombre;

	private String descripcion;

	@NotNull(message = "El precio es obligatorio")
	@Positive(message = "El precio debe ser mayor a cero")
	private BigDecimal precio;

	@NotNull(message = "El tiempo es obligatorio")
	@Positive(message = "El tiempo debe ser mayor a cero")
	private Integer tiempo;

	public String getNombre() { return nombre; }
	public void setNombre(String nombre) { this.nombre = nombre; }
	public String getDescripcion() { return descripcion; }
	public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
	public BigDecimal getPrecio() { return precio; }
	public void setPrecio(BigDecimal precio) { this.precio = precio; }
	public Integer getTiempo() { return tiempo; }
	public void setTiempo(Integer tiempo) { this.tiempo = tiempo; }
}