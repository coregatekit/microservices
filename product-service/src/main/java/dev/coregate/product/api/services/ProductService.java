package dev.coregate.product.api.services;

import dev.coregate.product.api.dto.requests.CreateProductRequest;
import dev.coregate.product.api.dto.responses.ProductResponse;

public interface ProductService {

  /**
   * Creates a new product.
   * This method checks if the category exists before creating the product.
   * If the category does not exist, it throws a ResourceNotFoundException.
   * It maps the request to an entity, saves it to the repository, and returns the
   * ProductResponse.
   * @param request The request containing the product details.
   * @throws ResourceNotFoundException if the category with the given ID does not exist.
   * @return The created product response.
   */
  public ProductResponse createProduct(CreateProductRequest request);
}
