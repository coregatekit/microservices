package dev.coregate.product.api.builders;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.util.UUID;

import dev.coregate.product.api.entities.Product;
import dev.coregate.product.api.repositories.CategoryRepository;

@ExtendWith(MockitoExtension.class)
public class ProductUpdateBuilderTests {

  @Mock
  private CategoryRepository categoryRepository;

  Product product;

  @BeforeEach
  void setUp() {
    product = new Product();
    product.setId(UUID.randomUUID());
    product.setName("Original Product Name");
    product.setDescription("Original Product Description");
    product.setPrice(BigDecimal.valueOf(100));
    product.setWeightKg(BigDecimal.valueOf(1));
    product.setCategoryId(UUID.randomUUID());
  }

  @Nested
  @DisplayName("Update Product Name Tests")
  class UpdateNameTests {
    @Test
    void should_update_name_when_valid() {
      // Given
      String newName = "Updated Product Name";

      // When
      Product result = new ProductUpdateBuilder(product, categoryRepository).updateName(newName).build();

      // Then
      assertThat(result.getName()).isEqualTo(newName);
    }

    @Test
    void should_not_update_name_when_null() {
      // Given
      String newName = null;

      // When
      Product result = new ProductUpdateBuilder(product, categoryRepository).updateName(newName).build();

      // Then
      assertThat(result.getName()).isEqualTo("Original Product Name");
    }

    @Test
    void should_not_update_name_when_empty() {
      // Given
      String newName = "";

      // When
      Product result = new ProductUpdateBuilder(product, categoryRepository).updateName(newName).build();

      // Then
      assertThat(result.getName()).isEqualTo("Original Product Name");
    }
  }

  @Nested
  @DisplayName("Update Product Description Tests")
  class UpdateDescriptionTests {
    @Test
    void should_update_description_when_valid() {
      // Given
      String newDescription = "Updated Product Description";

      // When
      Product result = new ProductUpdateBuilder(product, categoryRepository).updateDescription(newDescription).build();

      // Then
      assertThat(result.getDescription()).isEqualTo(newDescription);
    }

    @Test
    void should_not_update_description_when_null() {
      // Given
      String newDescription = null;

      // When
      Product result = new ProductUpdateBuilder(product, categoryRepository).updateDescription(newDescription).build();

      // Then
      assertThat(result.getDescription()).isEqualTo("Original Product Description");
    }

    @Test
    void should_not_update_description_when_empty() {
      // Given
      String newDescription = "";

      // When
      Product result = new ProductUpdateBuilder(product, categoryRepository).updateDescription(newDescription).build();

      // Then
      assertThat(result.getDescription()).isEqualTo("Original Product Description");
    }
  }

  @Nested
  @DisplayName("Update Product Price Tests")
  class UpdatePriceTests {
    @Test
    void should_update_price_when_valid() {
      // Given
      BigDecimal newPrice = BigDecimal.valueOf(150);

      // When
      Product result = new ProductUpdateBuilder(product, categoryRepository).updatePrice(newPrice).build();

      // Then
      assertThat(result.getPrice()).isEqualTo(newPrice);
    }

    @Test
    void should_not_update_price_when_null() {
      // Given
      BigDecimal newPrice = null;

      // When
      Product result = new ProductUpdateBuilder(product, categoryRepository).updatePrice(newPrice).build();

      // Then
      assertThat(result.getPrice()).isEqualTo(BigDecimal.valueOf(100));
    }

    @Test
    void should_not_update_price_when_zero_or_negative() {
      // Given
      BigDecimal newPrice = BigDecimal.ZERO;

      // When
      Product result = new ProductUpdateBuilder(product, categoryRepository).updatePrice(newPrice).build();

      // Then
      assertThat(result.getPrice()).isEqualTo(BigDecimal.valueOf(100));
    }
  }

  @Nested
  @DisplayName("Update Product WeightKg Tests")
  class UpdateWeightKgTests {
    @Test
    void should_update_weightKg_when_valid() {
      // Given
      BigDecimal newWeightKg = BigDecimal.valueOf(2);

      // When
      Product result = new ProductUpdateBuilder(product, categoryRepository).updateWeightKg(newWeightKg).build();

      // Then
      assertThat(result.getWeightKg()).isEqualTo(newWeightKg);
    }

    @Test
    void should_not_update_weightKg_when_null() {
      // Given
      BigDecimal newWeightKg = null;

      // When
      Product result = new ProductUpdateBuilder(product, categoryRepository).updateWeightKg(newWeightKg).build();

      // Then
      assertThat(result.getWeightKg()).isEqualTo(BigDecimal.valueOf(1));
    }

    @Test
    void should_not_update_weightKg_when_zero_or_negative() {
      // Given
      BigDecimal newWeightKg = BigDecimal.ZERO;

      // When
      Product result = new ProductUpdateBuilder(product, categoryRepository).updateWeightKg(newWeightKg).build();

      // Then
      assertThat(result.getWeightKg()).isEqualTo(BigDecimal.valueOf(1));
    }
  }

  @Nested
  @DisplayName("Update Product CategoryId Tests")
  class UpdateCategoryIdTests {
    @Test
    void should_update_categoryId_when_valid() {
      // Given
      UUID newCategoryId = UUID.randomUUID();
      // Mock the categoryRepository to return true for existsById
      when(categoryRepository.existsById(newCategoryId)).thenReturn(true);

      // When
      Product result = new ProductUpdateBuilder(product, categoryRepository).updateCategoryId(newCategoryId).build();

      // Then
      assertThat(result.getCategoryId()).isEqualTo(newCategoryId);
    }

    @Test
    void should_not_update_categoryId_when_null() {
      // Given
      UUID newCategoryId = null;

      // When
      Product result = new ProductUpdateBuilder(product, categoryRepository).updateCategoryId(newCategoryId).build();

      // Then
      assertThat(result.getCategoryId()).isEqualTo(product.getCategoryId());
    }

    @Test
    void should_throw_exception_when_categoryId_does_not_exist() {
      // Given
      UUID newCategoryId = UUID.randomUUID();
      // Mock the categoryRepository to return false for existsById
      when(categoryRepository.existsById(newCategoryId)).thenReturn(false);

      // When
      ProductUpdateBuilder builder = new ProductUpdateBuilder(product, categoryRepository);


      // Then
      try {
        builder.updateCategoryId(newCategoryId).build();
      } catch (IllegalArgumentException e) {
        assertThat(e.getMessage()).isEqualTo("Category with ID " + newCategoryId + " does not exist.");
      }
    }
  }
}
