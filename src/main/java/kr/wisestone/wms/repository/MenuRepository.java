package kr.wisestone.wms.repository;

import kr.wisestone.wms.domain.Menu;
import kr.wisestone.wms.repository.executor.JPQLQueryPredicateExecutor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.querydsl.QueryDslPredicateExecutor;

import java.util.List;

/**
 * Spring Data JPA repository for the Menu entity.
 */
@SuppressWarnings("unused")
public interface MenuRepository extends JpaRepository<Menu,Long> {

    List<Menu> findByParentIsNullAndDisplayYnIsTrueOrderByPosition();
}
