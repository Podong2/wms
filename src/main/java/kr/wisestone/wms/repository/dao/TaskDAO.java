package kr.wisestone.wms.repository.dao;

import kr.wisestone.wms.web.rest.dto.TaskDTO;
import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class TaskDAO {

    @Autowired
    private SqlSession sqlSession;

    public List<TaskDTO> getTasks() {
        return sqlSession.selectList("kr.wisestone.wms.domain.Task.getTasks");
    }
}
