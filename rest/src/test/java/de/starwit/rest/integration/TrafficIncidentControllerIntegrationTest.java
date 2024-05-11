package de.starwit.rest.integration;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.json.JacksonTester;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.HttpStatus;
import org.springframework.mock.web.MockHttpServletResponse;

import de.starwit.persistence.entity.TrafficIncidentEntity;
import de.starwit.rest.controller.TrafficIncidentController;
import de.starwit.service.impl.TrafficIncidentService;

/**
 * Tests for TrafficIncidentController
 *
 * <pre>
 * @WebMvcTest also auto-configures MockMvc which offers a powerful way of
 * easy testing MVC controllers without starting a full HTTP server.
 * </pre>
 */
@WebMvcTest(controllers = TrafficIncidentController.class)
public class TrafficIncidentControllerIntegrationTest extends AbstractControllerIntegrationTest<TrafficIncidentEntity> {

    @MockBean
    private TrafficIncidentService trafficincidentService;

    private JacksonTester<TrafficIncidentEntity> jsonTrafficIncidentEntity;
    private static final String data = "testdata/trafficincident/";
    private static final String restpath = "/api/trafficincidents/";

    @Override
    public Class<TrafficIncidentEntity> getEntityClass() {
        return TrafficIncidentEntity.class;
    }

    @Override
    public String getRestPath() {
        return restpath;
    }

    //implement tests here
    @Test
    public void canRetrieveById() throws Exception {

//        TrafficIncidentEntity entityToTest = readFromFile(data + "trafficincident.json");
//        when(appService.findById(0L)).thenReturn(entityToTest);

//        MockHttpServletResponse response = retrieveById(0L);

        // then
//        assertThat(response.getStatus()).isEqualTo(HttpStatus.OK.value());
//        assertThat(response.getContentAsString())
//                .isEqualTo(jsonAppDto.write(dto).getJson());
    }

}
