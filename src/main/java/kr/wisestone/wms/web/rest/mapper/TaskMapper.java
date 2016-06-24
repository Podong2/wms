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
    @Mapping(source = "taskAttachedFiles.id", target = "taskAttachedFilesId")
    TaskDTO taskToTaskDTO(Task task);

    List<TaskDTO> tasksToTaskDTOs(List<Task> tasks);

    @Mapping(source = "severityId", target = "severity")
    @Mapping(source = "taskAttachedFilesId", target = "taskAttachedFiles")
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

    default TaskAttachedFile taskAttachedFileFromId(Long id) {
        if (id == null) {
            return null;
        }
        TaskAttachedFile taskAttachedFile = new TaskAttachedFile();
        taskAttachedFile.setId(id);
        return taskAttachedFile;
    }
}
