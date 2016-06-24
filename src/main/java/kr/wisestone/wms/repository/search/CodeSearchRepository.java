package kr.wisestone.wms.repository.search;

import kr.wisestone.wms.domain.Code;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data ElasticSearch repository for the Code entity.
 */
public interface CodeSearchRepository extends ElasticsearchRepository<Code, Long> {
}
