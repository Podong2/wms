package kr.wisestone.wms.repository.dao;

import kr.wisestone.wms.web.rest.dto.TaskProgressWidgetDTO;
import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.Map;

@Repository
public class WidgetDAO {

    @Autowired
    private SqlSession sqlSession;

    public TaskProgressWidgetDTO getTaskProgressCount(Map<String, Object> condition) {
        return sqlSession.selectOne("kr.wisestone.wms.domain.Dashboard.getTaskProgressCount", condition);
    }

}
