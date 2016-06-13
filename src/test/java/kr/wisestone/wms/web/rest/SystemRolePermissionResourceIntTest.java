package kr.wisestone.wms.web.rest;

import kr.wisestone.wms.WmsApp;
import kr.wisestone.wms.domain.SystemRolePermission;
import kr.wisestone.wms.repository.SystemRolePermissionRepository;
import kr.wisestone.wms.service.SystemRolePermissionService;
import kr.wisestone.wms.repository.search.SystemRolePermissionSearchRepository;

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
 * Test class for the SystemRolePermissionResource REST controller.
 *
 * @see SystemRolePermissionResource
 */
@RunWith(SpringJUnit4ClassRunner.class)
@SpringApplicationConfiguration(classes = WmsApp.class)
@WebAppConfiguration
@IntegrationTest
public class SystemRolePermissionResourceIntTest {


    @Inject
    private SystemRolePermissionRepository systemRolePermissionRepository;

    @Inject
    private SystemRolePermissionService systemRolePermissionService;

    @Inject
    private SystemRolePermissionSearchRepository systemRolePermissionSearchRepository;

    @Inject
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Inject
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    private MockMvc restSystemRolePermissionMockMvc;

    private SystemRolePermission systemRolePermission;

    @PostConstruct
    public void setup() {
        MockitoAnnotations.initMocks(this);
        SystemRolePermissionResource systemRolePermissionResource = new SystemRolePermissionResource();
        ReflectionTestUtils.setField(systemRolePermissionResource, "systemRolePermissionService", systemRolePermissionService);
        this.restSystemRolePermissionMockMvc = MockMvcBuilders.standaloneSetup(systemRolePermissionResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setMessageConverters(jacksonMessageConverter).build();
    }

    @Before
    public void initTest() {
        systemRolePermissionSearchRepository.deleteAll();
        systemRolePermission = new SystemRolePermission();
    }

    @Test
    @Transactional
    public void createSystemRolePermission() throws Exception {
        int databaseSizeBeforeCreate = systemRolePermissionRepository.findAll().size();

        // Create the SystemRolePermission

        restSystemRolePermissionMockMvc.perform(post("/api/system-role-permissions")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(systemRolePermission)))
                .andExpect(status().isCreated());

        // Validate the SystemRolePermission in the database
        List<SystemRolePermission> systemRolePermissions = systemRolePermissionRepository.findAll();
        assertThat(systemRolePermissions).hasSize(databaseSizeBeforeCreate + 1);
        SystemRolePermission testSystemRolePermission = systemRolePermissions.get(systemRolePermissions.size() - 1);

        // Validate the SystemRolePermission in ElasticSearch
        SystemRolePermission systemRolePermissionEs = systemRolePermissionSearchRepository.findOne(testSystemRolePermission.getId());
        assertThat(systemRolePermissionEs).isEqualToComparingFieldByField(testSystemRolePermission);
    }

    @Test
    @Transactional
    public void getAllSystemRolePermissions() throws Exception {
        // Initialize the database
        systemRolePermissionRepository.saveAndFlush(systemRolePermission);

        // Get all the systemRolePermissions
        restSystemRolePermissionMockMvc.perform(get("/api/system-role-permissions?sort=id,desc"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.[*].id").value(hasItem(systemRolePermission.getId().intValue())));
    }

    @Test
    @Transactional
    public void getSystemRolePermission() throws Exception {
        // Initialize the database
        systemRolePermissionRepository.saveAndFlush(systemRolePermission);

        // Get the systemRolePermission
        restSystemRolePermissionMockMvc.perform(get("/api/system-role-permissions/{id}", systemRolePermission.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.id").value(systemRolePermission.getId().intValue()));
    }

    @Test
    @Transactional
    public void getNonExistingSystemRolePermission() throws Exception {
        // Get the systemRolePermission
        restSystemRolePermissionMockMvc.perform(get("/api/system-role-permissions/{id}", Long.MAX_VALUE))
                .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateSystemRolePermission() throws Exception {
        // Initialize the database
        systemRolePermissionService.save(systemRolePermission);

        int databaseSizeBeforeUpdate = systemRolePermissionRepository.findAll().size();

        // Update the systemRolePermission
        SystemRolePermission updatedSystemRolePermission = new SystemRolePermission();
        updatedSystemRolePermission.setId(systemRolePermission.getId());

        restSystemRolePermissionMockMvc.perform(put("/api/system-role-permissions")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(updatedSystemRolePermission)))
                .andExpect(status().isOk());

        // Validate the SystemRolePermission in the database
        List<SystemRolePermission> systemRolePermissions = systemRolePermissionRepository.findAll();
        assertThat(systemRolePermissions).hasSize(databaseSizeBeforeUpdate);
        SystemRolePermission testSystemRolePermission = systemRolePermissions.get(systemRolePermissions.size() - 1);

        // Validate the SystemRolePermission in ElasticSearch
        SystemRolePermission systemRolePermissionEs = systemRolePermissionSearchRepository.findOne(testSystemRolePermission.getId());
        assertThat(systemRolePermissionEs).isEqualToComparingFieldByField(testSystemRolePermission);
    }

    @Test
    @Transactional
    public void deleteSystemRolePermission() throws Exception {
        // Initialize the database
        systemRolePermissionService.save(systemRolePermission);

        int databaseSizeBeforeDelete = systemRolePermissionRepository.findAll().size();

        // Get the systemRolePermission
        restSystemRolePermissionMockMvc.perform(delete("/api/system-role-permissions/{id}", systemRolePermission.getId())
                .accept(TestUtil.APPLICATION_JSON_UTF8))
                .andExpect(status().isOk());

        // Validate ElasticSearch is empty
        boolean systemRolePermissionExistsInEs = systemRolePermissionSearchRepository.exists(systemRolePermission.getId());
        assertThat(systemRolePermissionExistsInEs).isFalse();

        // Validate the database is empty
        List<SystemRolePermission> systemRolePermissions = systemRolePermissionRepository.findAll();
        assertThat(systemRolePermissions).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void searchSystemRolePermission() throws Exception {
        // Initialize the database
        systemRolePermissionService.save(systemRolePermission);

        // Search the systemRolePermission
        restSystemRolePermissionMockMvc.perform(get("/api/_search/system-role-permissions?query=id:" + systemRolePermission.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.[*].id").value(hasItem(systemRolePermission.getId().intValue())));
    }
}
