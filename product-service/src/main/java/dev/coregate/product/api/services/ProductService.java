package dev.coregate.product.api.services;

import dev.coregate.product.api.dto.requests.CreateProductRequest;
import dev.coregate.product.api.dto.responses.ProductRespons;

public interface ProductService {  
  public ProductRespons createProduct(CreateProductRequest request);
}
