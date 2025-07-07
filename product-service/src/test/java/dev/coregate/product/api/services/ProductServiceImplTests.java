package dev.coregate.product.api.services;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import dev.coregate.product.api.dto.requests.CreateProductRequest;
import dev.coregate.product.api.dto.responses.ProductResponse;
import dev.coregate.product.api.entities.Product;
import dev.coregate.product.api.mapper.ProductMapper;
import dev.coregate.product.api.repositories.ProductRepository;
import dev.coregate.product.api.services.impl.ProductServiceImpl;

@ExtendWith(MockitoExtension.class)
public class ProductServiceImplTests {

  @Mock
  private ProductRepository productRepository;

  @Mock
  private ProductMapper productMapper;

  @InjectMocks
  private ProductServiceImpl productService;

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
}
