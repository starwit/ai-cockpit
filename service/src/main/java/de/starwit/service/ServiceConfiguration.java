package de.starwit.service;

import java.net.UnknownHostException;
import java.time.Duration;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.connection.RedisStandaloneConfiguration;
import org.springframework.data.redis.connection.lettuce.LettuceClientConfiguration;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.data.redis.connection.lettuce.LettucePoolingClientConfiguration;
import org.springframework.data.redis.connection.stream.MapRecord;
import org.springframework.data.redis.connection.stream.ReadOffset;
import org.springframework.data.redis.connection.stream.StreamOffset;
import org.springframework.data.redis.stream.StreamMessageListenerContainer;
import org.springframework.data.redis.stream.Subscription;

import io.lettuce.core.ClientOptions;
import io.lettuce.core.ClientOptions.DisconnectedBehavior;

@SpringBootApplication
@ComponentScan(basePackages = "de.starwit.persistence")
public class ServiceConfiguration {

    @Value("${spring.data.redis.host:localhost}")
    private String redisHost;

    @Value("${spring.data.redis.port:6379}")
    private int redisPort;

    @Value("${spring.data.redis.stream.ids}")
    private String[] streamIds;

    @Value("${spring.data.stream.prefix:reportingaicockpit}")
    private String redisStreamPrefix;

    @Bean
    StreamMessageListenerContainer<String, MapRecord<String, String, String>> streamMessageListenerContainer() {
        return StreamMessageListenerContainer.create(lettuceConnectionFactory());
    }

    @Bean
    LettuceConnectionFactory lettuceConnectionFactory() {

        RedisStandaloneConfiguration redisConfig = new RedisStandaloneConfiguration(redisHost, redisPort);
        ClientOptions options = ClientOptions.builder().autoReconnect(true)
                .disconnectedBehavior(DisconnectedBehavior.REJECT_COMMANDS).build();
        LettuceClientConfiguration clientConfig = LettucePoolingClientConfiguration.builder().clientOptions(options)
                .commandTimeout(Duration.ofDays(9999))
                .build();
        LettuceConnectionFactory factory = new LettuceConnectionFactory(redisConfig,
                clientConfig);
        factory.setShareNativeConnection(false);
        return factory;
    }

    @Bean
    AnomalyMessageListener anomalyMessageListener() {
        return new AnomalyMessageListener();
    }

    @Bean
    public List<Subscription> subscription(RedisConnectionFactory redisConnectionFactory) throws UnknownHostException {
        List<Subscription> subscriptions = new ArrayList<>();
        for (String stream : streamIds) {
            StreamOffset<String> streamOffset = StreamOffset.create(redisStreamPrefix + ":" + stream,
                    ReadOffset.lastConsumed());
            Subscription subscription = streamMessageListenerContainer().receive(streamOffset,
                    anomalyMessageListener());
            subscriptions.add(subscription);
        }
        streamMessageListenerContainer().start();
        return subscriptions;
    }
}
