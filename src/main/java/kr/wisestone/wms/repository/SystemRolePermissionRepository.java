package kr.wisestone.wms.repository;

import kr.wisestone.wms.domain.SystemRolePermission;

import org.springframework.data.jpa.repository.*;

import java.util.List;

/**
 * Spring Data JPA repository for the SystemRolePermission entity.
 */
@SuppressWarnings("unused")
public interface SystemRolePermissionRepository extends JpaRepository<SystemRolePermission,Long> {

}
