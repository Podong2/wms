package kr.wisestone.wms.repository;

import kr.wisestone.wms.domain.NotificationRecipient;

import org.springframework.data.jpa.repository.*;

import java.util.List;

/**
 * Spring Data JPA repository for the NotificationRecipient entity.
 */
@SuppressWarnings("unused")
public interface NotificationRecipientRepository extends JpaRepository<NotificationRecipient,Long> {

}
