package kr.wisestone.wms.repository.dao;

import kr.wisestone.wms.web.rest.dto.TaskDTO;
import kr.wisestone.wms.web.rest.dto.TaskStatisticsDTO;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
public class TaskDAO {

    @Autowired
    private SqlSession sqlSession;

    public List<TaskDTO> getMyTasks(Map<String, Object> condition) {
        return sqlSession.selectList("kr.wisestone.wms.domain.Task.getMyTasks", condition);
    }

    public List<TaskDTO> getTasksByCondition(Map<String, Object> condition) {
        return sqlSession.selectList("kr.wisestone.wms.domain.Task.getTasksByCondition", condition);
    }

    public TaskDTO getTask(Long id) {
        return sqlSession.selectOne("kr.wisestone.wms.domain.Task.getTask", id);
    }

    public TaskStatisticsDTO getTaskCount(Map<String, Object> condition) {
        return sqlSession.selectOne("kr.wisestone.wms.domain.Task.getTaskCount", condition);
    }
}
