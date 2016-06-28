package kr.wisestone.wms.repository.search;

import kr.wisestone.wms.domain.NotificationRecipient;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data ElasticSearch repository for the NotificationRecipient entity.
 */
public interface NotificationRecipientSearchRepository extends ElasticsearchRepository<NotificationRecipient, Long> {
}
