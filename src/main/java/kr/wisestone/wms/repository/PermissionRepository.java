package kr.wisestone.wms.repository;

import kr.wisestone.wms.domain.Permission;

import org.springframework.data.jpa.repository.*;
import org.springframework.data.querydsl.QueryDslPredicateExecutor;

import java.util.List;

/**
 * Spring Data JPA repository for the Permission entity.
 */
@SuppressWarnings("unused")
public interface PermissionRepository extends JpaRepository<Permission,Long>, QueryDslPredicateExecutor<Permission> {

}
