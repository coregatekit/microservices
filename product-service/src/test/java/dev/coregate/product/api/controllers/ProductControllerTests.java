package dev.coregate.product.api.controllers;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.time.LocalDateTime;
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

import dev.coregate.product.api.dto.requests.CreateProductRequest;
import dev.coregate.product.api.dto.responses.ApiResponse;
import dev.coregate.product.api.dto.responses.CategoryResponse;
import dev.coregate.product.api.dto.responses.ProductResponse;
import dev.coregate.product.api.exceptions.ResourceNotFoundException;
import dev.coregate.product.api.services.ProductService;

@ExtendWith(MockitoExtension.class)
public class ProductControllerTests {

  @Mock
  private ProductService productService;

  @InjectMocks
  private ProductController productController;

  private CreateProductRequest createProductRequest;
  private ProductResponse productResponse;
  private CategoryResponse categoryResponse;
  private UUID productId;
  private UUID categoryId;

  @BeforeEach
  void setUp() {
    productId = UUID.randomUUID();
    categoryId = UUID.randomUUID();
    
    // Setup category response
    categoryResponse = new CategoryResponse();
    categoryResponse.setId(categoryId);
    categoryResponse.setName("Electronics");
    categoryResponse.setDescription("Electronic devices and gadgets");
    categoryResponse.setCreatedAt(LocalDateTime.now());
    categoryResponse.setUpdatedAt(LocalDateTime.now());

    // Setup create product request
    createProductRequest = new CreateProductRequest();
    createProductRequest.setName("iPhone 15");
    createProductRequest.setDescription("Latest iPhone model with advanced features");
    createProductRequest.setSku("IPHONE-15-128GB");
    createProductRequest.setPrice(new BigDecimal("999.99"));
    createProductRequest.setWeightKg(new BigDecimal("0.2"));
    createProductRequest.setCategoryId(categoryId);

    // Setup product response
    productResponse = new ProductResponse();
    productResponse.setId(productId);
    productResponse.setName("iPhone 15");
    productResponse.setDescription("Latest iPhone model with advanced features");
    productResponse.setSku("IPHONE-15-128GB");
    productResponse.setPrice(new BigDecimal("999.99"));
    productResponse.setWeightKg(new BigDecimal("0.2"));
    productResponse.setCategoryId(categoryId);
    productResponse.setCategory(categoryResponse);
    productResponse.setCreatedAt(LocalDateTime.now());
    productResponse.setUpdatedAt(LocalDateTime.now());
  }

  @Test
  void should_create_product_successfully() {
    // Given
    when(productService.createProduct(any(CreateProductRequest.class)))
        .thenReturn(productResponse);

    // When
    ResponseEntity<ApiResponse<ProductResponse>> response = 
        productController.createProduct(createProductRequest);

    // Then
    assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
    assertThat(response.getBody()).isNotNull();
    
    ApiResponse<ProductResponse> responseBody = Objects.requireNonNull(response.getBody());
    assertThat(responseBody.getStatus()).isEqualTo("success");
    assertThat(responseBody.getMessage()).isEqualTo("Product created successfully");
    assertThat(responseBody.getData().getId()).isEqualTo(productId);
    assertThat(responseBody.getData().getName()).isEqualTo("iPhone 15");
    assertThat(responseBody.getData().getDescription()).isEqualTo("Latest iPhone model with advanced features");
    assertThat(responseBody.getData().getSku()).isEqualTo("IPHONE-15-128GB");
    assertThat(responseBody.getData().getPrice()).isEqualTo(new BigDecimal("999.99"));
    assertThat(responseBody.getData().getWeightKg()).isEqualTo(new BigDecimal("0.2"));
    assertThat(responseBody.getData().getCategoryId()).isEqualTo(categoryId);
    assertThat(responseBody.getData().getCategory()).isNotNull();
    assertThat(responseBody.getData().getCategory().getName()).isEqualTo("Electronics");

    verify(productService).createProduct(any(CreateProductRequest.class));
  }

