package kr.wisestone.wms.repository;

import kr.wisestone.wms.domain.Menu;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.querydsl.QueryDslPredicateExecutor;

public interface TraceLogRepository extends JpaRepository<Menu,Long>, QueryDslPredicateExecutor<Menu> {
}
