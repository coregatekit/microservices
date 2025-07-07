package dev.coregate.product.api.services;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalDateTime;
import java.util.List;
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
import dev.coregate.product.api.exceptions.ResourceNotFoundException;
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

  @Test
  void should_throw_exception_when_category_already_exists() {
    // Given
    when(categoryRepository.findByName(anyString())).thenReturn(Optional.of(savedCategory));

    // When & Then
    try {
      categoryService.createCategory(createRequest);
    } catch (IllegalArgumentException e) {
      assertThat(e.getMessage()).isEqualTo("Category with name 'Electronics' already exists.");
    }
    verify(categoryRepository).findByName("Electronics");
  }

  @Test
  void should_return_list_of_categories() {
    // Given
    when(categoryRepository.findAll()).thenReturn(List.of(savedCategory));
    when(mapper.toResponse(any(Category.class))).thenReturn(categoryResponse);

    // When
    List<CategoryResponse> responses = categoryService.getAllCategories();

    // Then
    assertThat(responses).isNotEmpty();
    assertThat(responses.size()).isEqualTo(1);
    assertThat(responses.get(0).getId()).isEqualTo(savedCategory.getId());
    assertThat(responses.get(0).getName()).isEqualTo("Electronics");
    assertThat(responses.get(0).getDescription()).isEqualTo("Devices and gadgets");

    // Verify interactions
    verify(categoryRepository).findAll();
    verify(mapper).toResponse(savedCategory);
  }

  @Test
  void should_delete_category_successfully() {
    // Given
    UUID categoryId = UUID.randomUUID();
    when(categoryRepository.existsById(categoryId)).thenReturn(true);

    // When
    categoryService.deleteCategory(categoryId);

    // Then
    verify(categoryRepository).deleteById(categoryId);
  }

  @Test
  void should_throw_exception_when_deleting_non_existent_category() {
    // Given
    UUID categoryId = UUID.randomUUID();
    when(categoryRepository.existsById(categoryId)).thenReturn(false);

    // When & Then
    try {
      categoryService.deleteCategory(categoryId);
    } catch (ResourceNotFoundException e) {
      assertThat(e.getMessage()).isEqualTo("Category with ID '" + categoryId + "' does not exist.");
    }
    verify(categoryRepository).existsById(categoryId);
    verify(categoryRepository, never()).deleteById(categoryId);
  }
}
