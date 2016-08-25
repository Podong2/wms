package kr.wisestone.wms.service;

import kr.wisestone.wms.web.rest.dto.TaskDTO;
import kr.wisestone.wms.web.rest.dto.TaskListWidgetDTO;
import org.springframework.stereotype.Service;

import javax.inject.Inject;
import java.util.List;

@Service
public class WidgetService {

    private static final String LIST_TYPE_TODAY = "TODAY";
    private static final String LIST_TYPE_TOMORROW = "TOMORROW";
    private static final String LIST_TYPE_THIS_WEEK = "THIS_WEEK";
    private static final String LIST_TYPE_SCHEDULED = "SCHEDULED";

    @Inject
    private ProjectService projectService;

    @Inject
    private TaskService taskService;

    public TaskListWidgetDTO getTaskListWidgetData(String listType) {




        return null;
    }

    public List<TaskDTO> getMyTaskList() {




        return null;
    }
}
