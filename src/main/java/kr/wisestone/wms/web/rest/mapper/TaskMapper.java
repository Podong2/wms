package kr.wisestone.wms.web.rest.mapper;

import com.google.common.base.Function;
import com.google.common.base.Predicate;
import com.google.common.collect.Iterables;
import kr.wisestone.wms.domain.*;
import kr.wisestone.wms.web.rest.dto.TaskDTO;

import kr.wisestone.wms.web.rest.dto.TaskRepeatScheduleDTO;
import org.mapstruct.*;

import javax.annotation.Nullable;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Mapper for the entity Task and its DTO TaskDTO.
 */
@Mapper(componentModel = "spring", uses = {})
public interface TaskMapper {

    @Mapping(source = "period.startDate", target = "startDate")
    @Mapping(source = "period.endDate", target = "endDate")
    @Mapping(source = "status.id", target = "statusId")
    @Mapping(source = "status.name", target = "statusName")
    @Mapping(source = "subTasks", target = "subTasks", ignore = true)
    @Mapping(source = "taskRepeatSchedule", target = "taskRepeatSchedule", ignore = true)
    @Mapping(source = "taskProjects", target = "taskProjects", ignore = true)
    @Mapping(source = "relatedTasks", target = "relatedTasks", ignore = true)
    TaskDTO taskToTaskDTO(Task task);

    List<TaskDTO> tasksToTaskDTOs(List<Task> tasks);

    @Mapping(source = "statusId", target = "status")
    @Mapping(source = "subTasks", target = "subTasks", ignore = true)
    @Mapping(source = "taskProjects", target = "taskProjects", ignore = true)
    @Mapping(source = "relatedTasks", target = "relatedTasks", ignore = true)
    @Mapping(source = "taskRepeatSchedule", target = "taskRepeatSchedule", ignore = true)
    Task taskDTOToTask(TaskDTO taskDTO);

    List<Task> taskDTOsToTasks(List<TaskDTO> taskDTOs);

    default Code codeFromId(Long id) {
        if (id == null) {
            return null;
        }
        Code code = new Code();
        code.setId(id);
        return code;
    }

    default User userFromId(Long id) {
        if (id == null) {
            return null;
        }
        User user = new User();
        user.setId(id);
        return user;
    }
}
