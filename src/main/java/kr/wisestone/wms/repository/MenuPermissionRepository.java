package kr.wisestone.wms.repository;

import kr.wisestone.wms.domain.MenuPermission;

import kr.wisestone.wms.repository.executor.JPQLQueryPredicateExecutor;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.querydsl.QueryDslPredicateExecutor;

import java.util.List;

/**
 * Spring Data JPA repository for the MenuPermission entity.
 */
@SuppressWarnings("unused")
public interface MenuPermissionRepository extends JpaRepository<MenuPermission,Long>
                                                , QueryDslPredicateExecutor<MenuPermission>
                                                , JPQLQueryPredicateExecutor<MenuPermission> {

}
