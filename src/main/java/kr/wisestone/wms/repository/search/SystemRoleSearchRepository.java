package kr.wisestone.wms.repository.search;

import kr.wisestone.wms.domain.SystemRole;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data ElasticSearch repository for the SystemRole entity.
 */
public interface SystemRoleSearchRepository extends ElasticsearchRepository<SystemRole, Long> {
}
