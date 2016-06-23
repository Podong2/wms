package kr.wisestone.wms.repository;

import kr.wisestone.wms.domain.SystemRolePermission;

import kr.wisestone.wms.repository.executor.JPQLQueryPredicateExecutor;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.querydsl.QueryDslPredicateExecutor;

import java.util.List;

/**
 * Spring Data JPA repository for the SystemRolePermission entity.
 */
@SuppressWarnings("unused")
public interface SystemRolePermissionRepository extends JpaRepository<SystemRolePermission,Long>
                                                        , QueryDslPredicateExecutor<SystemRolePermission>
                                                        , JPQLQueryPredicateExecutor<SystemRolePermission> {

}
