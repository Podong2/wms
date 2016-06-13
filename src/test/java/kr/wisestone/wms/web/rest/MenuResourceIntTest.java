package kr.wisestone.wms.web.rest;

import kr.wisestone.wms.WmsApp;
import kr.wisestone.wms.domain.Menu;
import kr.wisestone.wms.repository.MenuRepository;
import kr.wisestone.wms.repository.search.MenuSearchRepository;
import kr.wisestone.wms.web.rest.dto.MenuDTO;
import kr.wisestone.wms.web.rest.mapper.MenuMapper;

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
 * Test class for the MenuResource REST controller.
 *
 * @see MenuResource
 */
@RunWith(SpringJUnit4ClassRunner.class)
@SpringApplicationConfiguration(classes = WmsApp.class)
@WebAppConfiguration
@IntegrationTest
public class MenuResourceIntTest {

    private static final String DEFAULT_NAME = "AAAAA";
    private static final String UPDATED_NAME = "BBBBB";
    private static final String DEFAULT_DESCRIPTION = "AAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBB";
    private static final String DEFAULT_AREA = "AAAAA";
    private static final String UPDATED_AREA = "BBBBB";

    private static final Integer DEFAULT_POSITION = 1;
    private static final Integer UPDATED_POSITION = 2;
    private static final String DEFAULT_STATUS = "AAAAA";
    private static final String UPDATED_STATUS = "BBBBB";

    private static final Boolean DEFAULT_PROJECT_YN = false;
    private static final Boolean UPDATED_PROJECT_YN = true;

    private static final Boolean DEFAULT_SYSTEM_YN = false;
    private static final Boolean UPDATED_SYSTEM_YN = true;

    private static final Boolean DEFAULT_MOBILE_YN = false;
    private static final Boolean UPDATED_MOBILE_YN = true;

    private static final Boolean DEFAULT_HR_INCLUDE_YN = false;
    private static final Boolean UPDATED_HR_INCLUDE_YN = true;
    private static final String DEFAULT_URL_PATH = "AAAAA";
    private static final String UPDATED_URL_PATH = "BBBBB";

    @Inject
    private MenuRepository menuRepository;

    @Inject
    private MenuMapper menuMapper;

    @Inject
    private MenuSearchRepository menuSearchRepository;

    @Inject
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Inject
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    private MockMvc restMenuMockMvc;

    private Menu menu;

    @PostConstruct
    public void setup() {
        MockitoAnnotations.initMocks(this);
        MenuResource menuResource = new MenuResource();
        ReflectionTestUtils.setField(menuResource, "menuSearchRepository", menuSearchRepository);
        ReflectionTestUtils.setField(menuResource, "menuRepository", menuRepository);
        ReflectionTestUtils.setField(menuResource, "menuMapper", menuMapper);
        this.restMenuMockMvc = MockMvcBuilders.standaloneSetup(menuResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setMessageConverters(jacksonMessageConverter).build();
    }

    @Before
    public void initTest() {
        menuSearchRepository.deleteAll();
        menu = new Menu();
        menu.setName(DEFAULT_NAME);
        menu.setDescription(DEFAULT_DESCRIPTION);
        menu.setArea(DEFAULT_AREA);
        menu.setPosition(DEFAULT_POSITION);
        menu.setStatus(DEFAULT_STATUS);
        menu.setProjectYn(DEFAULT_PROJECT_YN);
        menu.setSystemYn(DEFAULT_SYSTEM_YN);
        menu.setMobileYn(DEFAULT_MOBILE_YN);
        menu.setHrIncludeYn(DEFAULT_HR_INCLUDE_YN);
        menu.setUrlPath(DEFAULT_URL_PATH);
    }

    @Test
    @Transactional
    public void createMenu() throws Exception {
        int databaseSizeBeforeCreate = menuRepository.findAll().size();

        // Create the Menu
        MenuDTO menuDTO = menuMapper.menuToMenuDTO(menu);

        restMenuMockMvc.perform(post("/api/menus")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(menuDTO)))
                .andExpect(status().isCreated());

        // Validate the Menu in the database
        List<Menu> menus = menuRepository.findAll();
        assertThat(menus).hasSize(databaseSizeBeforeCreate + 1);
        Menu testMenu = menus.get(menus.size() - 1);
        assertThat(testMenu.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testMenu.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testMenu.getArea()).isEqualTo(DEFAULT_AREA);
        assertThat(testMenu.getPosition()).isEqualTo(DEFAULT_POSITION);
        assertThat(testMenu.getStatus()).isEqualTo(DEFAULT_STATUS);
        assertThat(testMenu.isProjectYn()).isEqualTo(DEFAULT_PROJECT_YN);
        assertThat(testMenu.isSystemYn()).isEqualTo(DEFAULT_SYSTEM_YN);
        assertThat(testMenu.isMobileYn()).isEqualTo(DEFAULT_MOBILE_YN);
        assertThat(testMenu.isHrIncludeYn()).isEqualTo(DEFAULT_HR_INCLUDE_YN);
        assertThat(testMenu.getUrlPath()).isEqualTo(DEFAULT_URL_PATH);

        // Validate the Menu in ElasticSearch
        Menu menuEs = menuSearchRepository.findOne(testMenu.getId());
        assertThat(menuEs).isEqualToComparingFieldByField(testMenu);
    }

