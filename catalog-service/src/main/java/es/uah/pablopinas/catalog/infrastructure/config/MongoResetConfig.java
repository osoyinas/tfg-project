package es.uah.pablopinas.catalog.infrastructure.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.data.mongodb.core.MongoTemplate;

@Profile("dev")
@Configuration
@Slf4j
public class MongoResetConfig {

    @Bean
    public ApplicationRunner dropMongoDatabaseOnStartup(MongoTemplate mongoTemplate) {
        return args -> {
            String dbName = mongoTemplate.getDb().getName();
            log.warn("⚠️  Dropping MongoDB database on startup: {}", dbName);
            mongoTemplate.getDb().drop();
        };
    }
}

