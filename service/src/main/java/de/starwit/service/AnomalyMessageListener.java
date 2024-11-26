package de.starwit.service;

import java.util.Base64;
import java.util.concurrent.atomic.AtomicInteger;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.connection.stream.MapRecord;
import org.springframework.data.redis.stream.StreamListener;
import org.springframework.stereotype.Service;

import com.google.protobuf.InvalidProtocolBufferException;

import de.starwit.service.impl.DecisionService;
import de.starwit.visionapi.Reporting.IncidentMessage;

@Service
public class AnomalyMessageListener implements StreamListener<String, MapRecord<String, String, String>> {

    private Logger log = LoggerFactory.getLogger(this.getClass());
    private AtomicInteger counter = new AtomicInteger();

    @Autowired
    private DecisionService decisionService;

    @Override
    public void onMessage(MapRecord<String, String, String> message) {
        log.info("Decision message received.");
        log.debug(String.format("execute thread: %s %s",
                Thread.currentThread().getName(), Thread.currentThread().threadId()));

        String b64Proto = message.getValue().get("proto_data_b64");
        IncidentMessage decisionMessage;

        try {
            decisionMessage = IncidentMessage.parseFrom(Base64.getDecoder().decode(b64Proto));
            decisionService.createNewDecisionBasedOnIncidentMessage(decisionMessage);
        } catch (InvalidProtocolBufferException e) {
            log.warn("Received invalid proto");
            return;
        }
    }

    public int getCount() {
        return counter.get();
    }

}