    @Test
    @Transactional
    public void getAllMenus() throws Exception {
        // Initialize the database
        menuRepository.saveAndFlush(menu);

        // Get all the menus
        restMenuMockMvc.perform(get("/api/menus?sort=id,desc"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.[*].id").value(hasItem(menu.getId().intValue())))
                .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())))
                .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION.toString())))
                .andExpect(jsonPath("$.[*].area").value(hasItem(DEFAULT_AREA.toString())))
                .andExpect(jsonPath("$.[*].position").value(hasItem(DEFAULT_POSITION)))
                .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS.toString())))
                .andExpect(jsonPath("$.[*].projectYn").value(hasItem(DEFAULT_PROJECT_YN.booleanValue())))
                .andExpect(jsonPath("$.[*].systemYn").value(hasItem(DEFAULT_SYSTEM_YN.booleanValue())))
                .andExpect(jsonPath("$.[*].mobileYn").value(hasItem(DEFAULT_MOBILE_YN.booleanValue())))
                .andExpect(jsonPath("$.[*].hrIncludeYn").value(hasItem(DEFAULT_HR_INCLUDE_YN.booleanValue())))
                .andExpect(jsonPath("$.[*].urlPath").value(hasItem(DEFAULT_URL_PATH.toString())));
    }

    @Test
    @Transactional
    public void getMenu() throws Exception {
        // Initialize the database
        menuRepository.saveAndFlush(menu);

        // Get the menu
        restMenuMockMvc.perform(get("/api/menus/{id}", menu.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.id").value(menu.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME.toString()))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION.toString()))
            .andExpect(jsonPath("$.area").value(DEFAULT_AREA.toString()))
            .andExpect(jsonPath("$.position").value(DEFAULT_POSITION))
            .andExpect(jsonPath("$.status").value(DEFAULT_STATUS.toString()))
            .andExpect(jsonPath("$.projectYn").value(DEFAULT_PROJECT_YN.booleanValue()))
            .andExpect(jsonPath("$.systemYn").value(DEFAULT_SYSTEM_YN.booleanValue()))
            .andExpect(jsonPath("$.mobileYn").value(DEFAULT_MOBILE_YN.booleanValue()))
            .andExpect(jsonPath("$.hrIncludeYn").value(DEFAULT_HR_INCLUDE_YN.booleanValue()))
            .andExpect(jsonPath("$.urlPath").value(DEFAULT_URL_PATH.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingMenu() throws Exception {
        // Get the menu
        restMenuMockMvc.perform(get("/api/menus/{id}", Long.MAX_VALUE))
                .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateMenu() throws Exception {
        // Initialize the database
        menuRepository.saveAndFlush(menu);
        menuSearchRepository.save(menu);
        int databaseSizeBeforeUpdate = menuRepository.findAll().size();

        // Update the menu
        Menu updatedMenu = new Menu();
        updatedMenu.setId(menu.getId());
        updatedMenu.setName(UPDATED_NAME);
        updatedMenu.setDescription(UPDATED_DESCRIPTION);
        updatedMenu.setArea(UPDATED_AREA);
        updatedMenu.setPosition(UPDATED_POSITION);
        updatedMenu.setStatus(UPDATED_STATUS);
        updatedMenu.setProjectYn(UPDATED_PROJECT_YN);
        updatedMenu.setSystemYn(UPDATED_SYSTEM_YN);
        updatedMenu.setMobileYn(UPDATED_MOBILE_YN);
        updatedMenu.setHrIncludeYn(UPDATED_HR_INCLUDE_YN);
        updatedMenu.setUrlPath(UPDATED_URL_PATH);
        MenuDTO menuDTO = menuMapper.menuToMenuDTO(updatedMenu);

        restMenuMockMvc.perform(put("/api/menus")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(menuDTO)))
                .andExpect(status().isOk());

        // Validate the Menu in the database
        List<Menu> menus = menuRepository.findAll();
        assertThat(menus).hasSize(databaseSizeBeforeUpdate);
        Menu testMenu = menus.get(menus.size() - 1);
        assertThat(testMenu.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testMenu.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testMenu.getArea()).isEqualTo(UPDATED_AREA);
        assertThat(testMenu.getPosition()).isEqualTo(UPDATED_POSITION);
        assertThat(testMenu.getStatus()).isEqualTo(UPDATED_STATUS);
        assertThat(testMenu.isProjectYn()).isEqualTo(UPDATED_PROJECT_YN);
        assertThat(testMenu.isSystemYn()).isEqualTo(UPDATED_SYSTEM_YN);
        assertThat(testMenu.isMobileYn()).isEqualTo(UPDATED_MOBILE_YN);
        assertThat(testMenu.isHrIncludeYn()).isEqualTo(UPDATED_HR_INCLUDE_YN);
        assertThat(testMenu.getUrlPath()).isEqualTo(UPDATED_URL_PATH);

        // Validate the Menu in ElasticSearch
        Menu menuEs = menuSearchRepository.findOne(testMenu.getId());
        assertThat(menuEs).isEqualToComparingFieldByField(testMenu);
    }

    @Test
    @Transactional
    public void deleteMenu() throws Exception {
        // Initialize the database
        menuRepository.saveAndFlush(menu);
        menuSearchRepository.save(menu);
        int databaseSizeBeforeDelete = menuRepository.findAll().size();

        // Get the menu
        restMenuMockMvc.perform(delete("/api/menus/{id}", menu.getId())
                .accept(TestUtil.APPLICATION_JSON_UTF8))
                .andExpect(status().isOk());

        // Validate ElasticSearch is empty
        boolean menuExistsInEs = menuSearchRepository.exists(menu.getId());
        assertThat(menuExistsInEs).isFalse();

        // Validate the database is empty
        List<Menu> menus = menuRepository.findAll();
        assertThat(menus).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void searchMenu() throws Exception {
        // Initialize the database
        menuRepository.saveAndFlush(menu);
        menuSearchRepository.save(menu);

        // Search the menu
        restMenuMockMvc.perform(get("/api/_search/menus?query=id:" + menu.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.[*].id").value(hasItem(menu.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION.toString())))
            .andExpect(jsonPath("$.[*].area").value(hasItem(DEFAULT_AREA.toString())))
            .andExpect(jsonPath("$.[*].position").value(hasItem(DEFAULT_POSITION)))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS.toString())))
            .andExpect(jsonPath("$.[*].projectYn").value(hasItem(DEFAULT_PROJECT_YN.booleanValue())))
            .andExpect(jsonPath("$.[*].systemYn").value(hasItem(DEFAULT_SYSTEM_YN.booleanValue())))
            .andExpect(jsonPath("$.[*].mobileYn").value(hasItem(DEFAULT_MOBILE_YN.booleanValue())))
            .andExpect(jsonPath("$.[*].hrIncludeYn").value(hasItem(DEFAULT_HR_INCLUDE_YN.booleanValue())))
            .andExpect(jsonPath("$.[*].urlPath").value(hasItem(DEFAULT_URL_PATH.toString())));
    }
}
