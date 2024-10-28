package de.starwit.service;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import com.redis.testcontainers.RedisContainer;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

@Testcontainers
public class AnomalyMessageListenerTest {
    
    @Autowired
    AnomalyMessageListener anomalyMessageListener;

    @Test
    void onMessageTest(){
        
    }
}
