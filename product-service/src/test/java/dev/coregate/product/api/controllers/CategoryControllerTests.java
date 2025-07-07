package dev.coregate.product.api.controllers;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import dev.coregate.product.api.dto.requests.CreateCategoryRequest;
import dev.coregate.product.api.dto.responses.ApiResponse;
import dev.coregate.product.api.dto.responses.CategoryResponse;
import dev.coregate.product.api.exceptions.ResourceNotFoundException;
import dev.coregate.product.api.services.CategoryService;

@ExtendWith(MockitoExtension.class)
public class CategoryControllerTests {

  @Mock
  private CategoryService categoryService;

  @InjectMocks
  private CategoryController categoryController;

  private CreateCategoryRequest createCategoryRequest;
  private CategoryResponse categoryResponse;
  private UUID categoryId;

  @BeforeEach
  void setUp() {
    categoryId = UUID.randomUUID();
    
    createCategoryRequest = new CreateCategoryRequest();
    createCategoryRequest.setName("Electronics");
    createCategoryRequest.setDescription("Electronic devices and gadgets");

    categoryResponse = new CategoryResponse();
    categoryResponse.setId(categoryId);
    categoryResponse.setName("Electronics");
    categoryResponse.setDescription("Electronic devices and gadgets");
    categoryResponse.setCreatedAt(LocalDateTime.now());
    categoryResponse.setUpdatedAt(LocalDateTime.now());
  }

  @Test
  void should_create_category_successfully() {
    // Given
    when(categoryService.createCategory(any(CreateCategoryRequest.class)))
        .thenReturn(categoryResponse);

    // When
    ResponseEntity<ApiResponse<CategoryResponse>> response = 
        categoryController.createCategory(createCategoryRequest);

    // Then
    assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
    assertThat(response.getBody()).isNotNull();
    
    ApiResponse<CategoryResponse> responseBody = Objects.requireNonNull(response.getBody());
    assertThat(responseBody.getStatus()).isEqualTo("success");
    assertThat(responseBody.getMessage()).isEqualTo("Category created successfully");
    assertThat(responseBody.getData().getId()).isEqualTo(categoryId);
    assertThat(responseBody.getData().getName()).isEqualTo("Electronics");
    assertThat(responseBody.getData().getDescription()).isEqualTo("Electronic devices and gadgets");

    verify(categoryService).createCategory(any(CreateCategoryRequest.class));
  }

  @Test
  void should_get_all_categories_successfully() {
    // Given
    List<CategoryResponse> categories = List.of(categoryResponse);
    when(categoryService.getAllCategories()).thenReturn(categories);

    // When
    ResponseEntity<ApiResponse<List<CategoryResponse>>> response = 
        categoryController.getAllCategories();

    // Then
    assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
    assertThat(response.getBody()).isNotNull();
    
    ApiResponse<List<CategoryResponse>> responseBody = Objects.requireNonNull(response.getBody());
    assertThat(responseBody.getStatus()).isEqualTo("success");
    assertThat(responseBody.getMessage()).isEqualTo("Categories retrieved successfully");
    assertThat(responseBody.getData()).hasSize(1);
    assertThat(responseBody.getData().get(0).getId()).isEqualTo(categoryId);
    assertThat(responseBody.getData().get(0).getName()).isEqualTo("Electronics");

    verify(categoryService).getAllCategories();
  }

  @Test
  void should_return_empty_list_when_no_categories_exist() {
    // Given
    when(categoryService.getAllCategories()).thenReturn(List.of());

    // When
    ResponseEntity<ApiResponse<List<CategoryResponse>>> response = 
        categoryController.getAllCategories();

    // Then
    assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
    assertThat(response.getBody()).isNotNull();
    
    ApiResponse<List<CategoryResponse>> responseBody = Objects.requireNonNull(response.getBody());
    assertThat(responseBody.getStatus()).isEqualTo("success");
    assertThat(responseBody.getMessage()).isEqualTo("Categories retrieved successfully");
    assertThat(responseBody.getData()).isEmpty();

    verify(categoryService).getAllCategories();
  }

  @Test
  void should_delete_category_successfully() {
    // Given
    doNothing().when(categoryService).deleteCategory(categoryId);

    // When
    ResponseEntity<ApiResponse<Void>> response = 
        categoryController.deleteCategory(categoryId);

    // Then
    assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
    assertThat(response.getBody()).isNotNull();
    
    ApiResponse<Void> responseBody = Objects.requireNonNull(response.getBody());
    assertThat(responseBody.getStatus()).isEqualTo("success");
    assertThat(responseBody.getMessage()).isEqualTo("Category deleted successfully");
    assertThat(responseBody.getData()).isNull();

    verify(categoryService).deleteCategory(eq(categoryId));
  }

  @Test
  void should_propagate_exception_when_service_throws_resource_not_found() {
    // Given
    when(categoryService.createCategory(any(CreateCategoryRequest.class)))
        .thenThrow(new ResourceNotFoundException("Category", "name", "Electronics"));

    // When & Then
    try {
      categoryController.createCategory(createCategoryRequest);
    } catch (ResourceNotFoundException e) {
      assertThat(e.getMessage()).contains("Category not found with name: Electronics");
    }

    verify(categoryService).createCategory(any(CreateCategoryRequest.class));
  }

  @Test
  void should_propagate_exception_when_service_throws_illegal_argument() {
    // Given
    when(categoryService.createCategory(any(CreateCategoryRequest.class)))
        .thenThrow(new IllegalArgumentException("Category with name 'Electronics' already exists"));

    // When & Then
    try {
      categoryController.createCategory(createCategoryRequest);
    } catch (IllegalArgumentException e) {
      assertThat(e.getMessage()).isEqualTo("Category with name 'Electronics' already exists");
    }

    verify(categoryService).createCategory(any(CreateCategoryRequest.class));
  }

  @Test
  void should_propagate_exception_when_deleting_non_existent_category() {
    // Given
    doThrow(new ResourceNotFoundException("Category", "id", categoryId))
        .when(categoryService).deleteCategory(categoryId);

    // When & Then
    try {
      categoryController.deleteCategory(categoryId);
    } catch (ResourceNotFoundException e) {
      assertThat(e.getMessage()).contains("Category not found with id: " + categoryId);
    }

    verify(categoryService).deleteCategory(eq(categoryId));
  }

  @Test
  void should_handle_null_description_in_create_request() {
    // Given
    createCategoryRequest.setDescription(null);
    
    CategoryResponse responseWithNullDescription = new CategoryResponse();
    responseWithNullDescription.setId(categoryId);
    responseWithNullDescription.setName("Electronics");
    responseWithNullDescription.setDescription(null);
    responseWithNullDescription.setCreatedAt(LocalDateTime.now());
    responseWithNullDescription.setUpdatedAt(LocalDateTime.now());
    
    when(categoryService.createCategory(any(CreateCategoryRequest.class)))
        .thenReturn(responseWithNullDescription);

    // When
    ResponseEntity<ApiResponse<CategoryResponse>> response = 
        categoryController.createCategory(createCategoryRequest);

    // Then
    assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
    assertThat(response.getBody()).isNotNull();
    
    ApiResponse<CategoryResponse> responseBody = Objects.requireNonNull(response.getBody());
    assertThat(responseBody.getData().getDescription()).isNull();

    verify(categoryService).createCategory(any(CreateCategoryRequest.class));
  }
}
