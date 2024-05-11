package de.starwit.rest.integration;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import de.starwit.persistence.entity.TrafficIncidentTypeEntity;
import de.starwit.rest.controller.TrafficIncidentTypeController;
import de.starwit.service.impl.TrafficIncidentTypeService;

/**
 * Tests for TrafficIncidentTypeController
 *
 * <pre>
 * @WebMvcTest also auto-configures MockMvc which offers a powerful way of
 * easy testing MVC controllers without starting a full HTTP server.
 * </pre>
 */
@WebMvcTest(controllers = TrafficIncidentTypeController.class)
public class TrafficIncidentTypeControllerIntegrationTest extends AbstractControllerIntegrationTest<TrafficIncidentTypeEntity> {

    @MockBean
    private TrafficIncidentTypeService trafficincidenttypeService;

    private static final String restpath = "/api/trafficincidenttypes/";

    @Override
    public Class<TrafficIncidentTypeEntity> getEntityClass() {
        return TrafficIncidentTypeEntity.class;
    }

    @Override
    public String getRestPath() {
        return restpath;
    }

    //implement tests here
    @Test
    public void canRetrieveById() throws Exception {

//        TrafficIncidentTypeEntity entityToTest = readFromFile(data + "trafficincidenttype.json");
//        when(appService.findById(0L)).thenReturn(entityToTest);

//        MockHttpServletResponse response = retrieveById(0L);

        // then
//        assertThat(response.getStatus()).isEqualTo(HttpStatus.OK.value());
//        assertThat(response.getContentAsString())
//                .isEqualTo(jsonAppDto.write(dto).getJson());
    }

}
