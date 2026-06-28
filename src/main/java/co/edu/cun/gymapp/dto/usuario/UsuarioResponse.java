package co.edu.cun.gymapp.dto.usuario;

public class UsuarioResponse {

	private Long id;
	private String nombre;
	private String apellido;
	private String telefono;
	private String email;
	private Boolean estado;

	public UsuarioResponse(Long id, String nombre, String apellido, String telefono, String email, Boolean estado) {
		this.id = id;
		this.nombre = nombre;
		this.apellido = apellido;
		this.telefono = telefono;
		this.email = email;
		this.estado = estado;
	}

	public Long getId() { return id; }
	public String getNombre() { return nombre; }
	public String getApellido() { return apellido; }
	public String getTelefono() { return telefono; }
	public String getEmail() { return email; }
	public Boolean getEstado() { return estado; }
}