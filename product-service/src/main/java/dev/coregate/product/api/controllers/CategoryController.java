package dev.coregate.product.api.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import dev.coregate.product.api.dto.requests.CreateCategoryRequest;
import dev.coregate.product.api.dto.responses.CategoryResponse;
import dev.coregate.product.api.services.CategoryService;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/categories")
public class CategoryController {

  private final CategoryService categoryService;
  
  @Autowired
  public CategoryController(CategoryService categoryService) {
    this.categoryService = categoryService;
  }

  @PostMapping
  public ResponseEntity<CategoryResponse> createCategory(@Valid @RequestBody CreateCategoryRequest request) {
    CategoryResponse response = categoryService.createCategory(request);
    return ResponseEntity.status(HttpStatus.CREATED).body(response);
  }
}
