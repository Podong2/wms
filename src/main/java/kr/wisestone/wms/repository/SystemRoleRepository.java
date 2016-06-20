package kr.wisestone.wms.repository;

import kr.wisestone.wms.domain.SystemRole;

import org.springframework.data.jpa.repository.*;

import java.util.List;

/**
 * Spring Data JPA repository for the SystemRole entity.
 */
@SuppressWarnings("unused")
public interface SystemRoleRepository extends JpaRepository<SystemRole,Long> {

}
