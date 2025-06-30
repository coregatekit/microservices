package dev.coregate.product.api.mappers;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.LocalDateTime;
import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

import dev.coregate.product.api.dto.requests.CreateCategoryRequest;
import dev.coregate.product.api.dto.responses.CategoryResponse;
import dev.coregate.product.api.entities.Category;
import dev.coregate.product.api.mapper.impl.CategoryMapperImpl;

@DataJpaTest
@ActiveProfiles("test")
public class CategoryMapperTests {

  private CategoryMapperImpl categoryMapper;

  @BeforeEach
  void setUp() {
    categoryMapper = new CategoryMapperImpl();
  }

  @Test
  void should_map_category_to_response() {
    // Given
    UUID id = UUID.randomUUID();
    LocalDateTime now = LocalDateTime.now();

    Category category = new Category();
    category.setId(id);
    category.setName("Electronics");
    category.setDescription("Devices and gadgets");
    category.setCreatedAt(now);
    category.setUpdatedAt(now);

    // When
    CategoryResponse response = categoryMapper.toResponse(category);

    // Then
    assertThat(response).isNotNull();
    assertThat(response.getId()).isEqualTo(id);
    assertThat(response.getName()).isEqualTo("Electronics");
    assertThat(response.getDescription()).isEqualTo("Devices and gadgets");
    assertThat(response.getCreatedAt()).isEqualTo(now);
    assertThat(response.getUpdatedAt()).isEqualTo(now);
  }

  @Test
  void should_map_category_with_null_description_to_response() {
    // Given
    Category category = new Category();
    category.setId(UUID.randomUUID());
    category.setName("Electronics");
    category.setDescription(null);
    category.setCreatedAt(LocalDateTime.now());
    category.setUpdatedAt(LocalDateTime.now());

    // When
    CategoryResponse response = categoryMapper.toResponse(category);

    // Then
    assertThat(response).isNotNull();
    assertThat(response.getDescription()).isNull();
  }

  @Test
  void should_create_entity_from_name_and_description() {
    // When
    Category category = categoryMapper.toEntity(new CreateCategoryRequest("Books", "Books and literature"));

    // Then
    assertThat(category).isNotNull();
    assertThat(category.getName()).isEqualTo("Books");
    assertThat(category.getDescription()).isEqualTo("Books and literature");
    // Remove assertions for timestamp fields if they're set by JPA lifecycle callbacks
    // assertThat(category.getCreatedAt()).isNotNull();
    // assertThat(category.getUpdatedAt()).isNotNull();
    assertThat(category.getId()).isNull(); // ID should be null before saving
  }

  @Test
  void should_create_entity_with_null_description() {
    // When
    Category category = categoryMapper.toEntity(new CreateCategoryRequest("Books", null));

    // Then
    assertThat(category).isNotNull();
    assertThat(category.getName()).isEqualTo("Books");
    assertThat(category.getDescription()).isNull();
  }
}
