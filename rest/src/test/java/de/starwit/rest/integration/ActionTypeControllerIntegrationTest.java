package de.starwit.rest.integration;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import de.starwit.persistence.entity.ActionTypeEntity;
import de.starwit.rest.controller.ActionTypeController;
import de.starwit.service.impl.ActionTypeService;

/**
 * Tests for ActionTypeController
 *
 * <pre>
 * @WebMvcTest also auto-configures MockMvc which offers a powerful way of
 * easy testing MVC controllers without starting a full HTTP server.
 * </pre>
 */
@WebMvcTest(controllers = ActionTypeController.class)
public class ActionTypeControllerIntegrationTest extends AbstractControllerIntegrationTest<ActionTypeEntity> {

    @MockBean
    private ActionTypeService actiontypeService;

    private static final String restpath = "/api/actiontypes/";

    @Override
    public Class<ActionTypeEntity> getEntityClass() {
        return ActionTypeEntity.class;
    }

    @Override
    public String getRestPath() {
        return restpath;
    }

    // implement tests here
    @Test
    public void canRetrieveById() throws Exception {

        // ActionTypeEntity entityToTest = readFromFile(data +
        // "actiontype.json");
        // when(appService.findById(0L)).thenReturn(entityToTest);

        // MockHttpServletResponse response = retrieveById(0L);

        // then
        // assertThat(response.getStatus()).isEqualTo(HttpStatus.OK.value());
        // assertThat(response.getContentAsString())
        // .isEqualTo(jsonAppDto.write(dto).getJson());
    }

}
