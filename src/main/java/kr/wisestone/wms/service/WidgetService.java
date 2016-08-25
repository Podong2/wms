package kr.wisestone.wms.service;

import com.google.common.collect.Lists;
import com.mysema.query.BooleanBuilder;
import kr.wisestone.wms.common.util.DateUtil;
import kr.wisestone.wms.domain.QTask;
import kr.wisestone.wms.domain.Task;
import kr.wisestone.wms.domain.User;
import kr.wisestone.wms.domain.UserType;
import kr.wisestone.wms.repository.TaskRepository;
import kr.wisestone.wms.security.SecurityUtils;
import kr.wisestone.wms.web.rest.condition.TaskCondition;
import kr.wisestone.wms.web.rest.condition.WidgetCondition;
import kr.wisestone.wms.web.rest.dto.TaskDTO;
import kr.wisestone.wms.web.rest.dto.TaskListWidgetDTO;
import kr.wisestone.wms.web.rest.mapper.TaskMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.inject.Inject;
import java.util.Date;
import java.util.List;

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
        predicate.and($task.status.id.eq(1L));

        if(widgetCondition.getProjectId() != null) {
            predicate.and($task.taskProjects.any().project.id.eq(widgetCondition.getProjectId()));
        }

        predicate.and($task.endDate.isNotNull());

        switch (widgetCondition.getListType()) {
            case LIST_TYPE_TODAY:

                String today = DateUtil.getTodayWithYYYYMMDD();

                predicate.and($task.endDate.loe(today));

                break;
            case LIST_TYPE_TOMORROW:

                String tomorrow = DateUtil.convertDateToStr(DateUtil.addDays(new Date(), 1), "yyyy-MM-dd");

                predicate.and($task.endDate.loe(tomorrow));

                break;
            case LIST_TYPE_THIS_WEEK:

                String weekEndDate = DateUtil.convertDateToStr(DateUtil.getWeekEndDate(), "yyyy-MM-dd");

                predicate.and($task.endDate.loe(weekEndDate));

                break;
            case LIST_TYPE_SCHEDULED:

                break;
        }

        List<Task> result = Lists.newArrayList(taskRepository.findAll(predicate, QTask.task.endDate.asc()));

        TaskListWidgetDTO taskListWidgetDTO = new TaskListWidgetDTO();

        for(Task task : result) {

            TaskDTO taskDTO = taskMapper.taskToTaskDTO(task);

            taskService.copyTaskRelationProperties(task, taskDTO);


            if(task.getTaskRepeatSchedule() != null) {
                taskListWidgetDTO.addRepeatScheduledTasks(taskDTO);
            }

            if(task.findTaskUser(loginUser, UserType.ASSIGNEE).isPresent()) {
                taskListWidgetDTO.addAssignedTasks(taskDTO);
            }

            if(task.findTaskUser(loginUser, UserType.WATCHER).isPresent()) {
                taskListWidgetDTO.addWatchedTasks(taskDTO);
            }

            if(task.getCreatedBy().equals(loginUser.getLogin())) {
                taskListWidgetDTO.addCreatedTasks(taskDTO);
            }
        }

        return taskListWidgetDTO;
    }
}
