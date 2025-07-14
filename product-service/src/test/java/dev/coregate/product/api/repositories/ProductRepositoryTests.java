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

  @Test
  void should_find_products_with_search_query() {
    // Given
    for (int i = 1; i <= 20; i++) {
      Product product = new Product();
      product.setName("iFong Phone " + i);
      product.setDescription("A revolutionary smartphone " + i + ".");
      product.setPrice(new BigDecimal("999.99").add(new BigDecimal(i)));
      product.setSku("IFONG-12345-" + i);
      product.setWeightKg(new BigDecimal("0.238"));
      product.setCategoryId(testProduct.getCategoryId());
      entityManager.persist(product);
    }
    entityManager.flush();

    // When
    var foundProducts = productRepository.findTopProductsWithSearch("iFong", 10);

    // Then
    assertThat(foundProducts).isNotEmpty();
    assertThat(foundProducts.size()).isEqualTo(10);
  }

  @Test
  void should_find_products_after_cursor() {
    // Given
    entityManager.persistAndFlush(testProduct);
    
    // Create products with specific timestamps
    var now = java.time.LocalDateTime.now();
    for (int i = 1; i <= 20; i++) {
      Product product = new Product();
      product.setName("iFong Phone " + i);
      product.setDescription("A revolutionary smartphone " + i + ".");
      product.setPrice(new BigDecimal("999.99").add(new BigDecimal(i)));
      product.setSku("IFONG-12345-" + i);
      product.setWeightKg(new BigDecimal("0.238"));
      product.setCategoryId(testProduct.getCategoryId());
      product.setCreatedAt(now.minusMinutes(i)); // Each product created 1 minute earlier
      product.setUpdatedAt(now.minusMinutes(i));
      entityManager.persist(product);
    }
    entityManager.flush();

    // Get the 10th product as cursor (sorted by createdAt DESC)
    var allProducts = productRepository.findTopProductsWithSearch("iFong", 20);
    var cursorProduct = allProducts.get(9); // 10th product (0-indexed)
    var cursorCreatedAt = cursorProduct.getCreatedAt();

    // When
    var foundProducts = productRepository.findProductsAfterCursor("iFong", cursorCreatedAt, 5);

    // Then
    assertThat(foundProducts).isNotEmpty();
    assertThat(foundProducts.size()).isEqualTo(5);
    
    // Verify that all found products were created before the cursor
    for (Product product : foundProducts) {
      assertThat(product.getCreatedAt()).isBefore(cursorCreatedAt);
    }
    
    // Verify the results are in correct order (createdAt DESC)
    for (int i = 1; i < foundProducts.size(); i++) {
      assertThat(foundProducts.get(i - 1).getCreatedAt())
          .isAfterOrEqualTo(foundProducts.get(i).getCreatedAt());
    }
  }

  @Test
  void should_return_empty_list_when_cursor_is_oldest() {
    // Given
    var now = java.time.LocalDateTime.now();
    for (int i = 1; i <= 5; i++) {
      Product product = new Product();
      product.setName("iFong Phone " + i);
      product.setDescription("A revolutionary smartphone " + i + ".");
      product.setPrice(new BigDecimal("999.99").add(new BigDecimal(i)));
      product.setSku("IFONG-12345-" + i);
      product.setWeightKg(new BigDecimal("0.238"));
      product.setCategoryId(testProduct.getCategoryId());
      product.setCreatedAt(now.minusMinutes(i));
      product.setUpdatedAt(now.minusMinutes(i));
      entityManager.persist(product);
    }
    entityManager.flush();

    // Get the oldest product's timestamp
    var allProducts = productRepository.findTopProductsWithSearch("iFong", 10);
    var oldestCreatedAt = allProducts.get(allProducts.size() - 1).getCreatedAt();

    // When - try to get products after the oldest timestamp
    var foundProducts = productRepository.findProductsAfterCursor("iFong", oldestCreatedAt, 5);

    // Then
    assertThat(foundProducts).isEmpty();
  }

  @Test
  void should_handle_empty_query_in_cursor_search() {
    // Given
    var now = java.time.LocalDateTime.now();
    for (int i = 1; i <= 10; i++) {
      Product product = new Product();
      product.setName("Product " + i);
      product.setDescription("Description " + i);
      product.setPrice(new BigDecimal("100.00").add(new BigDecimal(i)));
      product.setSku("SKU-" + i);
      product.setWeightKg(new BigDecimal("1.0"));
      product.setCategoryId(testProduct.getCategoryId());
      product.setCreatedAt(now.minusMinutes(i));
      product.setUpdatedAt(now.minusMinutes(i));
      entityManager.persist(product);
    }
    entityManager.flush();

    // Get 5th product as cursor
    var allProducts = productRepository.findTopProductsWithSearch("", 10);
    var cursorCreatedAt = allProducts.get(4).getCreatedAt();

    // When - search with empty query
    var foundProducts = productRepository.findProductsAfterCursor("", cursorCreatedAt, 3);

    // Then
    assertThat(foundProducts).hasSize(3);
    for (Product product : foundProducts) {
      assertThat(product.getCreatedAt()).isBefore(cursorCreatedAt);
    }
  }
}
