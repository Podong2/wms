package kr.wisestone.wms.repository;

import kr.wisestone.wms.domain.Notification;

import kr.wisestone.wms.repository.executor.JPQLQueryPredicateExecutor;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.querydsl.QueryDslPredicateExecutor;

import java.util.List;

/**
 * Spring Data JPA repository for the Notification entity.
 */
@SuppressWarnings("unused")
public interface NotificationRepository extends JpaRepository<Notification,Long>, QueryDslPredicateExecutor<Notification>, JPQLQueryPredicateExecutor<Notification> {

}
