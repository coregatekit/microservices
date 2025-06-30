package dev.coregate.product.api.controllers;

import java.sql.Connection;
import java.util.HashMap;
import java.util.Map;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HealthController {

  @Autowired
  private DataSource dataSource;

  @GetMapping("/health/db")
  public ResponseEntity<Map<String, Object>> checkDatabaseHealth() {
    Map<String, Object> response = new HashMap<>();

    try (Connection connection = dataSource.getConnection()) {
      boolean isValid = connection.isValid(2);
      response.put("database", isValid ? "UP" : "DOWN");
      response.put("status", isValid ? 200 : 503);

      return isValid ? ResponseEntity.ok(response) : ResponseEntity.status(503).body(response);
    } catch (Exception e) {
      response.put("status", "DOWN");
      response.put("error", e.getMessage());
      response.put("status", 503);
      return ResponseEntity.status(500).body(response);
    }
  }
}
