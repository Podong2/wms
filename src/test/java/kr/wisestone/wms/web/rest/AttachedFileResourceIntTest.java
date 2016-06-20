package kr.wisestone.wms.web.rest;

import kr.wisestone.wms.WmsApp;
import kr.wisestone.wms.domain.Menu;
import kr.wisestone.wms.repository.AttachedFileRepository;
import kr.wisestone.wms.service.AttachedFileService;
import kr.wisestone.wms.web.rest.dto.MenuDTO;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.MockitoAnnotations;
import org.springframework.boot.test.IntegrationTest;
import org.springframework.boot.test.SpringApplicationConfiguration;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import java.io.File;
import java.io.FileInputStream;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;


/**
 * Test class for the AttachedFileResource REST controller.
 *
 * @see AttachedFileResource
 */
@RunWith(SpringJUnit4ClassRunner.class)
@SpringApplicationConfiguration(classes = WmsApp.class)
@WebAppConfiguration
@IntegrationTest
public class AttachedFileResourceIntTest {

    @Inject
    private AttachedFileRepository attachedFileRepository;

    @Inject
    private AttachedFileService attachedFileService;

    @Inject
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Inject
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    private MockMvc restAttachedFileMockMvc;

    @PostConstruct
    public void setup() {
        MockitoAnnotations.initMocks(this);
        AttachedFileResource attachedFileResource = new AttachedFileResource();
        ReflectionTestUtils.setField(attachedFileResource, "attachedFileRepository", attachedFileRepository);
        ReflectionTestUtils.setField(attachedFileResource, "attachedFileService", attachedFileService);
        this.restAttachedFileMockMvc = MockMvcBuilders.standaloneSetup(attachedFileResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setMessageConverters(jacksonMessageConverter).build();
    }

    @Test
    @Transactional
    public void createAttachedFile() throws Exception {
        int databaseSizeBeforeCreate = attachedFileRepository.findAll().size();

        File file = new File("C:\\Users\\Public\\Pictures\\Sample Pictures\\Lighthouse.jpg");
        FileInputStream fileInputStream = new FileInputStream(file);
        MockMultipartFile mockMultipartFile = new MockMultipartFile("files", file.getName(), "multipart/form-data", fileInputStream);

        // Create the Menu
        restAttachedFileMockMvc.perform(MockMvcRequestBuilders.fileUpload("/api/attachedFile")
                .file(mockMultipartFile)
                .contentType(TestUtil.APPLICATION_JSON_UTF8))
                .andExpect(status().isOk());
    }

    @Test
    @Transactional
    public void getAttachedFile() throws Exception {

//        MvcResult result = restAttachedFileMockMvc.perform(get("/api/attachedFile/{id}", 13L))
//            .andExpect(status().isOk())
//            .andExpect()
//            .andExpect(jsonPath("$.id").value(13))
//            .andExpect(jsonPath("$.name").value("Lighthouse.jpg")).andReturn();
    }

    @Test
    @Transactional
    public void deleteAttachedFile() throws Exception {

        restAttachedFileMockMvc.perform(delete("/api/attachedFile/{id}", 13L))
            .andExpect(status().isOk());
    }
}
