package dev.coregate.product.api.services;

import java.util.List;
import java.util.UUID;

import dev.coregate.product.api.dto.requests.CreateCategoryRequest;
import dev.coregate.product.api.dto.responses.CategoryResponse;

public interface CategoryService {

  /**
   * Creates a new category.
   * This method checks if a category with the same name already exists.
   * If it does, an IllegalArgumentException is thrown.
   * If not, it creates a new category and saves it to the repository.
   * @param request The request containing the category details.
   * @return The created category response.
   * @throws IllegalArgumentException if a category with the same name already exists.
   * @see CategoryResponse
   */
  public CategoryResponse createCategory(CreateCategoryRequest request);  

  /**
   * Retrieves all categories.
   * This method fetches all categories from the repository and returns them as a list of CategoryResponse objects.
   * @return A list of all category responses.
   * @see CategoryResponse
   */
  public List<CategoryResponse> getAllCategories();

  /**
   * Deletes a category by its ID.
   * This method will throw an exception if the category does not exist.
   * It is used to remove a category from the system.
   * @param id The UUID of the category to be deleted.
   * @throws ResourceNotFoundException if the category with the given ID does not exist.
   * @return void
   */
  public void deleteCategory(UUID id);
}
