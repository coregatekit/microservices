package dev.coregate.product.api.configs;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.sql.SQLException;

import javax.sql.DataSource;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

@DataJpaTest
@ActiveProfiles("test")
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
public class DatabaseConnectionTests {

  @Autowired
  private DataSource dataSource;

  @Test
  void testDatabaseConnection() throws SQLException {
    assertNotNull(dataSource, "DataSource should not be null");

    try (var connection = dataSource.getConnection()) {
      assertTrue(connection.isValid(2), "Connection should be valid");
      assertNotNull(connection.getMetaData(), "Connection metadata should not be null");
    }
  }
}
