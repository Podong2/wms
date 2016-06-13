package kr.wisestone.wms.repository.search;

import kr.wisestone.wms.domain.SystemRoleUser;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data ElasticSearch repository for the SystemRoleUser entity.
 */
public interface SystemRoleUserSearchRepository extends ElasticsearchRepository<SystemRoleUser, Long> {
}
