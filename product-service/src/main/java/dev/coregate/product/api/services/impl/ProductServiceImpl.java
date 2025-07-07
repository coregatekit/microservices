package dev.coregate.product.api.services.impl;

import org.springframework.stereotype.Service;

import dev.coregate.product.api.dto.requests.CreateProductRequest;
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

  /**
   * Creates a new product.
   * This method is created to handle the creation of a product.
   * It maps the request to an entity, saves it to the repository, and returns the
   * ProductResponse.
   * 
   * @param request The request containing the product details.
   * @return The created product response.
   */
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
}
