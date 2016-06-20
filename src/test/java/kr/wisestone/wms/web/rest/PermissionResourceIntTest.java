package kr.wisestone.wms.web.rest;

import kr.wisestone.wms.WmsApp;
import kr.wisestone.wms.domain.Permission;
import kr.wisestone.wms.repository.PermissionRepository;
import kr.wisestone.wms.service.PermissionService;
import kr.wisestone.wms.repository.search.PermissionSearchRepository;
import kr.wisestone.wms.web.rest.dto.PermissionDTO;
import kr.wisestone.wms.web.rest.mapper.PermissionMapper;

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
 * Test class for the PermissionResource REST controller.
 *
 * @see PermissionResource
 */
@RunWith(SpringJUnit4ClassRunner.class)
@SpringApplicationConfiguration(classes = WmsApp.class)
@WebAppConfiguration
@IntegrationTest
public class PermissionResourceIntTest {

    private static final String DEFAULT_NAME = "AAAAA";
    private static final String UPDATED_NAME = "BBBBB";
    private static final String DEFAULT_DESCRIPTION = "AAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBB";
    private static final String DEFAULT_STATUS = "AAAAA";
    private static final String UPDATED_STATUS = "BBBBB";
    private static final String DEFAULT_ACTION = "AAAAA";
    private static final String UPDATED_ACTION = "BBBBB";
    private static final String DEFAULT_ROLE_GUBUN = "AAAAA";
    private static final String UPDATED_ROLE_GUBUN = "BBBBB";

    private static final Boolean DEFAULT_ROLE_PERMISSION_YN = false;
    private static final Boolean UPDATED_ROLE_PERMISSION_YN = true;

    @Inject
    private PermissionRepository permissionRepository;

    @Inject
    private PermissionMapper permissionMapper;

    @Inject
    private PermissionService permissionService;

    @Inject
    private PermissionSearchRepository permissionSearchRepository;

    @Inject
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Inject
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    private MockMvc restPermissionMockMvc;

    private Permission permission;

    @PostConstruct
    public void setup() {
        MockitoAnnotations.initMocks(this);
        PermissionResource permissionResource = new PermissionResource();
        ReflectionTestUtils.setField(permissionResource, "permissionService", permissionService);
        ReflectionTestUtils.setField(permissionResource, "permissionMapper", permissionMapper);
        this.restPermissionMockMvc = MockMvcBuilders.standaloneSetup(permissionResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setMessageConverters(jacksonMessageConverter).build();
    }

    @Before
    public void initTest() {
        permissionSearchRepository.deleteAll();
        permission = new Permission();
        permission.setName(DEFAULT_NAME);
        permission.setDescription(DEFAULT_DESCRIPTION);
        permission.setStatus(DEFAULT_STATUS);
        permission.setAction(DEFAULT_ACTION);
        permission.setRoleGubun(DEFAULT_ROLE_GUBUN);
        permission.setRolePermissionYn(DEFAULT_ROLE_PERMISSION_YN);
    }

    @Test
    @Transactional
    public void createPermission() throws Exception {
        int databaseSizeBeforeCreate = permissionRepository.findAll().size();

        // Create the Permission
        PermissionDTO permissionDTO = permissionMapper.permissionToPermissionDTO(permission);

        restPermissionMockMvc.perform(post("/api/permissions")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(permissionDTO)))
                .andExpect(status().isCreated());

        // Validate the Permission in the database
        List<Permission> permissions = permissionRepository.findAll();
        assertThat(permissions).hasSize(databaseSizeBeforeCreate + 1);
        Permission testPermission = permissions.get(permissions.size() - 1);
        assertThat(testPermission.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testPermission.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testPermission.getStatus()).isEqualTo(DEFAULT_STATUS);
        assertThat(testPermission.getAction()).isEqualTo(DEFAULT_ACTION);
        assertThat(testPermission.getRoleGubun()).isEqualTo(DEFAULT_ROLE_GUBUN);
        assertThat(testPermission.isRolePermissionYn()).isEqualTo(DEFAULT_ROLE_PERMISSION_YN);

        // Validate the Permission in ElasticSearch
        Permission permissionEs = permissionSearchRepository.findOne(testPermission.getId());
        assertThat(permissionEs).isEqualToComparingFieldByField(testPermission);
    }

