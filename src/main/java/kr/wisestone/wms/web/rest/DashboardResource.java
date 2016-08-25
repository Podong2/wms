package kr.wisestone.wms.web.rest;

import com.codahale.metrics.annotation.Timed;
import kr.wisestone.wms.service.DashboardService;
import kr.wisestone.wms.service.WidgetService;
import kr.wisestone.wms.web.rest.condition.WidgetCondition;
import kr.wisestone.wms.web.rest.dto.DashboardDTO;
import kr.wisestone.wms.web.rest.dto.TaskListWidgetDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.inject.Inject;
import java.util.Optional;

@RestController
@RequestMapping("/api")
public class DashboardResource {

    private final Logger log = LoggerFactory.getLogger(DashboardResource.class);

    @Inject
    private WidgetService widgetService;

    @Inject
    private DashboardService dashboardService;

    @RequestMapping(value = "/dashboards/widget/findMyTasks",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<TaskListWidgetDTO> getMyTasks(@ModelAttribute WidgetCondition widgetCondition) {

        TaskListWidgetDTO taskListWidgetDTO = widgetService.getTaskListWidgetData(widgetCondition);

        return Optional.ofNullable(taskListWidgetDTO)
            .map(result -> new ResponseEntity<>(
                result,
                HttpStatus.OK))
            .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @RequestMapping(value = "/dashboards/findUserDashboard",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<DashboardDTO> findUserDashboard() {

        DashboardDTO dashboardDTO = dashboardService.findUserDashboard();

        return Optional.ofNullable(dashboardDTO)
            .map(result -> new ResponseEntity<>(
                result,
                HttpStatus.OK))
            .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }
}
