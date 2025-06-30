package dev.coregate.product.api.services;

import dev.coregate.product.api.dto.requests.CreateCategoryRequest;
import dev.coregate.product.api.dto.responses.CategoryResponse;

public interface CategoryService {
  public CategoryResponse createCategory(CreateCategoryRequest request);  
}
