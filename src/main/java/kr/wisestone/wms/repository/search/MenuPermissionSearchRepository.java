package kr.wisestone.wms.repository.search;

import kr.wisestone.wms.domain.MenuPermission;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data ElasticSearch repository for the MenuPermission entity.
 */
public interface MenuPermissionSearchRepository extends ElasticsearchRepository<MenuPermission, Long> {
}
