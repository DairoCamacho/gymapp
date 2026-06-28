package co.edu.cun.gymapp.persistence;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import co.edu.cun.gymapp.domain.Usuario;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

	List<Usuario> findByEstadoTrue();

	Optional<Usuario> findByIdAndEstadoTrue(Long id);

	Optional<Usuario> findByEmailAndEstadoTrue(String email);

	boolean existsByEmailAndEstadoTrue(String email);
}