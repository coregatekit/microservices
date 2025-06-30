package dev.coregate.product.api.mapper;

import org.springframework.stereotype.Component;

import dev.coregate.product.api.dto.requests.CreateCategoryRequest;
import dev.coregate.product.api.dto.responses.CategoryResponse;
import dev.coregate.product.api.entities.Category;

/**
 * Mapper class for converting between CreateCategoryRequest, Category entity,
 * and CategoryResponse.
 * This class is responsible for mapping the fields from the request to the
 * entity and vice versa.
 * It is used in the service layer to handle the conversion logic.
 * This class is annotated with @Component to allow Spring to manage it as a
 * bean.
 * This allows it to be injected into other components, such as services.
 * The methods in this class are used to convert a CreateCategoryRequest to a
 * Category entity
 * and a Category entity to a CategoryResponse.
 */

@Component
public class CategoryMapper {

  /**
   * Converts a CreateCategoryRequest to a Category entity.
   * This method is used to map the fields from the request to the entity.
   * It sets the name and description of the category based on the request.
   * 
   * @param request the request containing the category details
   * @return a Category entity with the name and description set
   */
  public Category fromCreateToEntity(CreateCategoryRequest request) {
    Category category = new Category();
    category.setName(request.getName());
    category.setDescription(request.getDescription());
    return category;
  }

  /**
   * Converts a Category entity to a CategoryResponse.
   * This method is used to map the fields from the entity to the response.
   * It sets the id, name, description, createdAt, and updatedAt fields of the
   * response.
   * 
   * @param category the category entity to convert
   * @return a CategoryResponse with the mapped fields
   */
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
