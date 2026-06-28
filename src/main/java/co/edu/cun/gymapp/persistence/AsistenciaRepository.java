package co.edu.cun.gymapp.persistence;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import co.edu.cun.gymapp.domain.Asistencia;

@Repository
public interface AsistenciaRepository extends JpaRepository<Asistencia, Long> {

	List<Asistencia> findByUsuarioIdAndEstadoTrue(Long usuarioId);

	List<Asistencia> findByUsuarioIdAndEstadoTrueAndFechaBetween(Long usuarioId, LocalDateTime inicio, LocalDateTime fin);
}