  @Test
  void should_create_product_without_category_details() {
    // Given
    ProductResponse responseWithoutCategory = new ProductResponse();
    responseWithoutCategory.setId(productId);
    responseWithoutCategory.setName("iPhone 15");
    responseWithoutCategory.setDescription("Latest iPhone model with advanced features");
    responseWithoutCategory.setSku("IPHONE-15-128GB");
    responseWithoutCategory.setPrice(new BigDecimal("999.99"));
    responseWithoutCategory.setWeightKg(new BigDecimal("0.2"));
    responseWithoutCategory.setCategoryId(categoryId);
    responseWithoutCategory.setCategory(null); // No category details
    responseWithoutCategory.setCreatedAt(LocalDateTime.now());
    responseWithoutCategory.setUpdatedAt(LocalDateTime.now());

    when(productService.createProduct(any(CreateProductRequest.class)))
        .thenReturn(responseWithoutCategory);

    // When
    ResponseEntity<ApiResponse<ProductResponse>> response = 
        productController.createProduct(createProductRequest);

    // Then
    assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
    assertThat(response.getBody()).isNotNull();
    
    ApiResponse<ProductResponse> responseBody = Objects.requireNonNull(response.getBody());
    assertThat(responseBody.getStatus()).isEqualTo("success");
    assertThat(responseBody.getMessage()).isEqualTo("Product created successfully");
    assertThat(responseBody.getData().getCategoryId()).isEqualTo(categoryId);
    assertThat(responseBody.getData().getCategory()).isNull();

    verify(productService).createProduct(any(CreateProductRequest.class));
  }

  @Test
  void should_propagate_exception_when_service_throws_resource_not_found() {
    // Given
    when(productService.createProduct(any(CreateProductRequest.class)))
        .thenThrow(new ResourceNotFoundException("Category", "id", categoryId));

    // When & Then
    try {
      productController.createProduct(createProductRequest);
    } catch (ResourceNotFoundException e) {
      assertThat(e.getMessage()).contains("Category not found with id: " + categoryId);
    }

    verify(productService).createProduct(any(CreateProductRequest.class));
  }

  @Test
  void should_propagate_exception_when_service_throws_illegal_argument() {
    // Given
    when(productService.createProduct(any(CreateProductRequest.class)))
        .thenThrow(new IllegalArgumentException("Product with SKU 'IPHONE-15-128GB' already exists"));

    // When & Then
    try {
      productController.createProduct(createProductRequest);
    } catch (IllegalArgumentException e) {
      assertThat(e.getMessage()).isEqualTo("Product with SKU 'IPHONE-15-128GB' already exists");
    }

    verify(productService).createProduct(any(CreateProductRequest.class));
  }

  @Test
  void should_handle_null_description_in_create_request() {
    // Given
    createProductRequest.setDescription(null);
    
    ProductResponse responseWithNullDescription = new ProductResponse();
    responseWithNullDescription.setId(productId);
    responseWithNullDescription.setName("iPhone 15");
    responseWithNullDescription.setDescription(null);
    responseWithNullDescription.setSku("IPHONE-15-128GB");
    responseWithNullDescription.setPrice(new BigDecimal("999.99"));
    responseWithNullDescription.setWeightKg(new BigDecimal("0.2"));
    responseWithNullDescription.setCategoryId(categoryId);
    responseWithNullDescription.setCreatedAt(LocalDateTime.now());
    responseWithNullDescription.setUpdatedAt(LocalDateTime.now());
    
    when(productService.createProduct(any(CreateProductRequest.class)))
        .thenReturn(responseWithNullDescription);

    // When
    ResponseEntity<ApiResponse<ProductResponse>> response = 
        productController.createProduct(createProductRequest);

    // Then
    assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
    assertThat(response.getBody()).isNotNull();
    
    ApiResponse<ProductResponse> responseBody = Objects.requireNonNull(response.getBody());
    assertThat(responseBody.getData().getDescription()).isNull();

    verify(productService).createProduct(any(CreateProductRequest.class));
  }

