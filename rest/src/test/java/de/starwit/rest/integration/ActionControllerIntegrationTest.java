package de.starwit.rest.integration;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

import de.starwit.persistence.entity.ActionEntity;
import de.starwit.rest.controller.ActionController;
import de.starwit.service.impl.ActionService;

/**
 * Tests for ActionController
 *
 * <pre>
 * @WebMvcTest also auto-configures MockMvc which offers a powerful way of
 * easy testing MVC controllers without starting a full HTTP server.
 * </pre>
 */
@WebMvcTest(controllers = ActionController.class)
public class ActionControllerIntegrationTest extends AbstractControllerIntegrationTest<ActionEntity> {

    @MockitoBean
    private ActionService actionService;

    private static final String restpath = "/api/actions/";

    @Override
    public Class<ActionEntity> getEntityClass() {
        return ActionEntity.class;
    }

    @Override
    public String getRestPath() {
        return restpath;
    }

    // implement tests here
    @Test
    public void canRetrieveById() throws Exception {

        // ActionEntity entityToTest = readFromFile(data + "action.json");
        // when(appService.findById(0L)).thenReturn(entityToTest);

        // MockHttpServletResponse response = retrieveById(0L);

        // then
        // assertThat(response.getStatus()).isEqualTo(HttpStatus.OK.value());
        // assertThat(response.getContentAsString())
        // .isEqualTo(jsonAppDto.write(dto).getJson());
    }

}
