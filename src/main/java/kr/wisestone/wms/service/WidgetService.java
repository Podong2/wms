package kr.wisestone.wms.service;

import com.google.common.collect.ImmutableMap;
import com.google.common.collect.Lists;
import com.google.common.collect.Maps;
import com.mysema.query.BooleanBuilder;
import kr.wisestone.wms.common.util.DateUtil;
import kr.wisestone.wms.domain.QTask;
import kr.wisestone.wms.domain.Task;
import kr.wisestone.wms.domain.User;
import kr.wisestone.wms.domain.UserType;
import kr.wisestone.wms.domain.util.JSR310PersistenceConverters;
import kr.wisestone.wms.repository.TaskRepository;
import kr.wisestone.wms.repository.dao.WidgetDAO;
import kr.wisestone.wms.security.SecurityUtils;
import kr.wisestone.wms.web.rest.condition.TaskCondition;
import kr.wisestone.wms.web.rest.condition.WidgetCondition;
import kr.wisestone.wms.web.rest.dto.TaskDTO;
import kr.wisestone.wms.web.rest.dto.TaskListWidgetDTO;
import kr.wisestone.wms.web.rest.dto.TaskProgressWidgetDTO;
import kr.wisestone.wms.web.rest.mapper.TaskMapper;
import org.flywaydb.core.internal.util.StringUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.inject.Inject;
import java.time.ZonedDateTime;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class WidgetService {

    private static final String LIST_TYPE_TODAY = "TODAY";
    private static final String LIST_TYPE_TOMORROW = "TOMORROW";
    private static final String LIST_TYPE_THIS_WEEK = "THIS_WEEK";
    private static final String LIST_TYPE_SCHEDULED = "SCHEDULED";

    @Inject
    private TaskRepository taskRepository;

    @Inject
    private TaskMapper taskMapper;

    @Inject
    private TaskService taskService;

    @Inject
    private WidgetDAO widgetDAO;

    @Transactional(readOnly = true)
    public TaskListWidgetDTO getTaskListWidgetData(WidgetCondition widgetCondition) {

        Map<String, Object> condition = Maps.newHashMap(ImmutableMap.<String, Object>builder().
            put("listType", widgetCondition.getListType()).
            put("userId", SecurityUtils.getCurrentUserLogin()).
        build());

        if(widgetCondition.getProjectId() != null) {
            condition.put("projectId", widgetCondition.getProjectId());
        }

        switch (widgetCondition.getListType()) {
            case LIST_TYPE_TOMORROW:

                String tomorrow = DateUtil.convertDateToStr(DateUtil.addDays(new Date(), 1), "yyyy-MM-dd");

                condition.put("tomorrow", tomorrow);

                break;
            case LIST_TYPE_THIS_WEEK:

                String weekEndDate = DateUtil.convertDateToStr(DateUtil.getWeekEndDate(), "yyyy-MM-dd");

                condition.put("tomorrow", weekEndDate);

                break;
        }

        TaskListWidgetDTO taskListWidgetDTO = new TaskListWidgetDTO();
        taskListWidgetDTO.setAssignedTasks(this.getWidgetTaskListByFilterType(condition, "ASSIGNED"));
        taskListWidgetDTO.setWatchedTasks(this.getWidgetTaskListByFilterType(condition, "WATCHED"));
        taskListWidgetDTO.setCreatedTasks(this.getWidgetTaskListByFilterType(condition, "REQUESTED"));

        return taskListWidgetDTO;
    }

    private List<TaskDTO> getWidgetTaskListByFilterType(Map<String, Object> condition, String filterType) {

        condition.put("filterType", filterType);

        return this.widgetDAO.getWidgetTasks(condition);
    }

    @Transactional(readOnly = true)
    public TaskProgressWidgetDTO getTaskProgressWidgetData(WidgetCondition widgetCondition) {

        Date monthStartDate = DateUtil.getMonthStartDate();
        Date monthEndDate = DateUtil.getMonthEndDate();

        Map<String, Object> condition = Maps.newHashMap(ImmutableMap.<String, Object>builder().
            put("monthStartDate", monthStartDate).
            put("monthEndDate", monthEndDate).
            put("userId", SecurityUtils.getCurrentUserLogin()).
        build());

        if(widgetCondition.getProjectId() != null) {
            condition.put("projectId", widgetCondition.getProjectId());
        }

        TaskProgressWidgetDTO taskProgressWidgetDTO = this.widgetDAO.getTaskProgressCount(condition);

        return taskProgressWidgetDTO;
    }
}
