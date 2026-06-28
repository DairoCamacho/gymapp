package co.edu.cun.gymapp.persistence;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import co.edu.cun.gymapp.domain.Membresia;

@Repository
public interface MembresiaRepository extends JpaRepository<Membresia, Long> {

	List<Membresia> findByUsuarioIdAndEstadoTrue(Long usuarioId);

	Optional<Membresia> findTopByUsuarioIdAndEstadoTrueAndFechaFinAfterOrderByFechaFinDesc(Long usuarioId, LocalDate fecha);

	Optional<Membresia> findTopByUsuarioIdAndEstadoTrueOrderByFechaFinDesc(Long usuarioId);
}