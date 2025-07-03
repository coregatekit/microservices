package dev.coregate.product.api.controllers;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import dev.coregate.product.api.dto.requests.CreateCategoryRequest;
import dev.coregate.product.api.dto.responses.ApiResponse;
import dev.coregate.product.api.dto.responses.CategoryResponse;
import dev.coregate.product.api.services.CategoryService;
import org.springframework.web.bind.annotation.RequestBody;
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
  @PreAuthorize("hasRole('MANAGER')")
  public ResponseEntity<ApiResponse<CategoryResponse>> createCategory(@Valid @RequestBody CreateCategoryRequest request) {
    CategoryResponse response = categoryService.createCategory(request);
    ApiResponse<CategoryResponse> apiResponse = ApiResponse.success("Category created successfully", response);
    return ResponseEntity.status(HttpStatus.CREATED).body(apiResponse);
  }

  @GetMapping
  @PreAuthorize("hasRole('MANAGER')")
  public ResponseEntity<ApiResponse<List<CategoryResponse>>> getAllCategories() {
    List<CategoryResponse> responses = categoryService.getAllCategories();
    ApiResponse<List<CategoryResponse>> apiResponse = ApiResponse.success("Categories retrieved successfully", responses);
    return ResponseEntity.ok(apiResponse);
  }

  @DeleteMapping("/{id}")
  @PreAuthorize("hasRole('MANAGER')")
  public ResponseEntity<ApiResponse<Void>> deleteCategory(@PathVariable("id") UUID id) {
    categoryService.deleteCategory(id);
    ApiResponse<Void> apiResponse = ApiResponse.success("Category deleted successfully");
    return ResponseEntity.ok(apiResponse);
  }
}
