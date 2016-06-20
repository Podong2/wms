package kr.wisestone.wms.repository.search;

import kr.wisestone.wms.domain.Permission;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data ElasticSearch repository for the Permission entity.
 */
public interface PermissionSearchRepository extends ElasticsearchRepository<Permission, Long> {
}
