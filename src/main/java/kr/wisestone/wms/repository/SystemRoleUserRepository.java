package kr.wisestone.wms.repository;

import kr.wisestone.wms.domain.SystemRoleUser;

import org.springframework.data.jpa.repository.*;

import java.util.List;

/**
 * Spring Data JPA repository for the SystemRoleUser entity.
 */
@SuppressWarnings("unused")
public interface SystemRoleUserRepository extends JpaRepository<SystemRoleUser,Long> {

}
