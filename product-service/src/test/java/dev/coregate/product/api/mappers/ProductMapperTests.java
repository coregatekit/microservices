package dev.coregate.product.api.mappers;

import static org.assertj.core.api.Assertions.assertThat;

import java.math.BigDecimal;
import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

import dev.coregate.product.api.dto.requests.CreateProductRequest;
import dev.coregate.product.api.dto.responses.ProductResponse;
import dev.coregate.product.api.entities.Product;
import dev.coregate.product.api.mapper.impl.ProductMapperImpl;

@DataJpaTest
@ActiveProfiles("test")
public class ProductMapperTests {

  private ProductMapperImpl productMapper;

  @BeforeEach
  void setUp() {
    productMapper = new ProductMapperImpl();
  }

  @Test
  void should_map_create_product_request_to_entity() {
    // Given
    UUID categoryId = UUID.randomUUID();

    CreateProductRequest request = new CreateProductRequest();
    request.setCategoryId(UUID.randomUUID());
    request.setName("Test Product");
    request.setDescription("This is a test product.");
    request.setPrice(new BigDecimal(19.99));
    request.setSku("TEST-SKU-123");
    request.setWeightKg(new BigDecimal(1.5));
    request.setCategoryId(categoryId);

    // When
    Product product = productMapper.toEntity(request);

    // Then
    assertThat(product).isNotNull();
    assertThat(product.getName()).isEqualTo("Test Product");
    assertThat(product.getDescription()).isEqualTo("This is a test product.");
    assertThat(product.getPrice()).isEqualTo(new BigDecimal(19.99));
    assertThat(product.getSku()).isEqualTo("TEST-SKU-123");
    assertThat(product.getWeightKg()).isEqualTo(new BigDecimal(1.5));
    assertThat(product.getCategoryId()).isEqualTo(categoryId);
    assertThat(product.getId()).isNull(); // ID should be null before persisting
    // Timestamps should be null since they're set by JPA lifecycle callbacks
    assertThat(product.getCreatedAt()).isNull();
    assertThat(product.getUpdatedAt()).isNull();
  }

  @Test
  void should_map_product_to_product_response() {
    // Given
    UUID categoryId = UUID.randomUUID();
    Product product = new Product();
    product.setId(UUID.randomUUID());
    product.setName("Test Product");
    product.setDescription("This is a test product.");
    product.setPrice(new BigDecimal(19.99));
    product.setSku("TEST-SKU-123");
    product.setWeightKg(new BigDecimal(1.5));
    product.setCategoryId(categoryId);
    product.setCreatedAt(null); // Simulating JPA lifecycle
    product.setUpdatedAt(null); // Simulating JPA lifecycle

    // When
    ProductResponse response = productMapper.toResponse(product);

    // Then
    assertThat(response).isNotNull();
    assertThat(response.getId()).isEqualTo(product.getId());
    assertThat(response.getName()).isEqualTo("Test Product");
    assertThat(response.getDescription()).isEqualTo("This is a test product.");
    assertThat(response.getPrice()).isEqualTo(new BigDecimal(19.99));
    assertThat(response.getSku()).isEqualTo("TEST-SKU-123");
    assertThat(response.getWeightKg()).isEqualTo(new BigDecimal(1.5));
    assertThat(response.getCategoryId()).isEqualTo(categoryId);
  }
}
