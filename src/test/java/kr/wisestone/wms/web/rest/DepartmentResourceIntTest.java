package kr.wisestone.wms.web.rest;

import kr.wisestone.wms.WmsApp;
import kr.wisestone.wms.domain.Department;
import kr.wisestone.wms.repository.DepartmentRepository;
import kr.wisestone.wms.service.DepartmentService;
import kr.wisestone.wms.repository.search.DepartmentSearchRepository;
import kr.wisestone.wms.web.rest.dto.DepartmentDTO;
import kr.wisestone.wms.web.rest.mapper.DepartmentMapper;

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
 * Test class for the DepartmentResource REST controller.
 *
 * @see DepartmentResource
 */
@RunWith(SpringJUnit4ClassRunner.class)
@SpringApplicationConfiguration(classes = WmsApp.class)
@WebAppConfiguration
@IntegrationTest
public class DepartmentResourceIntTest {

    private static final String DEFAULT_NAME = "AAAAA";
    private static final String UPDATED_NAME = "BBBBB";
    private static final String DEFAULT_DESCRIPTION = "AAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBB";
    private static final String DEFAULT_STATUS = "AAAAA";
    private static final String UPDATED_STATUS = "BBBBB";

    @Inject
    private DepartmentRepository departmentRepository;

    @Inject
    private DepartmentMapper departmentMapper;

    @Inject
    private DepartmentService departmentService;

    @Inject
    private DepartmentSearchRepository departmentSearchRepository;

    @Inject
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Inject
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    private MockMvc restDepartmentMockMvc;

    private Department department;

    @PostConstruct
    public void setup() {
        MockitoAnnotations.initMocks(this);
        DepartmentResource departmentResource = new DepartmentResource();
        ReflectionTestUtils.setField(departmentResource, "departmentService", departmentService);
        ReflectionTestUtils.setField(departmentResource, "departmentMapper", departmentMapper);
        this.restDepartmentMockMvc = MockMvcBuilders.standaloneSetup(departmentResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setMessageConverters(jacksonMessageConverter).build();
    }

    @Before
    public void initTest() {
        departmentSearchRepository.deleteAll();
        department = new Department();
        department.setName(DEFAULT_NAME);
        department.setDescription(DEFAULT_DESCRIPTION);
        department.setStatus(DEFAULT_STATUS);
    }

    @Test
    @Transactional
    public void createDepartment() throws Exception {
        int databaseSizeBeforeCreate = departmentRepository.findAll().size();

        // Create the Department
        DepartmentDTO departmentDTO = departmentMapper.departmentToDepartmentDTO(department);

        restDepartmentMockMvc.perform(post("/api/departments")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(departmentDTO)))
                .andExpect(status().isCreated());

        // Validate the Department in the database
        List<Department> departments = departmentRepository.findAll();
        assertThat(departments).hasSize(databaseSizeBeforeCreate + 1);
        Department testDepartment = departments.get(departments.size() - 1);
        assertThat(testDepartment.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testDepartment.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testDepartment.getStatus()).isEqualTo(DEFAULT_STATUS);

        // Validate the Department in ElasticSearch
        Department departmentEs = departmentSearchRepository.findOne(testDepartment.getId());
        assertThat(departmentEs).isEqualToComparingFieldByField(testDepartment);
    }

    @Test
    @Transactional
    public void getAllDepartments() throws Exception {
        // Initialize the database
        departmentRepository.saveAndFlush(department);

        // Get all the departments
        restDepartmentMockMvc.perform(get("/api/departments?sort=id,desc"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.[*].id").value(hasItem(department.getId().intValue())))
                .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())))
                .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION.toString())))
                .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS.toString())));
    }

    @Test
    @Transactional
    public void getDepartment() throws Exception {
        // Initialize the database
        departmentRepository.saveAndFlush(department);

        // Get the department
        restDepartmentMockMvc.perform(get("/api/departments/{id}", department.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.id").value(department.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME.toString()))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION.toString()))
            .andExpect(jsonPath("$.status").value(DEFAULT_STATUS.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingDepartment() throws Exception {
        // Get the department
        restDepartmentMockMvc.perform(get("/api/departments/{id}", Long.MAX_VALUE))
                .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateDepartment() throws Exception {
        // Initialize the database
        departmentRepository.saveAndFlush(department);
        departmentSearchRepository.save(department);
        int databaseSizeBeforeUpdate = departmentRepository.findAll().size();

        // Update the department
        Department updatedDepartment = new Department();
        updatedDepartment.setId(department.getId());
        updatedDepartment.setName(UPDATED_NAME);
        updatedDepartment.setDescription(UPDATED_DESCRIPTION);
        updatedDepartment.setStatus(UPDATED_STATUS);
        DepartmentDTO departmentDTO = departmentMapper.departmentToDepartmentDTO(updatedDepartment);

        restDepartmentMockMvc.perform(put("/api/departments")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(departmentDTO)))
                .andExpect(status().isOk());

        // Validate the Department in the database
        List<Department> departments = departmentRepository.findAll();
        assertThat(departments).hasSize(databaseSizeBeforeUpdate);
        Department testDepartment = departments.get(departments.size() - 1);
        assertThat(testDepartment.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testDepartment.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testDepartment.getStatus()).isEqualTo(UPDATED_STATUS);

        // Validate the Department in ElasticSearch
        Department departmentEs = departmentSearchRepository.findOne(testDepartment.getId());
        assertThat(departmentEs).isEqualToComparingFieldByField(testDepartment);
    }

    @Test
    @Transactional
    public void deleteDepartment() throws Exception {
        // Initialize the database
        departmentRepository.saveAndFlush(department);
        departmentSearchRepository.save(department);
        int databaseSizeBeforeDelete = departmentRepository.findAll().size();

        // Get the department
        restDepartmentMockMvc.perform(delete("/api/departments/{id}", department.getId())
                .accept(TestUtil.APPLICATION_JSON_UTF8))
                .andExpect(status().isOk());

        // Validate ElasticSearch is empty
        boolean departmentExistsInEs = departmentSearchRepository.exists(department.getId());
        assertThat(departmentExistsInEs).isFalse();

        // Validate the database is empty
        List<Department> departments = departmentRepository.findAll();
        assertThat(departments).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void searchDepartment() throws Exception {
        // Initialize the database
        departmentRepository.saveAndFlush(department);
        departmentSearchRepository.save(department);

        // Search the department
        restDepartmentMockMvc.perform(get("/api/_search/departments?query=id:" + department.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.[*].id").value(hasItem(department.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION.toString())))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS.toString())));
    }
}
