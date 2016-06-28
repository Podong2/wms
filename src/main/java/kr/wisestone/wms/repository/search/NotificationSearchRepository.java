package kr.wisestone.wms.repository.search;

import kr.wisestone.wms.domain.Notification;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data ElasticSearch repository for the Notification entity.
 */
public interface NotificationSearchRepository extends ElasticsearchRepository<Notification, Long> {
}
