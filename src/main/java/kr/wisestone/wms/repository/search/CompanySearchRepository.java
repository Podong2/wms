package kr.wisestone.wms.repository.search;

import kr.wisestone.wms.domain.Company;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data ElasticSearch repository for the Company entity.
 */
public interface CompanySearchRepository extends ElasticsearchRepository<Company, Long> {
}
