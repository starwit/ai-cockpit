package de.starwit.rest.integration;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import de.starwit.persistence.entity.DecisionTypeEntity;
import de.starwit.rest.controller.DecisionTypeController;
import de.starwit.service.impl.DecisionTypeService;

/**
 * Tests for DecisionTypeController
 *
 * <pre>
 * @WebMvcTest also auto-configures MockMvc which offers a powerful way of
 * easy testing MVC controllers without starting a full HTTP server.
 * </pre>
 */
@WebMvcTest(controllers = DecisionTypeController.class)
public class DecisionTypeControllerIntegrationTest extends AbstractControllerIntegrationTest<DecisionTypeEntity> {

    @MockBean
    private DecisionTypeService decisiontypeService;

    private static final String restpath = "/api/decisiontypes/";

    @Override
    public Class<DecisionTypeEntity> getEntityClass() {
        return DecisionTypeEntity.class;
    }

    @Override
    public String getRestPath() {
        return restpath;
    }

    // implement tests here
    @Test
    public void canRetrieveById() throws Exception {

        // DecisionTypeEntity entityToTest = readFromFile(data +
        // "decisiontype.json");
        // when(appService.findById(0L)).thenReturn(entityToTest);

        // MockHttpServletResponse response = retrieveById(0L);

        // then
        // assertThat(response.getStatus()).isEqualTo(HttpStatus.OK.value());
        // assertThat(response.getContentAsString())
        // .isEqualTo(jsonAppDto.write(dto).getJson());
    }

}