    @Test
    @Transactional
    public void getAllPermissions() throws Exception {
        // Initialize the database
        permissionRepository.saveAndFlush(permission);

        // Get all the permissions
        restPermissionMockMvc.perform(get("/api/permissions?sort=id,desc"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.[*].id").value(hasItem(permission.getId().intValue())))
                .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())))
                .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION.toString())))
                .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS.toString())))
                .andExpect(jsonPath("$.[*].action").value(hasItem(DEFAULT_ACTION.toString())))
                .andExpect(jsonPath("$.[*].roleGubun").value(hasItem(DEFAULT_ROLE_GUBUN.toString())))
                .andExpect(jsonPath("$.[*].rolePermissionYn").value(hasItem(DEFAULT_ROLE_PERMISSION_YN.booleanValue())));
    }

    @Test
    @Transactional
    public void getPermission() throws Exception {
        // Initialize the database
        permissionRepository.saveAndFlush(permission);

        // Get the permission
        restPermissionMockMvc.perform(get("/api/permissions/{id}", permission.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.id").value(permission.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME.toString()))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION.toString()))
            .andExpect(jsonPath("$.status").value(DEFAULT_STATUS.toString()))
            .andExpect(jsonPath("$.action").value(DEFAULT_ACTION.toString()))
            .andExpect(jsonPath("$.roleGubun").value(DEFAULT_ROLE_GUBUN.toString()))
            .andExpect(jsonPath("$.rolePermissionYn").value(DEFAULT_ROLE_PERMISSION_YN.booleanValue()));
    }

    @Test
    @Transactional
    public void getNonExistingPermission() throws Exception {
        // Get the permission
        restPermissionMockMvc.perform(get("/api/permissions/{id}", Long.MAX_VALUE))
                .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updatePermission() throws Exception {
        // Initialize the database
        permissionRepository.saveAndFlush(permission);
        permissionSearchRepository.save(permission);
        int databaseSizeBeforeUpdate = permissionRepository.findAll().size();

        // Update the permission
        Permission updatedPermission = new Permission();
        updatedPermission.setId(permission.getId());
        updatedPermission.setName(UPDATED_NAME);
        updatedPermission.setDescription(UPDATED_DESCRIPTION);
        updatedPermission.setStatus(UPDATED_STATUS);
        updatedPermission.setAction(UPDATED_ACTION);
        updatedPermission.setRoleGubun(UPDATED_ROLE_GUBUN);
        updatedPermission.setRolePermissionYn(UPDATED_ROLE_PERMISSION_YN);
        PermissionDTO permissionDTO = permissionMapper.permissionToPermissionDTO(updatedPermission);

        restPermissionMockMvc.perform(put("/api/permissions")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(permissionDTO)))
                .andExpect(status().isOk());

        // Validate the Permission in the database
        List<Permission> permissions = permissionRepository.findAll();
        assertThat(permissions).hasSize(databaseSizeBeforeUpdate);
        Permission testPermission = permissions.get(permissions.size() - 1);
        assertThat(testPermission.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testPermission.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testPermission.getStatus()).isEqualTo(UPDATED_STATUS);
        assertThat(testPermission.getAction()).isEqualTo(UPDATED_ACTION);
        assertThat(testPermission.getRoleGubun()).isEqualTo(UPDATED_ROLE_GUBUN);
        assertThat(testPermission.isRolePermissionYn()).isEqualTo(UPDATED_ROLE_PERMISSION_YN);

        // Validate the Permission in ElasticSearch
        Permission permissionEs = permissionSearchRepository.findOne(testPermission.getId());
        assertThat(permissionEs).isEqualToComparingFieldByField(testPermission);
    }

    @Test
    @Transactional
    public void deletePermission() throws Exception {
        // Initialize the database
        permissionRepository.saveAndFlush(permission);
        permissionSearchRepository.save(permission);
        int databaseSizeBeforeDelete = permissionRepository.findAll().size();

        // Get the permission
        restPermissionMockMvc.perform(delete("/api/permissions/{id}", permission.getId())
                .accept(TestUtil.APPLICATION_JSON_UTF8))
                .andExpect(status().isOk());

        // Validate ElasticSearch is empty
        boolean permissionExistsInEs = permissionSearchRepository.exists(permission.getId());
        assertThat(permissionExistsInEs).isFalse();

        // Validate the database is empty
        List<Permission> permissions = permissionRepository.findAll();
        assertThat(permissions).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void searchPermission() throws Exception {
        // Initialize the database
        permissionRepository.saveAndFlush(permission);
        permissionSearchRepository.save(permission);

        // Search the permission
        restPermissionMockMvc.perform(get("/api/_search/permissions?query=id:" + permission.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.[*].id").value(hasItem(permission.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION.toString())))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS.toString())))
            .andExpect(jsonPath("$.[*].action").value(hasItem(DEFAULT_ACTION.toString())))
            .andExpect(jsonPath("$.[*].roleGubun").value(hasItem(DEFAULT_ROLE_GUBUN.toString())))
            .andExpect(jsonPath("$.[*].rolePermissionYn").value(hasItem(DEFAULT_ROLE_PERMISSION_YN.booleanValue())));
    }
}
