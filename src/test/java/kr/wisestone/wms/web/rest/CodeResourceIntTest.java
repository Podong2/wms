package kr.wisestone.wms.web.rest;

import kr.wisestone.wms.WmsApp;
import kr.wisestone.wms.domain.Code;
import kr.wisestone.wms.repository.CodeRepository;
import kr.wisestone.wms.repository.search.CodeSearchRepository;
import kr.wisestone.wms.web.rest.dto.CodeDTO;
import kr.wisestone.wms.web.rest.mapper.CodeMapper;

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
 * Test class for the CodeResource REST controller.
 *
 * @see CodeResource
 */
@RunWith(SpringJUnit4ClassRunner.class)
@SpringApplicationConfiguration(classes = WmsApp.class)
@WebAppConfiguration
@IntegrationTest
public class CodeResourceIntTest {

    private static final String DEFAULT_NAME = "AAAAA";
    private static final String UPDATED_NAME = "BBBBB";

    private static final Boolean DEFAULT_DEFAULT_YN = false;
    private static final Boolean UPDATED_DEFAULT_YN = true;

    private static final Integer DEFAULT_POSITION = 1;
    private static final Integer UPDATED_POSITION = 2;
    private static final String DEFAULT_COLOR = "AAAAA";
    private static final String UPDATED_COLOR = "BBBBB";
    private static final String DEFAULT_CODE_TYPE = "AAAAA";
    private static final String UPDATED_CODE_TYPE = "BBBBB";

    @Inject
    private CodeRepository codeRepository;

    @Inject
    private CodeMapper codeMapper;

    @Inject
    private CodeSearchRepository codeSearchRepository;

    @Inject
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Inject
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    private MockMvc restCodeMockMvc;

    private Code code;

    @PostConstruct
    public void setup() {
        MockitoAnnotations.initMocks(this);
        CodeResource codeResource = new CodeResource();
        ReflectionTestUtils.setField(codeResource, "codeSearchRepository", codeSearchRepository);
        ReflectionTestUtils.setField(codeResource, "codeRepository", codeRepository);
        ReflectionTestUtils.setField(codeResource, "codeMapper", codeMapper);
        this.restCodeMockMvc = MockMvcBuilders.standaloneSetup(codeResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setMessageConverters(jacksonMessageConverter).build();
    }

    @Before
    public void initTest() {
        codeSearchRepository.deleteAll();
        code = new Code();
        code.setName(DEFAULT_NAME);
        code.setDefaultYn(DEFAULT_DEFAULT_YN);
        code.setPosition(DEFAULT_POSITION);
        code.setColor(DEFAULT_COLOR);
        code.setCodeType(DEFAULT_CODE_TYPE);
    }

    @Test
    @Transactional
    public void createCode() throws Exception {
        int databaseSizeBeforeCreate = codeRepository.findAll().size();

        // Create the Code
        CodeDTO codeDTO = codeMapper.codeToCodeDTO(code);

        restCodeMockMvc.perform(post("/api/codes")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(codeDTO)))
                .andExpect(status().isCreated());

        // Validate the Code in the database
        List<Code> codes = codeRepository.findAll();
        assertThat(codes).hasSize(databaseSizeBeforeCreate + 1);
        Code testCode = codes.get(codes.size() - 1);
        assertThat(testCode.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testCode.isDefaultYn()).isEqualTo(DEFAULT_DEFAULT_YN);
        assertThat(testCode.getPosition()).isEqualTo(DEFAULT_POSITION);
        assertThat(testCode.getColor()).isEqualTo(DEFAULT_COLOR);
        assertThat(testCode.getCodeType()).isEqualTo(DEFAULT_CODE_TYPE);

        // Validate the Code in ElasticSearch
        Code codeEs = codeSearchRepository.findOne(testCode.getId());
        assertThat(codeEs).isEqualToComparingFieldByField(testCode);
    }

