package kr.wisestone.wms.service;

import com.google.common.collect.Lists;
import com.mysema.query.BooleanBuilder;
import kr.wisestone.wms.common.util.DateUtil;
import kr.wisestone.wms.domain.*;
import kr.wisestone.wms.repository.TaskRepository;
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
    private AttachedFileService attachedFileService;

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
        predicate.and($task.taskRepeatSchedule.endDate.goe(today).or($task.taskRepeatSchedule.permanentYn.eq(true)));

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

            this.saveRepeatTask(task);

            taskRepository.save(task);
        }
    }

    @Transactional
    @Async
    private void saveRepeatTask(Task task) {

        String today = DateUtil.getTodayWithYYYYMMDD();

        Task repeatTask = new Task();

        repeatTask.setName(task.getName());

        if(StringUtils.hasText(task.getContents()))
            repeatTask.setContents(task.getContents());

        repeatTask.setImportantYn(task.getImportantYn());

        Period period = new Period(today, today);

        repeatTask.setPeriod(period);

//        repeatTask.setStartDate(today);
//        repeatTask.setEndDate(today);

        Code status = new Code();
        status.setId(Task.STATUS_ACTIVE);
        repeatTask.setStatus(status);

        if(task.getTaskProjects() != null && !task.getTaskProjects().isEmpty())
            task.getPlainTaskProject().forEach(repeatTask::updateTaskProject);

        List<User> assignees = task.findTaskUsersByType(UserType.ASSIGNEE);
        List<User> watchers = task.findTaskUsersByType(UserType.SHARER);

        if(assignees != null && !assignees.isEmpty()) {

            for(User user : assignees) {
                repeatTask.addTaskUser(user, UserType.ASSIGNEE);
            }
        }

        if(watchers != null && !watchers.isEmpty()) {

            for(User user : watchers) {
                repeatTask.addTaskUser(user, UserType.SHARER);
            }
        }

        if(task.getRelatedTasks() != null && !task.getRelatedTasks().isEmpty())
            task.getPlainRelatedTask().forEach(repeatTask::addRelatedTask);

        if(task.getTaskAttachedFiles() != null && !task.getTaskAttachedFiles().isEmpty()) {

            List<AttachedFile> attachedFiles = task.getPlainTaskAttachedFiles();

            for(AttachedFile attachedFile : attachedFiles) {
                AttachedFile copiedAttachedFile = this.attachedFileService.copyFile(attachedFile);

                task.addAttachedFile(copiedAttachedFile);
            }
        }

        taskRepository.save(repeatTask);
    }
}
