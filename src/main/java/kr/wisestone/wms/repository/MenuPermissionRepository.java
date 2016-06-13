package kr.wisestone.wms.repository;

import kr.wisestone.wms.domain.MenuPermission;

import org.springframework.data.jpa.repository.*;

import java.util.List;

/**
 * Spring Data JPA repository for the MenuPermission entity.
 */
@SuppressWarnings("unused")
public interface MenuPermissionRepository extends JpaRepository<MenuPermission,Long> {

}
