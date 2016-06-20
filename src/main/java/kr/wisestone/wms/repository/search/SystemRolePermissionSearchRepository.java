package kr.wisestone.wms.repository.search;

import kr.wisestone.wms.domain.SystemRolePermission;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data ElasticSearch repository for the SystemRolePermission entity.
 */
public interface SystemRolePermissionSearchRepository extends ElasticsearchRepository<SystemRolePermission, Long> {
}
