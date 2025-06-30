package dev.coregate.product.api.services;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import dev.coregate.product.api.dto.requests.CreateCategoryRequest;
import dev.coregate.product.api.dto.responses.CategoryResponse;
import dev.coregate.product.api.entities.Category;
import dev.coregate.product.api.mapper.impl.CategoryMapperImpl;
import dev.coregate.product.api.repositories.CategoryRepository;
import dev.coregate.product.api.services.impl.CategoryServiceImpl;

@ExtendWith(MockitoExtension.class)
public class CategoryServiceImplTests {

  @Mock
  private CategoryRepository categoryRepository;

  @Mock
  private CategoryMapperImpl mapper;

  @InjectMocks
  private CategoryServiceImpl categoryService;

  private CreateCategoryRequest createRequest;
  private Category category;
  private Category savedCategory;
  private CategoryResponse categoryResponse;

  @BeforeEach
  void setUp() {
    createRequest = new CreateCategoryRequest();
    createRequest.setName("Electronics");
    createRequest.setDescription("Devices and gadgets");

    category = new Category();
    category.setName("Electronics");
    category.setDescription("Devices and gadgets");
    category.setCreatedAt(LocalDateTime.now());
    category.setUpdatedAt(LocalDateTime.now());

    savedCategory = new Category();
    savedCategory.setId(UUID.randomUUID());
    savedCategory.setName("Electronics");
    savedCategory.setDescription("Devices and gadgets");
    savedCategory.setCreatedAt(LocalDateTime.now());
    savedCategory.setUpdatedAt(LocalDateTime.now());

    categoryResponse = new CategoryResponse();
    categoryResponse.setId(savedCategory.getId());
    categoryResponse.setName("Electronics");
    categoryResponse.setDescription("Devices and gadgets");
    categoryResponse.setCreatedAt(savedCategory.getCreatedAt());
    categoryResponse.setUpdatedAt(savedCategory.getUpdatedAt());
  }

  @Test
  void should_create_category_successfully() {
    // Given
    when(categoryRepository.findByName(anyString())).thenReturn(Optional.empty());
    when(mapper.toEntity(any(CreateCategoryRequest.class))).thenReturn(category);
    when(categoryRepository.save(any(Category.class))).thenReturn(savedCategory);
    when(mapper.toResponse(any(Category.class))).thenReturn(categoryResponse);

    // When
    CategoryResponse response = categoryService.createCategory(createRequest);

    assertThat(response).isNotNull();
    assertThat(response.getId()).isEqualTo(savedCategory.getId());
    assertThat(response.getName()).isEqualTo("Electronics");
    assertThat(response.getDescription()).isEqualTo("Devices and gadgets");

    // Verify interactions
    verify(categoryRepository).findByName("Electronics");
    verify(mapper).toEntity(createRequest);
    verify(categoryRepository).save(category);
    verify(mapper).toResponse(savedCategory);
  }
}
