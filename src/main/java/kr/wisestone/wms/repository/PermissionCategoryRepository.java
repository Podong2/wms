package kr.wisestone.wms.repository;

import kr.wisestone.wms.domain.PermissionCategory;

import org.springframework.data.jpa.repository.*;

import java.util.List;

/**
 * Spring Data JPA repository for the PermissionCategory entity.
 */
@SuppressWarnings("unused")
public interface PermissionCategoryRepository extends JpaRepository<PermissionCategory,Long> {

}
