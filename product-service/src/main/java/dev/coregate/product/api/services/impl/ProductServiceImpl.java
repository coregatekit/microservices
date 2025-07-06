package dev.coregate.product.api.services.impl;

import org.springframework.stereotype.Service;

import dev.coregate.product.api.dto.requests.CreateProductRequest;
import dev.coregate.product.api.dto.responses.ProductResponse;
import dev.coregate.product.api.services.ProductService;
import jakarta.transaction.Transactional;

@Service
@Transactional
public class ProductServiceImpl implements ProductService {

  @Override
  public ProductResponse createProduct(CreateProductRequest request) {
    // TODO Auto-generated method stub
    throw new UnsupportedOperationException("Unimplemented method 'createProduct'");
  }
}
