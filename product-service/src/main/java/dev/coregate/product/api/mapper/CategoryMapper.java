package dev.coregate.product.api.mapper;

import org.springframework.stereotype.Component;

import dev.coregate.product.api.dto.requests.CreateCategoryRequest;
import dev.coregate.product.api.dto.responses.CategoryResponse;
import dev.coregate.product.api.entities.Category;

@Component
public class CategoryMapper {
  
  public Category fromCreateToEntity(CreateCategoryRequest request) {
    Category category = new Category();
    category.setName(request.getName());
    category.setDescription(request.getDescription());
    return category;
  }

  public CategoryResponse fromEntityToResponse(Category category) {
    CategoryResponse response = new CategoryResponse();
    response.setId(category.getId());
    response.setName(category.getName());
    response.setDescription(category.getDescription());
    response.setCreatedAt(category.getCreatedAt());
    response.setUpdatedAt(category.getUpdatedAt());
    return response;
  }
}
