package dev.coregate.product.api.services;

import dev.coregate.product.api.dto.requests.CreateProductRequest;
import dev.coregate.product.api.dto.responses.ProductResponse;

public interface ProductService {  
  public ProductResponse createProduct(CreateProductRequest request);
}
