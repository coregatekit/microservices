package dev.coregate.product.api.services.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import dev.coregate.product.api.dto.requests.CreateCategoryRequest;
import dev.coregate.product.api.dto.responses.CategoryResponse;
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

  public CategoryResponse createCategory(CreateCategoryRequest request) {
    throw new UnsupportedOperationException("Unimplemented method 'createCategory'");
  }
}
