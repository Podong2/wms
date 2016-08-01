package kr.wisestone.wms.repository;

import kr.wisestone.wms.domain.Task;

import org.springframework.data.jpa.repository.*;
import org.springframework.data.querydsl.QueryDslPredicateExecutor;

import java.util.List;

/**
 * Spring Data JPA repository for the Task entity.
 */
@SuppressWarnings("unused")
public interface TaskRepository extends JpaRepository<Task,Long>, QueryDslPredicateExecutor<Task> {

    Task findByName(String name);
}
