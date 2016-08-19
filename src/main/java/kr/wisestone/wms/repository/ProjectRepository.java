package kr.wisestone.wms.repository;

import kr.wisestone.wms.domain.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.querydsl.QueryDslPredicateExecutor;

import java.util.List;

/**
 * Spring Data JPA repository for the Task entity.
 */
@SuppressWarnings("unused")
public interface ProjectRepository extends JpaRepository<Project,Long>, QueryDslPredicateExecutor<Project> {

    Project findByName(String name);

    List<Project> findTop3ByOrderByCreatedDateDesc();
}
