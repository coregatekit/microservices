package dev.coregate.product.api.services;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageRequest;

import dev.coregate.product.api.dto.requests.CreateProductRequest;
import dev.coregate.product.api.dto.responses.CursorPageResponse;
import dev.coregate.product.api.dto.responses.ProductResponse;
import dev.coregate.product.api.entities.Product;
import dev.coregate.product.api.exceptions.ResourceNotFoundException;
import dev.coregate.product.api.mapper.ProductMapper;
import dev.coregate.product.api.repositories.CategoryRepository;
import dev.coregate.product.api.repositories.ProductRepository;
import dev.coregate.product.api.services.impl.ProductServiceImpl;

@ExtendWith(MockitoExtension.class)
public class ProductServiceImplTests {

  @Mock
  private ProductRepository productRepository;
  @Mock
  private CategoryRepository categoryRepository; // Assuming this is needed for validation

  @Mock
  private ProductMapper productMapper;

  @InjectMocks
  private ProductServiceImpl productService;

  @Nested
  @DisplayName("Create Product Tests")
  class CreateProduct {
    private CreateProductRequest createRequest;
    private Product product;
    private Product savedProduct;
    private ProductResponse productResponse;

    @BeforeEach
    void setUp() {
      UUID categoryId = UUID.randomUUID();
      LocalDateTime now = LocalDateTime.now();

      createRequest = new CreateProductRequest();
      createRequest.setName("iPhone 15 Pro Max");
      createRequest.setDescription("Latest Apple smartphone with advanced features");
      createRequest.setSku("IP15PM-256GB");
      createRequest.setPrice(new BigDecimal(1199.99));
      createRequest.setWeightKg(new BigDecimal(0.238));
      createRequest.setCategoryId(categoryId);

      product = new Product();
      product.setName("iPhone 15 Pro Max");
      product.setDescription("Latest Apple smartphone with advanced features");
      product.setSku("IP15PM-256GB");
      product.setPrice(new BigDecimal(1199.99));
      product.setWeightKg(new BigDecimal(0.238));
      product.setCategoryId(categoryId);
      product.setCreatedAt(null);
      product.setUpdatedAt(null);

      savedProduct = new Product();
      savedProduct.setId(UUID.randomUUID());
      savedProduct.setName("iPhone 15 Pro Max");
      savedProduct.setDescription("Latest Apple smartphone with advanced features");
      savedProduct.setSku("IP15PM-256GB");
      savedProduct.setPrice(new BigDecimal(1199.99));
      savedProduct.setWeightKg(new BigDecimal(0.238));
      savedProduct.setCategoryId(categoryId);
      savedProduct.setCreatedAt(now);
      savedProduct.setUpdatedAt(now);

      productResponse = new ProductResponse();
      productResponse.setId(savedProduct.getId());
      productResponse.setName("iPhone 15 Pro Max");
      productResponse.setDescription("Latest Apple smartphone with advanced features");
      productResponse.setSku("IP15PM-256GB");
      productResponse.setPrice(new BigDecimal(1199.99));
      productResponse.setWeightKg(new BigDecimal(0.238));
      productResponse.setCategoryId(categoryId);
      productResponse.setCreatedAt(savedProduct.getCreatedAt());
      productResponse.setUpdatedAt(savedProduct.getUpdatedAt());
    }

    @Test
    void should_create_product_successfully() {
      // Arrange
      when(categoryRepository.existsById(any(UUID.class))).thenReturn(true);
      when(productMapper.toEntity(any())).thenReturn(product);
      when(productRepository.save(any(Product.class))).thenReturn(savedProduct);
      when(productMapper.toResponse(any(Product.class))).thenReturn(productResponse);

      // Act
      ProductResponse response = productService.createProduct(createRequest);

      // Assert
      assertThat(response).isNotNull();
      assertThat(response.getId()).isNotNull();
      assertThat(response.getId()).isEqualTo(savedProduct.getId());
    }

    @Test
    void should_throw_resource_not_found_exception_when_category_does_not_exist() {
      // Arrange
      when(categoryRepository.existsById(any(UUID.class))).thenReturn(false);

      // Act & Assert
      try {
        productService.createProduct(createRequest);
      } catch (Exception e) {
        assertThat(e).isInstanceOf(ResourceNotFoundException.class);
        assertThat(e.getMessage()).contains("Category");
      }
    }
  }

  @Nested
  @DisplayName("Search Products Tests")
  class searchProducts {
    private List<Product> products;
    private List<ProductResponse> productResponses;

