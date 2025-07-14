package dev.coregate.product.api.repositories;

import java.math.BigDecimal;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.test.context.ActiveProfiles;
import static org.assertj.core.api.Assertions.assertThat;

import dev.coregate.product.api.entities.Category;
import dev.coregate.product.api.entities.Product;

@DataJpaTest
@ActiveProfiles("test")
public class ProductRepositoryTests {

  @Autowired
  private TestEntityManager entityManager;

  @Autowired
  private ProductRepository productRepository;

  private Product testProduct;

  @BeforeEach
  void setUp() {
    testProduct = new Product();
    testProduct.setName("iFong Phone");
    testProduct.setDescription("A revolutionary smartphone.");
    testProduct.setPrice(new BigDecimal("999.99"));
    testProduct.setSku("IFONG-12345");
    testProduct.setWeightKg(new BigDecimal("0.238"));

    Category category = new Category();
    category.setName("Smartphones");
    entityManager.persist(category);
    testProduct.setCategoryId(category.getId());
  }

  @Test
  void should_save_product_successfully() {
    // When
    Product savedProduct = productRepository.save(testProduct);

    // Then
    assertThat(savedProduct).isNotNull();
    assertThat(savedProduct.getId()).isNotNull();
    assertThat(savedProduct.getName()).isEqualTo("iFong Phone");
    assertThat(savedProduct.getDescription()).isEqualTo("A revolutionary smartphone.");
    assertThat(savedProduct.getPrice()).isEqualByComparingTo(new BigDecimal("999.99"));
    assertThat(savedProduct.getSku()).isEqualTo("IFONG-12345");
    assertThat(savedProduct.getWeightKg()).isEqualByComparingTo(new BigDecimal("0.238"));
  }

  @Test
  void should_find_product_by_name_successfully() {
    // Given
    Product savedProduct = entityManager.persistAndFlush(testProduct);

    // When
    var foundProduct = productRepository.findByName(savedProduct.getName());

    // Then
    assertThat(foundProduct).isPresent();
    assertThat(foundProduct.get().getId()).isEqualTo(savedProduct.getId());
    assertThat(foundProduct.get().getName()).isEqualTo("iFong Phone");
  }

  @Test
  void should_find_product_by_sku_successfully() {
    // Given
    Product savedProduct = entityManager.persistAndFlush(testProduct);

    // When
    var foundProduct = productRepository.findBySku(savedProduct.getSku());

    // Then
    assertThat(foundProduct).isPresent();
    assertThat(foundProduct.get().getId()).isEqualTo(savedProduct.getId());
    assertThat(foundProduct.get().getSku()).isEqualTo("IFONG-12345");
  }

  @Test
  void should_return_empty_when_product_not_found_by_name() {
    // When
    var foundProduct = productRepository.findByName("NonExistentProduct");

    // Then
    assertThat(foundProduct).isNotPresent();
  }

  @Test
  void should_return_empty_when_product_not_found_by_sku() {
    // When
    var foundProduct = productRepository.findBySku("NonExistentSKU");

    // Then
    assertThat(foundProduct).isNotPresent();
  }
}
