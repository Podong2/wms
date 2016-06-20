package kr.wisestone.wms.repository.search;

import kr.wisestone.wms.domain.PermissionCategory;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data ElasticSearch repository for the PermissionCategory entity.
 */
public interface PermissionCategorySearchRepository extends ElasticsearchRepository<PermissionCategory, Long> {
}
