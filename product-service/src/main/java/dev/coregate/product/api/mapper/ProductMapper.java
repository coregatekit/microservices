package dev.coregate.product.api.mapper;

import dev.coregate.product.api.dto.requests.CreateProductRequest;
import dev.coregate.product.api.dto.responses.ProductResponse;
import dev.coregate.product.api.entities.Product;

public interface ProductMapper {

  /**
   * Converts a CreateProductRequest to a Product entity.
   * 
   * @param request the CreateProductRequest to convert
   * @return the converted Product entity
   */
  Product toEntity(CreateProductRequest request);

  /**
   * Converts a Product entity to a ProductResponse DTO.
   * 
   * @param product the Product entity to convert
   * @return the converted ProductResponse DTO
   */
  ProductResponse toResponse(Product product);
}
