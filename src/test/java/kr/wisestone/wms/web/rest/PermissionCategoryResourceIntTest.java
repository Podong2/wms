package kr.wisestone.wms.web.rest;

import kr.wisestone.wms.WmsApp;
import kr.wisestone.wms.domain.PermissionCategory;
import kr.wisestone.wms.repository.PermissionCategoryRepository;
import kr.wisestone.wms.repository.search.PermissionCategorySearchRepository;
import kr.wisestone.wms.web.rest.dto.PermissionCategoryDTO;
import kr.wisestone.wms.web.rest.mapper.PermissionCategoryMapper;

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
 * Test class for the PermissionCategoryResource REST controller.
 *
 * @see PermissionCategoryResource
 */
@RunWith(SpringJUnit4ClassRunner.class)
@SpringApplicationConfiguration(classes = WmsApp.class)
@WebAppConfiguration
@IntegrationTest
public class PermissionCategoryResourceIntTest {

    private static final String DEFAULT_NAME = "AAAAA";
    private static final String UPDATED_NAME = "BBBBB";
    private static final String DEFAULT_DESCRIPTION = "AAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBB";

    @Inject
    private PermissionCategoryRepository permissionCategoryRepository;

    @Inject
    private PermissionCategoryMapper permissionCategoryMapper;

    @Inject
    private PermissionCategorySearchRepository permissionCategorySearchRepository;

    @Inject
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Inject
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    private MockMvc restPermissionCategoryMockMvc;

    private PermissionCategory permissionCategory;

    @PostConstruct
    public void setup() {
        MockitoAnnotations.initMocks(this);
        PermissionCategoryResource permissionCategoryResource = new PermissionCategoryResource();
        ReflectionTestUtils.setField(permissionCategoryResource, "permissionCategorySearchRepository", permissionCategorySearchRepository);
        ReflectionTestUtils.setField(permissionCategoryResource, "permissionCategoryRepository", permissionCategoryRepository);
        ReflectionTestUtils.setField(permissionCategoryResource, "permissionCategoryMapper", permissionCategoryMapper);
        this.restPermissionCategoryMockMvc = MockMvcBuilders.standaloneSetup(permissionCategoryResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setMessageConverters(jacksonMessageConverter).build();
    }

    @Before
    public void initTest() {
        permissionCategorySearchRepository.deleteAll();
        permissionCategory = new PermissionCategory();
        permissionCategory.setName(DEFAULT_NAME);
        permissionCategory.setDescription(DEFAULT_DESCRIPTION);
    }

    @Test
    @Transactional
    public void createPermissionCategory() throws Exception {
        int databaseSizeBeforeCreate = permissionCategoryRepository.findAll().size();

        // Create the PermissionCategory
        PermissionCategoryDTO permissionCategoryDTO = permissionCategoryMapper.permissionCategoryToPermissionCategoryDTO(permissionCategory);

        restPermissionCategoryMockMvc.perform(post("/api/permission-categories")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(permissionCategoryDTO)))
                .andExpect(status().isCreated());

        // Validate the PermissionCategory in the database
        List<PermissionCategory> permissionCategories = permissionCategoryRepository.findAll();
        assertThat(permissionCategories).hasSize(databaseSizeBeforeCreate + 1);
        PermissionCategory testPermissionCategory = permissionCategories.get(permissionCategories.size() - 1);
        assertThat(testPermissionCategory.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testPermissionCategory.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);

        // Validate the PermissionCategory in ElasticSearch
        PermissionCategory permissionCategoryEs = permissionCategorySearchRepository.findOne(testPermissionCategory.getId());
        assertThat(permissionCategoryEs).isEqualToComparingFieldByField(testPermissionCategory);
    }

    @Test
    @Transactional
    public void getAllPermissionCategories() throws Exception {
        // Initialize the database
        permissionCategoryRepository.saveAndFlush(permissionCategory);

        // Get all the permissionCategories
        restPermissionCategoryMockMvc.perform(get("/api/permission-categories?sort=id,desc"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.[*].id").value(hasItem(permissionCategory.getId().intValue())))
                .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())))
                .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION.toString())));
    }

    @Test
    @Transactional
    public void getPermissionCategory() throws Exception {
        // Initialize the database
        permissionCategoryRepository.saveAndFlush(permissionCategory);

        // Get the permissionCategory
        restPermissionCategoryMockMvc.perform(get("/api/permission-categories/{id}", permissionCategory.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.id").value(permissionCategory.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME.toString()))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingPermissionCategory() throws Exception {
        // Get the permissionCategory
        restPermissionCategoryMockMvc.perform(get("/api/permission-categories/{id}", Long.MAX_VALUE))
                .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updatePermissionCategory() throws Exception {
        // Initialize the database
        permissionCategoryRepository.saveAndFlush(permissionCategory);
        permissionCategorySearchRepository.save(permissionCategory);
        int databaseSizeBeforeUpdate = permissionCategoryRepository.findAll().size();

        // Update the permissionCategory
        PermissionCategory updatedPermissionCategory = new PermissionCategory();
        updatedPermissionCategory.setId(permissionCategory.getId());
        updatedPermissionCategory.setName(UPDATED_NAME);
        updatedPermissionCategory.setDescription(UPDATED_DESCRIPTION);
        PermissionCategoryDTO permissionCategoryDTO = permissionCategoryMapper.permissionCategoryToPermissionCategoryDTO(updatedPermissionCategory);

        restPermissionCategoryMockMvc.perform(put("/api/permission-categories")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(permissionCategoryDTO)))
                .andExpect(status().isOk());

        // Validate the PermissionCategory in the database
        List<PermissionCategory> permissionCategories = permissionCategoryRepository.findAll();
        assertThat(permissionCategories).hasSize(databaseSizeBeforeUpdate);
        PermissionCategory testPermissionCategory = permissionCategories.get(permissionCategories.size() - 1);
        assertThat(testPermissionCategory.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testPermissionCategory.getDescription()).isEqualTo(UPDATED_DESCRIPTION);

        // Validate the PermissionCategory in ElasticSearch
        PermissionCategory permissionCategoryEs = permissionCategorySearchRepository.findOne(testPermissionCategory.getId());
        assertThat(permissionCategoryEs).isEqualToComparingFieldByField(testPermissionCategory);
    }

    @Test
    @Transactional
    public void deletePermissionCategory() throws Exception {
        // Initialize the database
        permissionCategoryRepository.saveAndFlush(permissionCategory);
        permissionCategorySearchRepository.save(permissionCategory);
        int databaseSizeBeforeDelete = permissionCategoryRepository.findAll().size();

        // Get the permissionCategory
        restPermissionCategoryMockMvc.perform(delete("/api/permission-categories/{id}", permissionCategory.getId())
                .accept(TestUtil.APPLICATION_JSON_UTF8))
                .andExpect(status().isOk());

        // Validate ElasticSearch is empty
        boolean permissionCategoryExistsInEs = permissionCategorySearchRepository.exists(permissionCategory.getId());
        assertThat(permissionCategoryExistsInEs).isFalse();

        // Validate the database is empty
        List<PermissionCategory> permissionCategories = permissionCategoryRepository.findAll();
        assertThat(permissionCategories).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void searchPermissionCategory() throws Exception {
        // Initialize the database
        permissionCategoryRepository.saveAndFlush(permissionCategory);
        permissionCategorySearchRepository.save(permissionCategory);

        // Search the permissionCategory
        restPermissionCategoryMockMvc.perform(get("/api/_search/permission-categories?query=id:" + permissionCategory.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.[*].id").value(hasItem(permissionCategory.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION.toString())));
    }
}
