package kr.wisestone.wms.web.rest.mapper;

import kr.wisestone.wms.domain.*;
import kr.wisestone.wms.web.rest.dto.TaskDTO;

import org.mapstruct.*;
import java.util.List;

/**
 * Mapper for the entity Task and its DTO TaskDTO.
 */
@Mapper(componentModel = "spring", uses = {})
public interface TaskMapper {

    @Mapping(source = "severity.id", target = "severityId")
    @Mapping(source = "severity.name", target = "severityName")
    @Mapping(source = "assignee.id", target = "assigneeId")
    @Mapping(source = "assignee.name", target = "assigneeName")
    TaskDTO taskToTaskDTO(Task task);

    List<TaskDTO> tasksToTaskDTOs(List<Task> tasks);

    @Mapping(source = "severityId", target = "severity")
    @Mapping(source = "assigneeId", target = "assignee")
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
