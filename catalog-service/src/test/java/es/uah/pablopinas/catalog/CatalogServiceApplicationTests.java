package es.uah.pablopinas.catalog;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.mongodb.core.MongoTemplate;

@SpringBootTest
class CatalogServiceApplicationTests {

	@Autowired
	private MongoTemplate mongoTemplate;

	@Test
	void contextLoads() {
		boolean exists = mongoTemplate.collectionExists("catalog_items");
		System.out.println("Collection exists: " + exists);
		Assertions.assertTrue(true);
	}

}
