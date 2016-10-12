package kr.wisestone.wms.service;

import com.google.common.collect.Lists;
import com.mysema.query.BooleanBuilder;
import kr.wisestone.wms.common.util.DateUtil;
import kr.wisestone.wms.domain.QTask;
import kr.wisestone.wms.domain.Task;
import kr.wisestone.wms.domain.User;
import kr.wisestone.wms.domain.UserType;
import kr.wisestone.wms.domain.util.JSR310PersistenceConverters;
import kr.wisestone.wms.repository.TaskRepository;
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

        TaskProgressWidgetDTO taskProgressWidgetDTO = new TaskProgressWidgetDTO();

        List<Task> assignedTasks = this.getTaskByUserType(widgetCondition.getProjectId(), "assigned");
        List<Task> watchedTasks = this.getTaskByUserType(widgetCondition.getProjectId(), "watched");
        List<Task> createdTasks = this.getTaskByUserType(widgetCondition.getProjectId(), "created");

        taskProgressWidgetDTO.setCreatedTaskTotalCount(createdTasks.stream().count());
        taskProgressWidgetDTO.setWatchedTaskTotalCount(watchedTasks.stream().count());
        taskProgressWidgetDTO.setAssignedTaskTotalCount(assignedTasks.stream().count());

        taskProgressWidgetDTO.setCreatedTaskCompleteCount(getCompleteCountByList(createdTasks));
        taskProgressWidgetDTO.setWatchedTaskCompleteCount(getCompleteCountByList(watchedTasks));
        taskProgressWidgetDTO.setAssignedTaskCompleteCount(getCompleteCountByList(assignedTasks));

        return taskProgressWidgetDTO;
    }

    private List<Task> getTaskByUserType(Long projectId, String type) {

        User loginUser = SecurityUtils.getCurrentUser();

        QTask $task = QTask.task;

        Date startDate = DateUtil.getMonthStartDate();
        Date endDate = DateUtil.getMonthEndDate();

        BooleanBuilder predicate = new BooleanBuilder();

        if(type.equalsIgnoreCase("assigned")) {
            predicate.and($task.taskUsers.any().user.login.eq(loginUser.getLogin()).and($task.taskUsers.any().userType.eq(UserType.ASSIGNEE)));
        } else if(type.equalsIgnoreCase("watched")) {
            predicate.and($task.taskUsers.any().user.login.eq(loginUser.getLogin()).and($task.taskUsers.any().userType.eq(UserType.SHARER)));
        } else if(type.equalsIgnoreCase("created")) {
            predicate.and($task.createdBy.eq(loginUser.getLogin()));
        }

        predicate.and($task.status.id.eq(Task.STATUS_ACTIVE).or($task.status.id.eq(Task.STATUS_COMPLETE)));
        predicate.and($task.lastModifiedDate.goe(DateUtil.convertToZonedDateTime(startDate)));
        predicate.and($task.lastModifiedDate.loe(DateUtil.convertToZonedDateTime(endDate)));

        if(projectId != null) {
            predicate.and($task.taskProjects.any().project.id.eq(projectId));
        }

        return Lists.newArrayList(taskRepository.findAll(predicate));
    }

    private Long getCompleteCountByList(List<Task> tasks) {
        return tasks.stream().filter(taskDTO -> taskDTO.getStatus().getId().equals(Task.STATUS_COMPLETE)).count();
    }
}
