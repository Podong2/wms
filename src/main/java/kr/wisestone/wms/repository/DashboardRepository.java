package kr.wisestone.wms.repository;

import kr.wisestone.wms.domain.Dashboard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.querydsl.QueryDslPredicateExecutor;

public interface DashboardRepository extends JpaRepository<Dashboard, Long>, QueryDslPredicateExecutor<Dashboard> {
}
