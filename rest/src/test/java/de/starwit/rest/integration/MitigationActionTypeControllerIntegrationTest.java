package de.starwit.rest.integration;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import de.starwit.persistence.entity.MitigationActionTypeEntity;
import de.starwit.rest.controller.MitigationActionTypeController;
import de.starwit.service.impl.MitigationActionTypeService;

/**
 * Tests for MitigationActionTypeController
 *
 * <pre>
 * @WebMvcTest also auto-configures MockMvc which offers a powerful way of
 * easy testing MVC controllers without starting a full HTTP server.
 * </pre>
 */
@WebMvcTest(controllers = MitigationActionTypeController.class)
public class MitigationActionTypeControllerIntegrationTest extends AbstractControllerIntegrationTest<MitigationActionTypeEntity> {

    @MockBean
    private MitigationActionTypeService mitigationactiontypeService;

   private static final String restpath = "/api/mitigationactiontypes/";

    @Override
    public Class<MitigationActionTypeEntity> getEntityClass() {
        return MitigationActionTypeEntity.class;
    }

    @Override
    public String getRestPath() {
        return restpath;
    }

    //implement tests here
    @Test
    public void canRetrieveById() throws Exception {

//        MitigationActionTypeEntity entityToTest = readFromFile(data + "mitigationactiontype.json");
//        when(appService.findById(0L)).thenReturn(entityToTest);

//        MockHttpServletResponse response = retrieveById(0L);

        // then
//        assertThat(response.getStatus()).isEqualTo(HttpStatus.OK.value());
//        assertThat(response.getContentAsString())
//                .isEqualTo(jsonAppDto.write(dto).getJson());
    }

}
