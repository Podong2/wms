package kr.wisestone.wms.web.rest;

import kr.wisestone.wms.WmsApp;
import kr.wisestone.wms.domain.SystemRole;
import kr.wisestone.wms.repository.SystemRoleRepository;
import kr.wisestone.wms.repository.search.SystemRoleSearchRepository;
import kr.wisestone.wms.web.rest.dto.SystemRoleDTO;
import kr.wisestone.wms.web.rest.mapper.SystemRoleMapper;

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
 * Test class for the SystemRoleResource REST controller.
 *
 * @see SystemRoleResource
 */
@RunWith(SpringJUnit4ClassRunner.class)
@SpringApplicationConfiguration(classes = WmsApp.class)
@WebAppConfiguration
@IntegrationTest
public class SystemRoleResourceIntTest {

    private static final String DEFAULT_NAME = "AAAAA";
    private static final String UPDATED_NAME = "BBBBB";
    private static final String DEFAULT_DESCRIPTION = "AAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBB";
    private static final String DEFAULT_ROLE_GUBUN = "AAAAA";
    private static final String UPDATED_ROLE_GUBUN = "BBBBB";

    @Inject
    private SystemRoleRepository systemRoleRepository;

    @Inject
    private SystemRoleMapper systemRoleMapper;

    @Inject
    private SystemRoleSearchRepository systemRoleSearchRepository;

    @Inject
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Inject
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    private MockMvc restSystemRoleMockMvc;

    private SystemRole systemRole;

    @PostConstruct
    public void setup() {
        MockitoAnnotations.initMocks(this);
        SystemRoleResource systemRoleResource = new SystemRoleResource();
        ReflectionTestUtils.setField(systemRoleResource, "systemRoleSearchRepository", systemRoleSearchRepository);
        ReflectionTestUtils.setField(systemRoleResource, "systemRoleRepository", systemRoleRepository);
        ReflectionTestUtils.setField(systemRoleResource, "systemRoleMapper", systemRoleMapper);
        this.restSystemRoleMockMvc = MockMvcBuilders.standaloneSetup(systemRoleResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setMessageConverters(jacksonMessageConverter).build();
    }

    @Before
    public void initTest() {
        systemRoleSearchRepository.deleteAll();
        systemRole = new SystemRole();
        systemRole.setName(DEFAULT_NAME);
        systemRole.setDescription(DEFAULT_DESCRIPTION);
        systemRole.setRoleGubun(DEFAULT_ROLE_GUBUN);
    }

    @Test
    @Transactional
    public void createSystemRole() throws Exception {
        int databaseSizeBeforeCreate = systemRoleRepository.findAll().size();

        // Create the SystemRole
        SystemRoleDTO systemRoleDTO = systemRoleMapper.systemRoleToSystemRoleDTO(systemRole);

        restSystemRoleMockMvc.perform(post("/api/system-roles")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(systemRoleDTO)))
                .andExpect(status().isCreated());

        // Validate the SystemRole in the database
        List<SystemRole> systemRoles = systemRoleRepository.findAll();
        assertThat(systemRoles).hasSize(databaseSizeBeforeCreate + 1);
        SystemRole testSystemRole = systemRoles.get(systemRoles.size() - 1);
        assertThat(testSystemRole.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testSystemRole.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testSystemRole.getRoleGubun()).isEqualTo(DEFAULT_ROLE_GUBUN);

        // Validate the SystemRole in ElasticSearch
        SystemRole systemRoleEs = systemRoleSearchRepository.findOne(testSystemRole.getId());
        assertThat(systemRoleEs).isEqualToComparingFieldByField(testSystemRole);
    }

