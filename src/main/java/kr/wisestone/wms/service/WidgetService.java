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

        User loginUser = SecurityUtils.getCurrentUser();

        QTask $task = QTask.task;

        BooleanBuilder predicate = new BooleanBuilder();

        predicate.and($task.taskUsers.any().user.login.eq(loginUser.getLogin()).or($task.createdBy.eq(loginUser.getLogin())));
        predicate.and($task.status.id.eq(Task.STATUS_ACTIVE));

        if(widgetCondition.getProjectId() != null) {
            predicate.and($task.taskProjects.any().project.id.eq(widgetCondition.getProjectId()));
        }

        switch (widgetCondition.getListType()) {
            case LIST_TYPE_TODAY:

                String today = DateUtil.getTodayWithYYYYMMDD();

                predicate.and($task.period.endDate.isNotEmpty());
                predicate.and($task.period.endDate.loe(today));

                break;
            case LIST_TYPE_TOMORROW:

                String tomorrow = DateUtil.convertDateToStr(DateUtil.addDays(new Date(), 1), "yyyy-MM-dd");

                predicate.and($task.period.endDate.isNotEmpty());
                predicate.and($task.period.endDate.loe(tomorrow));

                break;
            case LIST_TYPE_THIS_WEEK:

                String weekEndDate = DateUtil.convertDateToStr(DateUtil.getWeekEndDate(), "yyyy-MM-dd");

                predicate.and($task.period.endDate.isNotEmpty());
                predicate.and($task.period.endDate.loe(weekEndDate));

                break;
            case LIST_TYPE_SCHEDULED:

                break;
        }

        List<Task> result = Lists.newArrayList(taskRepository.findAll(predicate, QTask.task.period.endDate.asc()));

        TaskListWidgetDTO taskListWidgetDTO = new TaskListWidgetDTO();

        for(Task task : result) {

            TaskDTO taskDTO = new TaskDTO(task);

            taskService.copyTaskRelationProperties(task, taskDTO);

            if(task.getTaskRepeatSchedule() != null && StringUtils.hasText(task.getTaskRepeatSchedule().getRepeatType())) {
                taskListWidgetDTO.addRepeatScheduledTasks(taskDTO);
            }

            if(task.findTaskUser(loginUser, UserType.ASSIGNEE).isPresent()) {
                taskListWidgetDTO.addAssignedTasks(taskDTO);
            }

            if(task.findTaskUser(loginUser, UserType.SHARER).isPresent()) {
                taskListWidgetDTO.addWatchedTasks(taskDTO);
            }

            if(task.getCreatedBy().equals(loginUser.getLogin())) {
                taskListWidgetDTO.addCreatedTasks(taskDTO);
            }
        }

        return taskListWidgetDTO;
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
