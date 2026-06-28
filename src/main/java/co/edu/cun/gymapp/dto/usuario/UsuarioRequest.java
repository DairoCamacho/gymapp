package co.edu.cun.gymapp.dto.usuario;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class UsuarioRequest {

	@NotBlank(message = "El nombre es obligatorio")
	private String nombre;

	@NotBlank(message = "El apellido es obligatorio")
	private String apellido;

	private String telefono;

	@NotBlank(message = "El email es obligatorio")
	@Email(message = "El email debe ser válido")
	private String email;

	public String getNombre() { return nombre; }
	public void setNombre(String nombre) { this.nombre = nombre; }
	public String getApellido() { return apellido; }
	public void setApellido(String apellido) { this.apellido = apellido; }
	public String getTelefono() { return telefono; }
	public void setTelefono(String telefono) { this.telefono = telefono; }
	public String getEmail() { return email; }
	public void setEmail(String email) { this.email = email; }
}