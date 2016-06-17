package kr.wisestone.wms.repository;

import kr.wisestone.wms.domain.AttachedFile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

/**
 * Spring Data JPA repository for the AttachedFile entity.
 */
@SuppressWarnings("unused")
public interface AttachedFileRepository extends JpaRepository<AttachedFile, Long> {

    Optional<AttachedFile> findOneById(Long userId);
}
