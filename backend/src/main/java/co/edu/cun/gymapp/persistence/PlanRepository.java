package co.edu.cun.gymapp.persistence;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import co.edu.cun.gymapp.domain.Plan;

@Repository
public interface PlanRepository extends JpaRepository<Plan, Long> {

	List<Plan> findByEstadoTrue();

	Optional<Plan> findByIdAndEstadoTrue(Long id);

	Optional<Plan> findByNombreAndEstadoTrue(String nombre);
}