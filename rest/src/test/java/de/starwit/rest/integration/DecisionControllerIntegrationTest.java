package de.starwit.rest.integration;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

import de.starwit.persistence.entity.DecisionEntity;
import de.starwit.rest.controller.DecisionController;
import de.starwit.service.impl.DecisionService;

/**
 * Tests for DecisionController
 *
 * <pre>
 * @WebMvcTest also auto-configures MockMvc which offers a powerful way of
 * easy testing MVC controllers without starting a full HTTP server.
 * </pre>
 */
@WebMvcTest(controllers = DecisionController.class)
public class DecisionControllerIntegrationTest extends AbstractControllerIntegrationTest<DecisionEntity> {

    @MockitoBean
    private DecisionService decisionService;

    private static final String restpath = "/api/decisions/";

    @Override
    public Class<DecisionEntity> getEntityClass() {
        return DecisionEntity.class;
    }

    @Override
    public String getRestPath() {
        return restpath;
    }

    // implement tests here
    @Test
    public void canRetrieveById() throws Exception {

        // DecisionEntity entityToTest = readFromFile(data + "decision.json");
        // when(appService.findById(0L)).thenReturn(entityToTest);

        // MockHttpServletResponse response = retrieveById(0L);

        // then
        // assertThat(response.getStatus()).isEqualTo(HttpStatus.OK.value());
        // assertThat(response.getContentAsString())
        // .isEqualTo(jsonAppDto.write(dto).getJson());
    }

}
