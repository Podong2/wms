package kr.wisestone.wms.repository;

import kr.wisestone.wms.domain.Menu;

import org.springframework.data.jpa.repository.*;

import java.util.List;

/**
 * Spring Data JPA repository for the Menu entity.
 */
@SuppressWarnings("unused")
public interface MenuRepository extends JpaRepository<Menu,Long> {

}