    @BeforeEach
    void setUp() {
      UUID categoryId = UUID.randomUUID();
      products = new ArrayList<Product>();
      productResponses = new ArrayList<ProductResponse>();
      LocalDateTime now = LocalDateTime.now();

      for (int i = 1; i <= 30; i++) {
        Product product = new Product();
        product.setId(UUID.randomUUID());
        if (i % 2 == 0) {
          product.setName("Product " + i);
        } else {
          product.setName("Phone " + i);
        }
        product.setDescription("Description for Product " + i);
        product.setPrice(new BigDecimal(100 + i));
        product.setSku("SKU-SMP" + i);
        product.setWeightKg(new BigDecimal(0.1 * i));
        product.setCategoryId(categoryId);
        product.setCreatedAt(now.minusMinutes(i));
        product.setUpdatedAt(now.minusMinutes(i));

        products.add(product);

        ProductResponse productResponse = new ProductResponse();
        productResponse.setId(product.getId());
        productResponse.setName(product.getName());
        productResponse.setDescription(product.getDescription());
        productResponse.setPrice(product.getPrice());
        productResponse.setSku(product.getSku());
        productResponse.setWeightKg(product.getWeightKg());
        productResponse.setCategoryId(product.getCategoryId());
        productResponse.setCreatedAt(product.getCreatedAt());
        productResponse.setUpdatedAt(product.getUpdatedAt());

        productResponses.add(productResponse);
      }
    }

    @Test
    void should_return_products_when_search_query_is_empty() {
      // Arrange
      String query = "";
      String cursor = null;
      int size = 10;

      when(productRepository.findTopProductsWithSearch(any(String.class), any(PageRequest.class)))
          .thenReturn(products.subList(0, size + 1));

      for (int i = 0; i < size; i++) {
        when(productMapper.toResponse(products.get(i)))
            .thenReturn(productResponses.get(i));
      }

      // Act
      CursorPageResponse<ProductResponse> response = productService.searchProducts(query, cursor, size);

      // Assert
      assertThat(response).isNotNull();
      assertThat(response.getClass()).isEqualTo(CursorPageResponse.class);
      assertThat(response.getItems()).isNotEmpty();
      assertThat(response.getNextCursor()).isNotNull();
      assertThat(response.isHasMore()).isTrue();
      assertThat(response.getSize()).isEqualTo(size);
    }

    @Test
    void should_return_products_when_search_query_is_not_empty() {
      // Arrange
      String query = "Product";
      String cursor = null;
      int size = 10;

      List<Product> filteredProducts = products.stream()
          .filter(p -> p.getName().toLowerCase().contains(query.toLowerCase()))
          .limit(size + 1)
          .toList();

      when(productRepository.findTopProductsWithSearch(any(String.class), any(PageRequest.class)))
          .thenReturn(filteredProducts);

      for (int i = 0; i < Math.min(filteredProducts.size(), size); i++) {
        Product product = filteredProducts.get(i);
        ProductResponse productResponse = productResponses.stream()
            .filter(pr -> pr.getId().equals(product.getId()))
            .findFirst()
            .orElse(null);

        when(productMapper.toResponse(product))
            .thenReturn(productResponse);
      }

      // Act
      CursorPageResponse<ProductResponse> response = productService.searchProducts(query, cursor, size);

      // Assert
      assertThat(response).isNotNull();
      assertThat(response.getClass()).isEqualTo(CursorPageResponse.class);
      assertThat(response.getItems()).isNotEmpty();

      for (ProductResponse productResponse : response.getItems()) {
        assertThat(productResponse.getName()).containsIgnoringCase(query);
      }
    }

    @Test
    void should_return_empty_response_when_no_products_found() {
      // Arrange
      String query = "NonExistentProduct";
      String cursor = null;
      int size = 10;

      when(productRepository.findTopProductsWithSearch(any(String.class), any(PageRequest.class)))
          .thenReturn(new ArrayList<>());
      // when(productMapper.toResponse(any(Product.class))).thenReturn(null);

      // Act
      CursorPageResponse<ProductResponse> response = productService.searchProducts(query, cursor, size);

      // Assert
      assertThat(response).isNotNull();
      assertThat(response.getItems()).isEmpty();
      assertThat(response.getNextCursor()).isNull();
      assertThat(response.isHasMore()).isFalse();
      assertThat(response.getSize()).isEqualTo(0);
    }
  }
}
