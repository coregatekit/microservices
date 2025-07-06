package dev.coregate.product.api.mapper.impl;

import org.springframework.stereotype.Component;

import dev.coregate.product.api.dto.requests.CreateProductRequest;
import dev.coregate.product.api.dto.responses.ProductResponse;
import dev.coregate.product.api.entities.Product;
import dev.coregate.product.api.mapper.ProductMapper;

@Component
public class ProductMapperImpl implements ProductMapper {

  @Override
  public Product toEntity(CreateProductRequest request) {
    Product product = new Product();
    product.setName(request.getName());
    product.setDescription(request.getDescription());
    product.setPrice(request.getPrice());
    product.setSku(request.getSku());
    product.setWeightKg(request.getWeightKg());
    product.setCategoryId(request.getCategoryId());
    return product;
  }

  @Override
  public ProductResponse toResponse(Product product) {
    ProductResponse response = new ProductResponse();
    response.setId(product.getId());
    response.setName(product.getName());
    response.setDescription(product.getDescription());
    response.setPrice(product.getPrice());
    response.setSku(product.getSku());
    response.setWeightKg(product.getWeightKg());
    response.setCategoryId(product.getCategoryId());
    response.setCreatedAt(product.getCreatedAt());
    response.setUpdatedAt(product.getUpdatedAt());
    return response;
  }

}
