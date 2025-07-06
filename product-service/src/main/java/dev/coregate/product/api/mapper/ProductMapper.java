package dev.coregate.product.api.mapper;

import dev.coregate.product.api.dto.requests.CreateProductRequest;
import dev.coregate.product.api.entities.Product;

public interface ProductMapper {

  /**
   * Converts a CreateProductRequest to a Product entity.
   * 
   * @param request the CreateProductRequest to convert
   * @return the converted Product entity
   */
  Product toEntity(CreateProductRequest request);
}
