package de.starwit.service;


import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import com.redis.testcontainers.RedisContainer;

import io.lettuce.core.RedisClient;
import io.lettuce.core.api.StatefulRedisConnection;
import io.lettuce.core.api.sync.RedisCommands;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

@Testcontainers
public class RedisContainerTest {


    @Container
    static RedisContainer redisContainer = new RedisContainer("redis:7.0");

   @Container
    private static RedisContainer container = new RedisContainer(
            RedisContainer.DEFAULT_IMAGE_NAME.withTag(RedisContainer.DEFAULT_TAG));

    @Test
    void testSomethingUsingLettuce() {
        String redisURI = container.getRedisURI();
        RedisClient client = RedisClient.create(redisURI);
        try (StatefulRedisConnection<String, String> connection = client.connect()) {
            RedisCommands<String, String> commands = connection.sync();
            Assertions.assertEquals("PONG", commands.ping());
        }
    }
}
