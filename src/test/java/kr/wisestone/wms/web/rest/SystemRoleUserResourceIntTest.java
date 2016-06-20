package kr.wisestone.wms.web.rest;

import kr.wisestone.wms.WmsApp;
import kr.wisestone.wms.domain.SystemRoleUser;
import kr.wisestone.wms.repository.SystemRoleUserRepository;
import kr.wisestone.wms.service.SystemRoleUserService;
import kr.wisestone.wms.repository.search.SystemRoleUserSearchRepository;

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
 * Test class for the SystemRoleUserResource REST controller.
 *
 * @see SystemRoleUserResource
 */
@RunWith(SpringJUnit4ClassRunner.class)
@SpringApplicationConfiguration(classes = WmsApp.class)
@WebAppConfiguration
@IntegrationTest
public class SystemRoleUserResourceIntTest {


    @Inject
    private SystemRoleUserRepository systemRoleUserRepository;

    @Inject
    private SystemRoleUserService systemRoleUserService;

    @Inject
    private SystemRoleUserSearchRepository systemRoleUserSearchRepository;

    @Inject
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Inject
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    private MockMvc restSystemRoleUserMockMvc;

    private SystemRoleUser systemRoleUser;

    @PostConstruct
    public void setup() {
        MockitoAnnotations.initMocks(this);
        SystemRoleUserResource systemRoleUserResource = new SystemRoleUserResource();
        ReflectionTestUtils.setField(systemRoleUserResource, "systemRoleUserService", systemRoleUserService);
        this.restSystemRoleUserMockMvc = MockMvcBuilders.standaloneSetup(systemRoleUserResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setMessageConverters(jacksonMessageConverter).build();
    }

    @Before
    public void initTest() {
        systemRoleUserSearchRepository.deleteAll();
        systemRoleUser = new SystemRoleUser();
    }

    @Test
    @Transactional
    public void createSystemRoleUser() throws Exception {
        int databaseSizeBeforeCreate = systemRoleUserRepository.findAll().size();

        // Create the SystemRoleUser

        restSystemRoleUserMockMvc.perform(post("/api/system-role-users")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(systemRoleUser)))
                .andExpect(status().isCreated());

        // Validate the SystemRoleUser in the database
        List<SystemRoleUser> systemRoleUsers = systemRoleUserRepository.findAll();
        assertThat(systemRoleUsers).hasSize(databaseSizeBeforeCreate + 1);
        SystemRoleUser testSystemRoleUser = systemRoleUsers.get(systemRoleUsers.size() - 1);

        // Validate the SystemRoleUser in ElasticSearch
        SystemRoleUser systemRoleUserEs = systemRoleUserSearchRepository.findOne(testSystemRoleUser.getId());
        assertThat(systemRoleUserEs).isEqualToComparingFieldByField(testSystemRoleUser);
    }

    @Test
    @Transactional
    public void getAllSystemRoleUsers() throws Exception {
        // Initialize the database
        systemRoleUserRepository.saveAndFlush(systemRoleUser);

        // Get all the systemRoleUsers
        restSystemRoleUserMockMvc.perform(get("/api/system-role-users?sort=id,desc"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.[*].id").value(hasItem(systemRoleUser.getId().intValue())));
    }

    @Test
    @Transactional
    public void getSystemRoleUser() throws Exception {
        // Initialize the database
        systemRoleUserRepository.saveAndFlush(systemRoleUser);

        // Get the systemRoleUser
        restSystemRoleUserMockMvc.perform(get("/api/system-role-users/{id}", systemRoleUser.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.id").value(systemRoleUser.getId().intValue()));
    }

    @Test
    @Transactional
    public void getNonExistingSystemRoleUser() throws Exception {
        // Get the systemRoleUser
        restSystemRoleUserMockMvc.perform(get("/api/system-role-users/{id}", Long.MAX_VALUE))
                .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateSystemRoleUser() throws Exception {
        // Initialize the database
        systemRoleUserService.save(systemRoleUser);

        int databaseSizeBeforeUpdate = systemRoleUserRepository.findAll().size();

        // Update the systemRoleUser
        SystemRoleUser updatedSystemRoleUser = new SystemRoleUser();
        updatedSystemRoleUser.setId(systemRoleUser.getId());

        restSystemRoleUserMockMvc.perform(put("/api/system-role-users")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(updatedSystemRoleUser)))
                .andExpect(status().isOk());

        // Validate the SystemRoleUser in the database
        List<SystemRoleUser> systemRoleUsers = systemRoleUserRepository.findAll();
        assertThat(systemRoleUsers).hasSize(databaseSizeBeforeUpdate);
        SystemRoleUser testSystemRoleUser = systemRoleUsers.get(systemRoleUsers.size() - 1);

        // Validate the SystemRoleUser in ElasticSearch
        SystemRoleUser systemRoleUserEs = systemRoleUserSearchRepository.findOne(testSystemRoleUser.getId());
        assertThat(systemRoleUserEs).isEqualToComparingFieldByField(testSystemRoleUser);
    }

    @Test
    @Transactional
    public void deleteSystemRoleUser() throws Exception {
        // Initialize the database
        systemRoleUserService.save(systemRoleUser);

        int databaseSizeBeforeDelete = systemRoleUserRepository.findAll().size();

        // Get the systemRoleUser
        restSystemRoleUserMockMvc.perform(delete("/api/system-role-users/{id}", systemRoleUser.getId())
                .accept(TestUtil.APPLICATION_JSON_UTF8))
                .andExpect(status().isOk());

        // Validate ElasticSearch is empty
        boolean systemRoleUserExistsInEs = systemRoleUserSearchRepository.exists(systemRoleUser.getId());
        assertThat(systemRoleUserExistsInEs).isFalse();

        // Validate the database is empty
        List<SystemRoleUser> systemRoleUsers = systemRoleUserRepository.findAll();
        assertThat(systemRoleUsers).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void searchSystemRoleUser() throws Exception {
        // Initialize the database
        systemRoleUserService.save(systemRoleUser);

        // Search the systemRoleUser
        restSystemRoleUserMockMvc.perform(get("/api/_search/system-role-users?query=id:" + systemRoleUser.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.[*].id").value(hasItem(systemRoleUser.getId().intValue())));
    }
}
