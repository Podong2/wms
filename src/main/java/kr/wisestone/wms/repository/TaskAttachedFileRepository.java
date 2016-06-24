package kr.wisestone.wms.repository;

import kr.wisestone.wms.domain.TaskAttachedFile;

import org.springframework.data.jpa.repository.*;

import java.util.List;

/**
 * Spring Data JPA repository for the TaskAttachedFile entity.
 */
@SuppressWarnings("unused")
public interface TaskAttachedFileRepository extends JpaRepository<TaskAttachedFile,Long> {

}
