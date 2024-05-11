package de.starwit.rest.integration;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import de.starwit.persistence.entity.AutonomyLevelEntity;
import de.starwit.rest.controller.AutonomyLevelController;
import de.starwit.service.impl.AutonomyLevelService;

/**
 * Tests for AutonomyLevelController
 *
 * <pre>
 * @WebMvcTest also auto-configures MockMvc which offers a powerful way of
 * easy testing MVC controllers without starting a full HTTP server.
 * </pre>
 */
@WebMvcTest(controllers = AutonomyLevelController.class)
public class AutonomyLevelControllerIntegrationTest extends AbstractControllerIntegrationTest<AutonomyLevelEntity> {

    @MockBean
    private AutonomyLevelService autonomylevelService;

    private static final String restpath = "/api/autonomylevels/";

    @Override
    public Class<AutonomyLevelEntity> getEntityClass() {
        return AutonomyLevelEntity.class;
    }

    @Override
    public String getRestPath() {
        return restpath;
    }

    //implement tests here
    @Test
    public void canRetrieveById() throws Exception {

//        AutonomyLevelEntity entityToTest = readFromFile(data + "autonomylevel.json");
//        when(appService.findById(0L)).thenReturn(entityToTest);

//        MockHttpServletResponse response = retrieveById(0L);

        // then
//        assertThat(response.getStatus()).isEqualTo(HttpStatus.OK.value());
//        assertThat(response.getContentAsString())
//                .isEqualTo(jsonAppDto.write(dto).getJson());
    }

}
