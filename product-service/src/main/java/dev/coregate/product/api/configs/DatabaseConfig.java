package dev.coregate.product.api.configs;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;

/**
 * Class นี้ใช้สำหรับ Config Database Connection
 * โดยใช้ HikariCP เป็น Connection Pool 
 * โดยที่จะอ่านค่าจาก application.yml
 * ที่กำหนดไว้ใน properties เช่น URL, Username, Password
 * และตั้งค่าต่างๆ เช่น ขนาดของ Connection Pool, Timeout, Auto-commit
 * และ Performance Settings  
 */

@Configuration
public class DatabaseConfig {

  @Value("${spring.datasource.url}")
  private String databaseUrl;

  @Value("${spring.datasource.username}")
  private String databaseUsername;

  @Value("${spring.datasource.password}")
  private String databasePassword;

  @Bean
  @Primary
  public DataSource dataSource() {
    HikariConfig config = new HikariConfig();
    config.setJdbcUrl(databaseUrl);
    config.setUsername(databaseUsername);
    config.setPassword(databasePassword);
    config.setDriverClassName("org.postgresql.Driver");

    // Connection pool settings
    config.setMaximumPoolSize(20);
    config.setMinimumIdle(10);
    config.setConnectionTimeout(30000); // 30 seconds
    config.setIdleTimeout(600000); // 10 minutes
    config.setMaxLifetime(1800000); // 30 minutes
    config.setAutoCommit(false); // Disable auto-commit for better transaction management
    config.setPoolName("ProductServiceHikariConnectionPool");

    // Performance settings
    config.addDataSourceProperty("cachePrepStmts", "true");
    config.addDataSourceProperty("prepStmtCacheSize", "250");
    config.addDataSourceProperty("prepStmtCacheSqlLimit", "2048");

    return new HikariDataSource(config);
  }
}
