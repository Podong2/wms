package kr.wisestone.wms.repository;

import kr.wisestone.wms.domain.TraceLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.querydsl.QueryDslPredicateExecutor;

public interface TraceLogRepository extends JpaRepository<TraceLog,Long>, QueryDslPredicateExecutor<TraceLog> {
}
