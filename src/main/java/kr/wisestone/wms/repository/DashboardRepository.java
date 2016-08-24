package kr.wisestone.wms.repository;

import kr.wisestone.wms.domain.Dashboard;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DashboardRepository extends JpaRepository<Dashboard, Long> {
}
