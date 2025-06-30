package dev.coregate.product.api.repositories;

import java.time.LocalDateTime;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.test.context.ActiveProfiles;
import static org.assertj.core.api.Assertions.assertThat;

import dev.coregate.product.api.entities.Category;

@DataJpaTest
@ActiveProfiles("test")
public class CategoryRepositoryTests {

  @Autowired
  private TestEntityManager entityManager;

  @Autowired
  private CategoryRepository categoryRepository;

  private Category testCategory;

  @BeforeEach
  void setUp() {
    testCategory = new Category();
    testCategory.setName("Electronics");
    testCategory.setDescription("Electronic devices and gadgets");
    testCategory.setCreatedAt(LocalDateTime.now());
    testCategory.setUpdatedAt(LocalDateTime.now());
  }

  @Test
  void should_save_category_successfully() {
    // When
    Category savedCategory = categoryRepository.save(testCategory);

    // Then
    assertThat(savedCategory).isNotNull();
    assertThat(savedCategory.getId()).isNotNull();
    assertThat(savedCategory.getName()).isEqualTo("Electronics");
    assertThat(savedCategory.getDescription()).isEqualTo("Electronic devices and gadgets");
    assertThat(savedCategory.getCreatedAt()).isNotNull();
    assertThat(savedCategory.getUpdatedAt()).isNotNull();
  }

  @Test
  void should_find_category_by_id_successfully() {
    // Given
    Category savedCategory = entityManager.persistAndFlush(testCategory);

    // When
    Optional<Category> foundCategory = categoryRepository.findById(savedCategory.getId());

    // Then
    assertThat(foundCategory).isPresent();
    assertThat(foundCategory.get().getName()).isEqualTo("Electronics");
  }

  @Test
  void should_find_category_by_name() {
    // Given
    entityManager.persistAndFlush(testCategory);

    // When
    Optional<Category> foundCategory = categoryRepository.findByName("Electronics");

    // Then
    assertThat(foundCategory).isPresent();
    assertThat(foundCategory.get().getName()).isEqualTo("Electronics");
  }

  @Test
  void should_return_empty_when_category_not_found_by_name() {
    // When
    Optional<Category> foundCategory = categoryRepository.findByName("NonExistentCategory");

    // Then
    assertThat(foundCategory).isNotPresent();
  }
}
