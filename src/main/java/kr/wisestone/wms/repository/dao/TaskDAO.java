package kr.wisestone.wms.repository.dao;

import kr.wisestone.wms.web.rest.dto.TaskDTO;
import kr.wisestone.wms.web.rest.dto.TaskStatisticsDTO;
import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
public class TaskDAO {

    @Autowired
    private SqlSession sqlSession;

    public List<TaskDTO> getTasks(Map<String, Object> condition) {
        return sqlSession.selectList("kr.wisestone.wms.domain.Task.getTasks", condition);
    }

    public TaskStatisticsDTO getTaskCount(Map<String, Object> condition) {
        return sqlSession.selectOne("kr.wisestone.wms.domain.Task.getTaskCount", condition);
    }
}
