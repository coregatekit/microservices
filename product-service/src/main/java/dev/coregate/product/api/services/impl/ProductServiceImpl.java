package dev.coregate.product.api.services.impl;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Base64;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import dev.coregate.product.api.builders.ProductUpdateBuilder;
import dev.coregate.product.api.dto.requests.CreateProductRequest;
import dev.coregate.product.api.dto.requests.UpdateProductRequest;
import dev.coregate.product.api.dto.responses.CursorPageResponse;
import dev.coregate.product.api.dto.responses.ProductResponse;
import dev.coregate.product.api.entities.Product;
import dev.coregate.product.api.exceptions.ResourceNotFoundException;
import dev.coregate.product.api.mapper.ProductMapper;
import dev.coregate.product.api.repositories.CategoryRepository;
import dev.coregate.product.api.repositories.ProductRepository;
import dev.coregate.product.api.services.ProductService;
import jakarta.transaction.Transactional;

@Service
@Transactional
public class ProductServiceImpl implements ProductService {
  private final ProductRepository productRepository;
  private final ProductMapper productMapper;
  private final CategoryRepository categoryRepository;

  public ProductServiceImpl(ProductRepository productRepository, ProductMapper productMapper,
      CategoryRepository categoryRepository) {
    this.productRepository = productRepository;
    this.productMapper = productMapper;
    this.categoryRepository = categoryRepository;
  }

  @Override
  public ProductResponse createProduct(CreateProductRequest request) {
    boolean categoryExists = categoryRepository.existsById(request.getCategoryId());

    if (!categoryExists) {
      throw new ResourceNotFoundException("Category", "id", request.getCategoryId());
    }

    Product product = productMapper.toEntity(request);
    Product savedProduct = productRepository.save(product);
    return productMapper.toResponse(savedProduct);
  }

  @Override
  public CursorPageResponse<ProductResponse> searchProducts(String query, String cursor, int size) {
    List<Product> products = new ArrayList<>();

    try {
      if (cursor == null || cursor.isEmpty()) {
        // First page - get the size + 1 to check if there are more products
        products = productRepository.findTopProductsWithSearch(query, PageRequest.of(0, size + 1));
      } else {
        String decodedCursor = new String(Base64.getDecoder().decode(cursor));
        LocalDateTime cursorDateTime = LocalDateTime.parse(decodedCursor, DateTimeFormatter.ISO_LOCAL_DATE_TIME);

        // Next page - get products after the cursor timestamp
        products = productRepository.findProductsAfterCursor(query, cursorDateTime, PageRequest.of(0, size + 1));
      }
    } catch (Exception e) {
      return new CursorPageResponse<>(Collections.emptyList(), null, false, 0);
    }

    // Check if there are more products
    boolean hasMore = products.size() > size;

    // If there are more products, remove the extra one
    if (hasMore) {
      products = products.subList(0, size);
    }

    // Generate the next cursor using the last product's createdAt timestamp
    String nextCursor = null;
    if (!products.isEmpty() && hasMore) {
      LocalDateTime last = products.get(products.size() - 1).getCreatedAt();
      String timestampStr = last.format(DateTimeFormatter.ISO_LOCAL_DATE_TIME);
      nextCursor = Base64.getEncoder().encodeToString(timestampStr.getBytes());
    }

    CursorPageResponse<ProductResponse> response = new CursorPageResponse<ProductResponse>();
    response.setItems(products.stream().map(productMapper::toResponse).toList());
    response.setHasMore(hasMore);
    response.setNextCursor(nextCursor);
    response.setSize(products.size());
    return response;
  }

  @Override
  public ProductResponse updateProduct(UUID productId, UpdateProductRequest request) {
    Optional<Product> existingProduct = productRepository.findById(productId);
    if (existingProduct.isEmpty()) {
      throw new ResourceNotFoundException("Product with ID " + productId + " does not exist.");
    }

    Product prepareUpdateProduct = new ProductUpdateBuilder(existingProduct.get(), categoryRepository)
        .updateName(request.getName())
        .updateDescription(request.getDescription())
        .updatePrice(request.getPrice())
        .updateWeightKg(request.getWeightKg())
        .updateCategoryId(request.getCategoryId())
        .build();

    return productMapper.toResponse(productRepository.save(prepareUpdateProduct));
  }
}
