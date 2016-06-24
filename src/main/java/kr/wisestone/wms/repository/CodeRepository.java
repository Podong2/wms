package kr.wisestone.wms.repository;

import kr.wisestone.wms.domain.Code;

import org.springframework.data.jpa.repository.*;

import java.util.List;

/**
 * Spring Data JPA repository for the Code entity.
 */
@SuppressWarnings("unused")
public interface CodeRepository extends JpaRepository<Code,Long> {

}
