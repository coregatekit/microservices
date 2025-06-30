package dev.coregate.product.api.mapper;

import dev.coregate.product.api.dto.requests.CreateCategoryRequest;
import dev.coregate.product.api.dto.responses.CategoryResponse;
import dev.coregate.product.api.entities.Category;

public interface CategoryMapper {
  /**
   * Converts a CreateCategoryRequest to a Category entity.
   *
   * @param request the CreateCategoryRequest to convert
   * @return the converted Category entity
   */
  Category toEntity(CreateCategoryRequest request);

  /**
   * Converts a Category entity to a CategoryResponse.
   *
   * @param category the Category entity to convert
   * @return the converted CategoryResponse
   */
  CategoryResponse toResponse(Category category);
}
