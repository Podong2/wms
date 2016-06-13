package kr.wisestone.wms.repository;

import kr.wisestone.wms.domain.Department;

import kr.wisestone.wms.repository.executor.JPQLQueryPredicateExecutor;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.querydsl.QueryDslPredicateExecutor;

import java.util.List;

/**
 * Spring Data JPA repository for the Department entity.
 */
@SuppressWarnings("unused")
public interface DepartmentRepository extends JpaRepository<Department,Long>, QueryDslPredicateExecutor<Department> {

}
