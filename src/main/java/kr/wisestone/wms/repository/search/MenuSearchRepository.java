package kr.wisestone.wms.repository.search;

import kr.wisestone.wms.domain.Menu;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data ElasticSearch repository for the Menu entity.
 */
public interface MenuSearchRepository extends ElasticsearchRepository<Menu, Long> {
}
