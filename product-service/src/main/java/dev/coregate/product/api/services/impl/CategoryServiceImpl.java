package dev.coregate.product.api.services.impl;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import dev.coregate.product.api.dto.requests.CreateCategoryRequest;
import dev.coregate.product.api.dto.responses.CategoryResponse;
import dev.coregate.product.api.entities.Category;
import dev.coregate.product.api.mapper.CategoryMapper;
import dev.coregate.product.api.repositories.CategoryRepository;
import dev.coregate.product.api.services.CategoryService;
import jakarta.transaction.Transactional;

@Service
@Transactional
public class CategoryServiceImpl implements CategoryService {
  private final CategoryMapper mapper;
  private final CategoryRepository categoryRepository;

  @Autowired
  public CategoryServiceImpl(CategoryMapper mapper, CategoryRepository categoryRepository) {
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

    Category category = mapper.fromCreateToEntity(request);
    Category savedCategory = categoryRepository.save(category);

    return mapper.fromEntityToResponse(savedCategory);
  }
}
