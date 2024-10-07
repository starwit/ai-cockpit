package de.starwit.service;


import org.testcontainers.containers.GenericContainer;
import org.testcontainers.utility.DockerImageName;

import static org.assertj.core.api.Assertions.assertThat;

import org.aspectj.lang.annotation.Before;
import org.junit.Rule;
import org.junit.jupiter.api.Test;

public class RedisBackedCacheIntTest {

    private RedisBackedCache underTest;

    // rule {
    @Rule
    public GenericContainer redis = new GenericContainer(DockerImageName.parse("redis:6-alpine"))
        .withExposedPorts(6379);

    // }

    @Before(value = "")
    public void setUp() {
        String address = redis.getHost();
        Integer port = redis.getFirstMappedPort();

        // Now we have an address and port for Redis, no matter where it is running
        underTest = new RedisBackedCache(address, port);
    }

    @Test
    public void testSimplePutAndGet() {
        underTest.put("test", "example");

        String retrieved = underTest.get("test");
        assertThat(retrieved).isEqualTo("example");
    }
}
