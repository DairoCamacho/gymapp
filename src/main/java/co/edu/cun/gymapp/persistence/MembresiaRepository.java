package co.edu.cun.gymapp.persistence;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import co.edu.cun.gymapp.domain.Membresia;

@Repository
public interface MembresiaRepository extends JpaRepository<Membresia, Long> {

	List<Membresia> findByUsuarioId(Long usuarioId);

	List<Membresia> findByUsuarioIdAndEstado(Long usuarioId, Boolean estado);

	List<Membresia> findByUsuarioIdAndFechaFinAfter(Long usuarioId, LocalDate fecha);
}