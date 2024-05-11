package de.starwit.rest.integration;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import de.starwit.persistence.entity.MitigationActionEntity;
import de.starwit.rest.controller.MitigationActionController;
import de.starwit.service.impl.MitigationActionService;

/**
 * Tests for MitigationActionController
 *
 * <pre>
 * @WebMvcTest also auto-configures MockMvc which offers a powerful way of
 * easy testing MVC controllers without starting a full HTTP server.
 * </pre>
 */
@WebMvcTest(controllers = MitigationActionController.class)
public class MitigationActionControllerIntegrationTest extends AbstractControllerIntegrationTest<MitigationActionEntity> {

    @MockBean
    private MitigationActionService mitigationactionService;
    private static final String restpath = "/api/mitigationactions/";

    @Override
    public Class<MitigationActionEntity> getEntityClass() {
        return MitigationActionEntity.class;
    }

    @Override
    public String getRestPath() {
        return restpath;
    }

    //implement tests here
    @Test
    public void canRetrieveById() throws Exception {

//        MitigationActionEntity entityToTest = readFromFile(data + "mitigationaction.json");
//        when(appService.findById(0L)).thenReturn(entityToTest);

//        MockHttpServletResponse response = retrieveById(0L);

        // then
//        assertThat(response.getStatus()).isEqualTo(HttpStatus.OK.value());
//        assertThat(response.getContentAsString())
//                .isEqualTo(jsonAppDto.write(dto).getJson());
    }

}