    @Test
    @Transactional
    public void getAllSystemRoles() throws Exception {
        // Initialize the database
        systemRoleRepository.saveAndFlush(systemRole);

        // Get all the systemRoles
        restSystemRoleMockMvc.perform(get("/api/system-roles?sort=id,desc"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.[*].id").value(hasItem(systemRole.getId().intValue())))
                .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())))
                .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION.toString())))
                .andExpect(jsonPath("$.[*].roleGubun").value(hasItem(DEFAULT_ROLE_GUBUN.toString())));
    }

    @Test
    @Transactional
    public void getSystemRole() throws Exception {
        // Initialize the database
        systemRoleRepository.saveAndFlush(systemRole);

        // Get the systemRole
        restSystemRoleMockMvc.perform(get("/api/system-roles/{id}", systemRole.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.id").value(systemRole.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME.toString()))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION.toString()))
            .andExpect(jsonPath("$.roleGubun").value(DEFAULT_ROLE_GUBUN.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingSystemRole() throws Exception {
        // Get the systemRole
        restSystemRoleMockMvc.perform(get("/api/system-roles/{id}", Long.MAX_VALUE))
                .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateSystemRole() throws Exception {
        // Initialize the database
        systemRoleRepository.saveAndFlush(systemRole);
        systemRoleSearchRepository.save(systemRole);
        int databaseSizeBeforeUpdate = systemRoleRepository.findAll().size();

        // Update the systemRole
        SystemRole updatedSystemRole = new SystemRole();
        updatedSystemRole.setId(systemRole.getId());
        updatedSystemRole.setName(UPDATED_NAME);
        updatedSystemRole.setDescription(UPDATED_DESCRIPTION);
        updatedSystemRole.setRoleGubun(UPDATED_ROLE_GUBUN);
        SystemRoleDTO systemRoleDTO = systemRoleMapper.systemRoleToSystemRoleDTO(updatedSystemRole);

        restSystemRoleMockMvc.perform(put("/api/system-roles")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(systemRoleDTO)))
                .andExpect(status().isOk());

        // Validate the SystemRole in the database
        List<SystemRole> systemRoles = systemRoleRepository.findAll();
        assertThat(systemRoles).hasSize(databaseSizeBeforeUpdate);
        SystemRole testSystemRole = systemRoles.get(systemRoles.size() - 1);
        assertThat(testSystemRole.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testSystemRole.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testSystemRole.getRoleGubun()).isEqualTo(UPDATED_ROLE_GUBUN);

        // Validate the SystemRole in ElasticSearch
        SystemRole systemRoleEs = systemRoleSearchRepository.findOne(testSystemRole.getId());
        assertThat(systemRoleEs).isEqualToComparingFieldByField(testSystemRole);
    }

    @Test
    @Transactional
    public void deleteSystemRole() throws Exception {
        // Initialize the database
        systemRoleRepository.saveAndFlush(systemRole);
        systemRoleSearchRepository.save(systemRole);
        int databaseSizeBeforeDelete = systemRoleRepository.findAll().size();

        // Get the systemRole
        restSystemRoleMockMvc.perform(delete("/api/system-roles/{id}", systemRole.getId())
                .accept(TestUtil.APPLICATION_JSON_UTF8))
                .andExpect(status().isOk());

        // Validate ElasticSearch is empty
        boolean systemRoleExistsInEs = systemRoleSearchRepository.exists(systemRole.getId());
        assertThat(systemRoleExistsInEs).isFalse();

        // Validate the database is empty
        List<SystemRole> systemRoles = systemRoleRepository.findAll();
        assertThat(systemRoles).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void searchSystemRole() throws Exception {
        // Initialize the database
        systemRoleRepository.saveAndFlush(systemRole);
        systemRoleSearchRepository.save(systemRole);

        // Search the systemRole
        restSystemRoleMockMvc.perform(get("/api/_search/system-roles?query=id:" + systemRole.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.[*].id").value(hasItem(systemRole.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION.toString())))
            .andExpect(jsonPath("$.[*].roleGubun").value(hasItem(DEFAULT_ROLE_GUBUN.toString())));
    }
}