    @Test
    @Transactional
    public void getAllCodes() throws Exception {
        // Initialize the database
        codeRepository.saveAndFlush(code);

        // Get all the codes
        restCodeMockMvc.perform(get("/api/codes?sort=id,desc"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.[*].id").value(hasItem(code.getId().intValue())))
                .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())))
                .andExpect(jsonPath("$.[*].defaultYn").value(hasItem(DEFAULT_DEFAULT_YN.booleanValue())))
                .andExpect(jsonPath("$.[*].position").value(hasItem(DEFAULT_POSITION)))
                .andExpect(jsonPath("$.[*].color").value(hasItem(DEFAULT_COLOR.toString())))
                .andExpect(jsonPath("$.[*].codeType").value(hasItem(DEFAULT_CODE_TYPE.toString())));
    }

    @Test
    @Transactional
    public void getCode() throws Exception {
        // Initialize the database
        codeRepository.saveAndFlush(code);

        // Get the code
        restCodeMockMvc.perform(get("/api/codes/{id}", code.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.id").value(code.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME.toString()))
            .andExpect(jsonPath("$.defaultYn").value(DEFAULT_DEFAULT_YN.booleanValue()))
            .andExpect(jsonPath("$.position").value(DEFAULT_POSITION))
            .andExpect(jsonPath("$.color").value(DEFAULT_COLOR.toString()))
            .andExpect(jsonPath("$.codeType").value(DEFAULT_CODE_TYPE.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingCode() throws Exception {
        // Get the code
        restCodeMockMvc.perform(get("/api/codes/{id}", Long.MAX_VALUE))
                .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateCode() throws Exception {
        // Initialize the database
        codeRepository.saveAndFlush(code);
        codeSearchRepository.save(code);
        int databaseSizeBeforeUpdate = codeRepository.findAll().size();

        // Update the code
        Code updatedCode = new Code();
        updatedCode.setId(code.getId());
        updatedCode.setName(UPDATED_NAME);
        updatedCode.setDefaultYn(UPDATED_DEFAULT_YN);
        updatedCode.setPosition(UPDATED_POSITION);
        updatedCode.setColor(UPDATED_COLOR);
        updatedCode.setCodeType(UPDATED_CODE_TYPE);
        CodeDTO codeDTO = codeMapper.codeToCodeDTO(updatedCode);

        restCodeMockMvc.perform(put("/api/codes")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(codeDTO)))
                .andExpect(status().isOk());

        // Validate the Code in the database
        List<Code> codes = codeRepository.findAll();
        assertThat(codes).hasSize(databaseSizeBeforeUpdate);
        Code testCode = codes.get(codes.size() - 1);
        assertThat(testCode.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testCode.isDefaultYn()).isEqualTo(UPDATED_DEFAULT_YN);
        assertThat(testCode.getPosition()).isEqualTo(UPDATED_POSITION);
        assertThat(testCode.getColor()).isEqualTo(UPDATED_COLOR);
        assertThat(testCode.getCodeType()).isEqualTo(UPDATED_CODE_TYPE);

        // Validate the Code in ElasticSearch
        Code codeEs = codeSearchRepository.findOne(testCode.getId());
        assertThat(codeEs).isEqualToComparingFieldByField(testCode);
    }

    @Test
    @Transactional
    public void deleteCode() throws Exception {
        // Initialize the database
        codeRepository.saveAndFlush(code);
        codeSearchRepository.save(code);
        int databaseSizeBeforeDelete = codeRepository.findAll().size();

        // Get the code
        restCodeMockMvc.perform(delete("/api/codes/{id}", code.getId())
                .accept(TestUtil.APPLICATION_JSON_UTF8))
                .andExpect(status().isOk());

        // Validate ElasticSearch is empty
        boolean codeExistsInEs = codeSearchRepository.exists(code.getId());
        assertThat(codeExistsInEs).isFalse();

        // Validate the database is empty
        List<Code> codes = codeRepository.findAll();
        assertThat(codes).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void searchCode() throws Exception {
        // Initialize the database
        codeRepository.saveAndFlush(code);
        codeSearchRepository.save(code);

        // Search the code
        restCodeMockMvc.perform(get("/api/_search/codes?query=id:" + code.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.[*].id").value(hasItem(code.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())))
            .andExpect(jsonPath("$.[*].defaultYn").value(hasItem(DEFAULT_DEFAULT_YN.booleanValue())))
            .andExpect(jsonPath("$.[*].position").value(hasItem(DEFAULT_POSITION)))
            .andExpect(jsonPath("$.[*].color").value(hasItem(DEFAULT_COLOR.toString())))
            .andExpect(jsonPath("$.[*].codeType").value(hasItem(DEFAULT_CODE_TYPE.toString())));
    }
}
