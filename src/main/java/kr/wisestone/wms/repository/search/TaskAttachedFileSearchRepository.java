package kr.wisestone.wms.repository.search;

import kr.wisestone.wms.domain.TaskAttachedFile;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data ElasticSearch repository for the TaskAttachedFile entity.
 */
public interface TaskAttachedFileSearchRepository extends ElasticsearchRepository<TaskAttachedFile, Long> {
}
