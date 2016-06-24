package kr.wisestone.wms.web.rest;

import kr.wisestone.wms.WmsApp;
import kr.wisestone.wms.domain.TaskAttachedFile;
import kr.wisestone.wms.repository.TaskAttachedFileRepository;
import kr.wisestone.wms.repository.search.TaskAttachedFileSearchRepository;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import static org.hamcrest.Matchers.hasItem;
import org.mockito.MockitoAnnotations;
import org.springframework.boot.test.IntegrationTest;
import org.springframework.boot.test.SpringApplicationConfiguration;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;


/**
 * Test class for the TaskAttachedFileResource REST controller.
 *
 * @see TaskAttachedFileResource
 */
@RunWith(SpringJUnit4ClassRunner.class)
@SpringApplicationConfiguration(classes = WmsApp.class)
@WebAppConfiguration
@IntegrationTest
public class TaskAttachedFileResourceIntTest {


    @Inject
    private TaskAttachedFileRepository taskAttachedFileRepository;

    @Inject
    private TaskAttachedFileSearchRepository taskAttachedFileSearchRepository;

    @Inject
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Inject
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    private MockMvc restTaskAttachedFileMockMvc;

    private TaskAttachedFile taskAttachedFile;

    @PostConstruct
    public void setup() {
        MockitoAnnotations.initMocks(this);
        TaskAttachedFileResource taskAttachedFileResource = new TaskAttachedFileResource();
        ReflectionTestUtils.setField(taskAttachedFileResource, "taskAttachedFileSearchRepository", taskAttachedFileSearchRepository);
        ReflectionTestUtils.setField(taskAttachedFileResource, "taskAttachedFileRepository", taskAttachedFileRepository);
        this.restTaskAttachedFileMockMvc = MockMvcBuilders.standaloneSetup(taskAttachedFileResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setMessageConverters(jacksonMessageConverter).build();
    }

    @Before
    public void initTest() {
        taskAttachedFileSearchRepository.deleteAll();
        taskAttachedFile = new TaskAttachedFile();
    }

    @Test
    @Transactional
    public void createTaskAttachedFile() throws Exception {
        int databaseSizeBeforeCreate = taskAttachedFileRepository.findAll().size();

        // Create the TaskAttachedFile

        restTaskAttachedFileMockMvc.perform(post("/api/task-attached-files")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(taskAttachedFile)))
                .andExpect(status().isCreated());

        // Validate the TaskAttachedFile in the database
        List<TaskAttachedFile> taskAttachedFiles = taskAttachedFileRepository.findAll();
        assertThat(taskAttachedFiles).hasSize(databaseSizeBeforeCreate + 1);
        TaskAttachedFile testTaskAttachedFile = taskAttachedFiles.get(taskAttachedFiles.size() - 1);

        // Validate the TaskAttachedFile in ElasticSearch
        TaskAttachedFile taskAttachedFileEs = taskAttachedFileSearchRepository.findOne(testTaskAttachedFile.getId());
        assertThat(taskAttachedFileEs).isEqualToComparingFieldByField(testTaskAttachedFile);
    }

    @Test
    @Transactional
    public void getAllTaskAttachedFiles() throws Exception {
        // Initialize the database
        taskAttachedFileRepository.saveAndFlush(taskAttachedFile);

        // Get all the taskAttachedFiles
        restTaskAttachedFileMockMvc.perform(get("/api/task-attached-files?sort=id,desc"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.[*].id").value(hasItem(taskAttachedFile.getId().intValue())));
    }

    @Test
    @Transactional
    public void getTaskAttachedFile() throws Exception {
        // Initialize the database
        taskAttachedFileRepository.saveAndFlush(taskAttachedFile);

        // Get the taskAttachedFile
        restTaskAttachedFileMockMvc.perform(get("/api/task-attached-files/{id}", taskAttachedFile.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.id").value(taskAttachedFile.getId().intValue()));
    }

    @Test
    @Transactional
    public void getNonExistingTaskAttachedFile() throws Exception {
        // Get the taskAttachedFile
        restTaskAttachedFileMockMvc.perform(get("/api/task-attached-files/{id}", Long.MAX_VALUE))
                .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateTaskAttachedFile() throws Exception {
        // Initialize the database
        taskAttachedFileRepository.saveAndFlush(taskAttachedFile);
        taskAttachedFileSearchRepository.save(taskAttachedFile);
        int databaseSizeBeforeUpdate = taskAttachedFileRepository.findAll().size();

        // Update the taskAttachedFile
        TaskAttachedFile updatedTaskAttachedFile = new TaskAttachedFile();
        updatedTaskAttachedFile.setId(taskAttachedFile.getId());

        restTaskAttachedFileMockMvc.perform(put("/api/task-attached-files")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(updatedTaskAttachedFile)))
                .andExpect(status().isOk());

        // Validate the TaskAttachedFile in the database
        List<TaskAttachedFile> taskAttachedFiles = taskAttachedFileRepository.findAll();
        assertThat(taskAttachedFiles).hasSize(databaseSizeBeforeUpdate);
        TaskAttachedFile testTaskAttachedFile = taskAttachedFiles.get(taskAttachedFiles.size() - 1);

        // Validate the TaskAttachedFile in ElasticSearch
        TaskAttachedFile taskAttachedFileEs = taskAttachedFileSearchRepository.findOne(testTaskAttachedFile.getId());
        assertThat(taskAttachedFileEs).isEqualToComparingFieldByField(testTaskAttachedFile);
    }

    @Test
    @Transactional
    public void deleteTaskAttachedFile() throws Exception {
        // Initialize the database
        taskAttachedFileRepository.saveAndFlush(taskAttachedFile);
        taskAttachedFileSearchRepository.save(taskAttachedFile);
        int databaseSizeBeforeDelete = taskAttachedFileRepository.findAll().size();

        // Get the taskAttachedFile
        restTaskAttachedFileMockMvc.perform(delete("/api/task-attached-files/{id}", taskAttachedFile.getId())
                .accept(TestUtil.APPLICATION_JSON_UTF8))
                .andExpect(status().isOk());

        // Validate ElasticSearch is empty
        boolean taskAttachedFileExistsInEs = taskAttachedFileSearchRepository.exists(taskAttachedFile.getId());
        assertThat(taskAttachedFileExistsInEs).isFalse();

        // Validate the database is empty
        List<TaskAttachedFile> taskAttachedFiles = taskAttachedFileRepository.findAll();
        assertThat(taskAttachedFiles).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void searchTaskAttachedFile() throws Exception {
        // Initialize the database
        taskAttachedFileRepository.saveAndFlush(taskAttachedFile);
        taskAttachedFileSearchRepository.save(taskAttachedFile);

        // Search the taskAttachedFile
        restTaskAttachedFileMockMvc.perform(get("/api/_search/task-attached-files?query=id:" + taskAttachedFile.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.[*].id").value(hasItem(taskAttachedFile.getId().intValue())));
    }
}
