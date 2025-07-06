package dev.coregate.product.api.mappers;

import static org.assertj.core.api.Assertions.assertThat;

import java.math.BigDecimal;
import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

import dev.coregate.product.api.dto.requests.CreateProductRequest;
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
}
