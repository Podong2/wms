package kr.wisestone.wms.repository.dao;

import kr.wisestone.wms.web.rest.dto.NotificationDTO;
import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
public class NotificationDAO {

    @Autowired
    private SqlSession sqlSession;

    public List<NotificationDTO> getNotifications(Map<String, Object> condition) {
        return sqlSession.selectList("kr.wisestone.wms.domain.Notification.getNotifications", condition);
    }
}
