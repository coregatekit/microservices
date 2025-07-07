package dev.coregate.product.api.services;

import java.util.List;
import java.util.UUID;

import dev.coregate.product.api.dto.requests.CreateCategoryRequest;
import dev.coregate.product.api.dto.responses.CategoryResponse;

public interface CategoryService {
  public CategoryResponse createCategory(CreateCategoryRequest request);  
  public List<CategoryResponse> getAllCategories();
  public void deleteCategory(UUID id);
  public boolean existsById(UUID id);
}
