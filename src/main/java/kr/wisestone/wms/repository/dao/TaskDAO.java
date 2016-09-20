package kr.wisestone.wms.repository.dao;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

@Repository
public class TaskDAO {

    @Autowired
    private SqlSession sqlSession;

    public String getNameById() {
        return sqlSession.selectOne("kr.wisestone.wms.domain.Task.getNameById");
    }
}
