package kr.wisestone.wms.web.rest;

import kr.wisestone.wms.WmsApp;
import kr.wisestone.wms.domain.MenuPermission;
import kr.wisestone.wms.repository.MenuPermissionRepository;
import kr.wisestone.wms.service.MenuPermissionService;
import kr.wisestone.wms.repository.search.MenuPermissionSearchRepository;

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
 * Test class for the MenuPermissionResource REST controller.
 *
 * @see MenuPermissionResource
 */
@RunWith(SpringJUnit4ClassRunner.class)
@SpringApplicationConfiguration(classes = WmsApp.class)
@WebAppConfiguration
@IntegrationTest
public class MenuPermissionResourceIntTest {


    @Inject
    private MenuPermissionRepository menuPermissionRepository;

    @Inject
    private MenuPermissionService menuPermissionService;

    @Inject
    private MenuPermissionSearchRepository menuPermissionSearchRepository;

    @Inject
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Inject
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    private MockMvc restMenuPermissionMockMvc;

    private MenuPermission menuPermission;

    @PostConstruct
    public void setup() {
        MockitoAnnotations.initMocks(this);
        MenuPermissionResource menuPermissionResource = new MenuPermissionResource();
        ReflectionTestUtils.setField(menuPermissionResource, "menuPermissionService", menuPermissionService);
        this.restMenuPermissionMockMvc = MockMvcBuilders.standaloneSetup(menuPermissionResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setMessageConverters(jacksonMessageConverter).build();
    }

    @Before
    public void initTest() {
        menuPermissionSearchRepository.deleteAll();
        menuPermission = new MenuPermission();
    }

    @Test
    @Transactional
    public void createMenuPermission() throws Exception {
        int databaseSizeBeforeCreate = menuPermissionRepository.findAll().size();

        // Create the MenuPermission

        restMenuPermissionMockMvc.perform(post("/api/menu-permissions")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(menuPermission)))
                .andExpect(status().isCreated());

        // Validate the MenuPermission in the database
        List<MenuPermission> menuPermissions = menuPermissionRepository.findAll();
        assertThat(menuPermissions).hasSize(databaseSizeBeforeCreate + 1);
        MenuPermission testMenuPermission = menuPermissions.get(menuPermissions.size() - 1);

        // Validate the MenuPermission in ElasticSearch
        MenuPermission menuPermissionEs = menuPermissionSearchRepository.findOne(testMenuPermission.getId());
        assertThat(menuPermissionEs).isEqualToComparingFieldByField(testMenuPermission);
    }

    @Test
    @Transactional
    public void getAllMenuPermissions() throws Exception {
        // Initialize the database
        menuPermissionRepository.saveAndFlush(menuPermission);

        // Get all the menuPermissions
        restMenuPermissionMockMvc.perform(get("/api/menu-permissions?sort=id,desc"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.[*].id").value(hasItem(menuPermission.getId().intValue())));
    }

    @Test
    @Transactional
    public void getMenuPermission() throws Exception {
        // Initialize the database
        menuPermissionRepository.saveAndFlush(menuPermission);

        // Get the menuPermission
        restMenuPermissionMockMvc.perform(get("/api/menu-permissions/{id}", menuPermission.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.id").value(menuPermission.getId().intValue()));
    }

    @Test
    @Transactional
    public void getNonExistingMenuPermission() throws Exception {
        // Get the menuPermission
        restMenuPermissionMockMvc.perform(get("/api/menu-permissions/{id}", Long.MAX_VALUE))
                .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateMenuPermission() throws Exception {
        // Initialize the database
        menuPermissionService.save(menuPermission);

        int databaseSizeBeforeUpdate = menuPermissionRepository.findAll().size();

        // Update the menuPermission
        MenuPermission updatedMenuPermission = new MenuPermission();
        updatedMenuPermission.setId(menuPermission.getId());

        restMenuPermissionMockMvc.perform(put("/api/menu-permissions")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(updatedMenuPermission)))
                .andExpect(status().isOk());

        // Validate the MenuPermission in the database
        List<MenuPermission> menuPermissions = menuPermissionRepository.findAll();
        assertThat(menuPermissions).hasSize(databaseSizeBeforeUpdate);
        MenuPermission testMenuPermission = menuPermissions.get(menuPermissions.size() - 1);

        // Validate the MenuPermission in ElasticSearch
        MenuPermission menuPermissionEs = menuPermissionSearchRepository.findOne(testMenuPermission.getId());
        assertThat(menuPermissionEs).isEqualToComparingFieldByField(testMenuPermission);
    }

    @Test
    @Transactional
    public void deleteMenuPermission() throws Exception {
        // Initialize the database
        menuPermissionService.save(menuPermission);

        int databaseSizeBeforeDelete = menuPermissionRepository.findAll().size();

        // Get the menuPermission
        restMenuPermissionMockMvc.perform(delete("/api/menu-permissions/{id}", menuPermission.getId())
                .accept(TestUtil.APPLICATION_JSON_UTF8))
                .andExpect(status().isOk());

        // Validate ElasticSearch is empty
        boolean menuPermissionExistsInEs = menuPermissionSearchRepository.exists(menuPermission.getId());
        assertThat(menuPermissionExistsInEs).isFalse();

        // Validate the database is empty
        List<MenuPermission> menuPermissions = menuPermissionRepository.findAll();
        assertThat(menuPermissions).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void searchMenuPermission() throws Exception {
        // Initialize the database
        menuPermissionService.save(menuPermission);

        // Search the menuPermission
        restMenuPermissionMockMvc.perform(get("/api/_search/menu-permissions?query=id:" + menuPermission.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.[*].id").value(hasItem(menuPermission.getId().intValue())));
    }
}
