package kr.wisestone.wms.service;

import com.google.common.collect.Lists;
import com.mysema.query.BooleanBuilder;
import kr.wisestone.wms.common.util.ConvertUtil;
import kr.wisestone.wms.common.util.DateUtil;
import kr.wisestone.wms.domain.*;
import kr.wisestone.wms.repository.AttachedFileRepository;
import kr.wisestone.wms.repository.ProjectRepository;
import kr.wisestone.wms.repository.TaskRepository;
import kr.wisestone.wms.repository.UserRepository;
import kr.wisestone.wms.web.rest.dto.TaskSnapshotDTO;
import org.flywaydb.core.internal.util.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Calendar;
import java.util.Date;
import java.util.List;

@Service
public class TaskRepeatScheduleService {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AttachedFileRepository attachedFileRepository;

    @Scheduled(fixedRate = 60000)
    @Transactional
    public void findScheduleAndExecute() {

        String today = DateUtil.getTodayWithYYYYMMDD();
        String currentTimeHHmm = DateUtil.convertDateToStr(new Date(), "HH:mm");
        Calendar calendar = Calendar.getInstance();

        Integer dayOfWeek = calendar.get(Calendar.DAY_OF_WEEK);
        Integer weekOfMonth = calendar.get(Calendar.WEEK_OF_MONTH);
        Integer dayOfMonth = calendar.get(Calendar.DAY_OF_MONTH);

        QTask $task = QTask.task;

        BooleanBuilder predicate = new BooleanBuilder();

        predicate.and($task.taskRepeatSchedule.isNotNull());

        predicate.and($task.taskRepeatSchedule.startDate.loe(today));
        predicate.and($task.taskRepeatSchedule.endDate.goe(today).or($task.taskRepeatSchedule.permanentYn.eq(Boolean.TRUE)));

        //매일, 주간 설정 스케쥴 조건
        BooleanBuilder dailyWeeklyPredicate = new BooleanBuilder();
        dailyWeeklyPredicate.and($task.taskRepeatSchedule.repeatType.eq(TaskRepeatSchedule.REPEAT_TYPE_DAILY)
                                .or($task.taskRepeatSchedule.repeatType.eq(TaskRepeatSchedule.REPEAT_TYPE_WEEKLY)));
        dailyWeeklyPredicate.and($task.taskRepeatSchedule.weekdays.contains(dayOfWeek.toString()));

        //매월(요일 선택) 설정 스케쥴 조건
        BooleanBuilder monthlyDatePredicate = new BooleanBuilder();
        monthlyDatePredicate.and($task.taskRepeatSchedule.repeatType.eq(TaskRepeatSchedule.REPEAT_TYPE_MONTHLY_DATE));
        monthlyDatePredicate.and($task.taskRepeatSchedule.monthlyCriteria.eq(dayOfMonth.toString()));

        //매월(날짜 선택) 설정 스케쥴 조건
        BooleanBuilder monthlyWeekdayPredicate = new BooleanBuilder();
        monthlyWeekdayPredicate.and($task.taskRepeatSchedule.repeatType.eq(TaskRepeatSchedule.REPEAT_TYPE_MONTHLY_WEEKDAY));
        monthlyWeekdayPredicate.and($task.taskRepeatSchedule.monthlyCriteria.eq(weekOfMonth.toString()));
        monthlyWeekdayPredicate.and($task.taskRepeatSchedule.weekdays.contains(dayOfWeek.toString()));

        predicate.and(dailyWeeklyPredicate
                    .or(monthlyDatePredicate)
                    .or(monthlyWeekdayPredicate));

        predicate.and($task.taskRepeatSchedule.adventDateStartTime.eq(currentTimeHHmm));
        predicate.and($task.taskRepeatSchedule.executeDate.lt(today));

        List<Task> tasks = Lists.newArrayList(taskRepository.findAll(predicate));

        for(Task task : tasks) {
            TaskRepeatSchedule taskRepeatSchedule = task.getTaskRepeatSchedule();
            taskRepeatSchedule.setExecuteDate(today);

//            this.saveRepeatTask(task);

            taskRepository.save(task);
        }
    }

    @Transactional
    @Async
    private void saveRepeatTask(Task task) {

        Task repeatTask = new Task();

        TaskRepeatSchedule taskRepeatSchedule = task.getTaskRepeatSchedule();

        TaskSnapshotDTO taskSnapshotDTO = ConvertUtil.convertJsonToObject(taskRepeatSchedule.getTaskSnapshot(), TaskSnapshotDTO.class);

        if(StringUtils.hasText(taskSnapshotDTO.getName()))
            repeatTask.setName(taskSnapshotDTO.getName());

        if(StringUtils.hasText(taskSnapshotDTO.getContents()))
            repeatTask.setContents(taskSnapshotDTO.getContents());

        repeatTask.setImportantYn(taskSnapshotDTO.getImportantYn());

        Code status = new Code();
        status.setId(1L);
        repeatTask.setStatus(status);

        if(taskSnapshotDTO.getProjectIds() != null && !taskSnapshotDTO.getProjectIds().isEmpty()) {

            List<Project> projects = projectRepository.findAll(taskSnapshotDTO.getProjectIds());

            projects.forEach(repeatTask::addTaskProject);
        }

        if(taskSnapshotDTO.getAssigneeIds() != null && !taskSnapshotDTO.getAssigneeIds().isEmpty()) {

            List<User> users = userRepository.findAll(taskSnapshotDTO.getAssigneeIds());

            for(User user : users) {
                repeatTask.addTaskUser(user, UserType.ASSIGNEE);
            }
        }

        if(taskSnapshotDTO.getWatcherIds() != null && !taskSnapshotDTO.getWatcherIds().isEmpty()) {

            List<User> users = userRepository.findAll(taskSnapshotDTO.getWatcherIds());

            for(User user : users) {
                repeatTask.addTaskUser(user, UserType.WATCHER);
            }
        }

        if(taskSnapshotDTO.getRelatedTaskIds() != null && !taskSnapshotDTO.getRelatedTaskIds().isEmpty()) {

            List<Task> tasks = taskRepository.findAll(taskSnapshotDTO.getRelatedTaskIds());

            tasks.forEach(repeatTask::addRelatedTask);
        }

        if(taskSnapshotDTO.getAttachedFileIds() != null && !taskSnapshotDTO.getAttachedFileIds().isEmpty()) {

            List<AttachedFile> attachedFiles = attachedFileRepository.findAll(taskSnapshotDTO.getAttachedFileIds());

            attachedFiles.forEach(repeatTask::addAttachedFile);
        }

        taskRepository.save(repeatTask);
    }
}
