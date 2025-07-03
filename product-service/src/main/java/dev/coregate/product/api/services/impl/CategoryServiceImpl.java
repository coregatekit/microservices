package dev.coregate.product.api.services.impl;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import dev.coregate.product.api.dto.requests.CreateCategoryRequest;
import dev.coregate.product.api.dto.responses.CategoryResponse;
import dev.coregate.product.api.entities.Category;
import dev.coregate.product.api.mapper.impl.CategoryMapperImpl;
import dev.coregate.product.api.repositories.CategoryRepository;
import dev.coregate.product.api.services.CategoryService;
import jakarta.transaction.Transactional;

@Service
@Transactional
public class CategoryServiceImpl implements CategoryService {
  private final CategoryMapperImpl mapper;
  private final CategoryRepository categoryRepository;

  @Autowired
  public CategoryServiceImpl(CategoryMapperImpl mapper, CategoryRepository categoryRepository) {
    this.mapper = mapper;
    this.categoryRepository = categoryRepository;
  }

  /**
   * Creates a new category.
   * This method checks if a category with the same name already exists.
   * If it does, an IllegalArgumentException is thrown.
   * If not, it creates a new category and saves it to the repository.
   * @param request The request containing the category details.
   * @return The created category response.
   * @throws IllegalArgumentException if a category with the same name already exists.
   */
  public CategoryResponse createCategory(CreateCategoryRequest request) {
    Optional<Category> existingCategory = categoryRepository.findByName(request.getName());

    if (existingCategory.isPresent()) {
      throw new IllegalArgumentException("Category with name '" + request.getName() + "' already exists.");
    }

    Category category = mapper.toEntity(request);
    Category savedCategory = categoryRepository.save(category);

    return mapper.toResponse(savedCategory);
  }

  /**
   * Retrieves all categories.
   * This method is currently unimplemented and will throw an UnsupportedOperationException if called.
   * @return A list of all category responses.
   */
  public List<CategoryResponse> getAllCategories() {
    List<Category> categories = categoryRepository.findAll();
    return categories.stream().map(mapper::toResponse).toList();
  }

  @Override
  public void deleteCategory(UUID id) {
    if (!categoryRepository.existsById(id)) {
      throw new IllegalArgumentException("Category with ID '" + id + "' does not exist.");
    }

    categoryRepository.deleteById(id);
  }
}