  @Test
  void should_handle_minimum_required_fields() {
    // Given - Create request with only required fields
    CreateProductRequest minimalRequest = new CreateProductRequest();
    minimalRequest.setName("Basic Product");
    minimalRequest.setSku("BASIC-001");
    minimalRequest.setPrice(new BigDecimal("10.00"));
    minimalRequest.setWeightKg(new BigDecimal("0.1"));
    minimalRequest.setCategoryId(categoryId);
    // description is optional, so not set

    ProductResponse minimalResponse = new ProductResponse();
    minimalResponse.setId(productId);
    minimalResponse.setName("Basic Product");
    minimalResponse.setSku("BASIC-001");
    minimalResponse.setPrice(new BigDecimal("10.00"));
    minimalResponse.setWeightKg(new BigDecimal("0.1"));
    minimalResponse.setCategoryId(categoryId);
    minimalResponse.setCreatedAt(LocalDateTime.now());
    minimalResponse.setUpdatedAt(LocalDateTime.now());

    when(productService.createProduct(any(CreateProductRequest.class)))
        .thenReturn(minimalResponse);

    // When
    ResponseEntity<ApiResponse<ProductResponse>> response = 
        productController.createProduct(minimalRequest);

    // Then
    assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
    assertThat(response.getBody()).isNotNull();
    
    ApiResponse<ProductResponse> responseBody = Objects.requireNonNull(response.getBody());
    assertThat(responseBody.getStatus()).isEqualTo("success");
    assertThat(responseBody.getData().getName()).isEqualTo("Basic Product");
    assertThat(responseBody.getData().getSku()).isEqualTo("BASIC-001");
    assertThat(responseBody.getData().getPrice()).isEqualTo(new BigDecimal("10.00"));
    assertThat(responseBody.getData().getWeightKg()).isEqualTo(new BigDecimal("0.1"));
    assertThat(responseBody.getData().getCategoryId()).isEqualTo(categoryId);

    verify(productService).createProduct(any(CreateProductRequest.class));
  }

  @Test
  void should_handle_large_decimal_values() {
    // Given - Create request with large decimal values
    createProductRequest.setPrice(new BigDecimal("9999999.99"));
    createProductRequest.setWeightKg(new BigDecimal("999.999"));

    ProductResponse responseWithLargeValues = new ProductResponse();
    responseWithLargeValues.setId(productId);
    responseWithLargeValues.setName("iPhone 15");
    responseWithLargeValues.setDescription("Latest iPhone model with advanced features");
    responseWithLargeValues.setSku("IPHONE-15-128GB");
    responseWithLargeValues.setPrice(new BigDecimal("9999999.99"));
    responseWithLargeValues.setWeightKg(new BigDecimal("999.999"));
    responseWithLargeValues.setCategoryId(categoryId);
    responseWithLargeValues.setCreatedAt(LocalDateTime.now());
    responseWithLargeValues.setUpdatedAt(LocalDateTime.now());

    when(productService.createProduct(any(CreateProductRequest.class)))
        .thenReturn(responseWithLargeValues);

    // When
    ResponseEntity<ApiResponse<ProductResponse>> response = 
        productController.createProduct(createProductRequest);

    // Then
    assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
    assertThat(response.getBody()).isNotNull();
    
    ApiResponse<ProductResponse> responseBody = Objects.requireNonNull(response.getBody());
    assertThat(responseBody.getData().getPrice()).isEqualTo(new BigDecimal("9999999.99"));
    assertThat(responseBody.getData().getWeightKg()).isEqualTo(new BigDecimal("999.999"));

    verify(productService).createProduct(any(CreateProductRequest.class));
  }
}
