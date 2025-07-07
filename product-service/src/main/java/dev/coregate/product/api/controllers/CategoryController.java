package dev.coregate.product.api.controllers;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import dev.coregate.product.api.constants.SecurityConstants;
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
  
  public CategoryController(CategoryService categoryService) {
    this.categoryService = categoryService;
  }

  /**
   * Creates a new category.
   * This endpoint allows users with the "MANAGER" role to create a new category.
   * It accepts a CreateCategoryRequest object containing the category details.
   * 
   * @param request the request object containing category details
   * @see CreateCategoryRequest
   * @return ResponseEntity containing ApiResponse with CategoryResponse
   * @see ApiResponse
   * @see CategoryResponse
   */
  @PostMapping
  @PreAuthorize(SecurityConstants.HAS_MANAGER_ROLE)
  public ResponseEntity<ApiResponse<CategoryResponse>> createCategory(@Valid @RequestBody CreateCategoryRequest request) {
    CategoryResponse response = categoryService.createCategory(request);
    ApiResponse<CategoryResponse> apiResponse = ApiResponse.success("Category created successfully", response);
    return ResponseEntity.status(HttpStatus.CREATED).body(apiResponse);
  }

  /**
   * Retrieves all categories.
   * This endpoint allows users with the "MANAGER" role to retrieve a list of all categories.
   * 
   * @return ResponseEntity containing ApiResponse with a list of CategoryResponse
   * @see ApiResponse
   * @see CategoryResponse
   */
  @GetMapping
  @PreAuthorize(SecurityConstants.HAS_MANAGER_ROLE)
  public ResponseEntity<ApiResponse<List<CategoryResponse>>> getAllCategories() {
    List<CategoryResponse> responses = categoryService.getAllCategories();
    ApiResponse<List<CategoryResponse>> apiResponse = ApiResponse.success("Categories retrieved successfully", responses);
    return ResponseEntity.ok(apiResponse);
  }

  /**
   * Deletes a category by its ID.
   * This endpoint allows users with the "MANAGER" role to delete a category.
   * 
   * @param id the UUID of the category to be deleted
   * @return ResponseEntity containing ApiResponse with a success message
   * @see ApiResponse
   */
  @DeleteMapping("/{id}")
  @PreAuthorize(SecurityConstants.HAS_MANAGER_ROLE)
  public ResponseEntity<ApiResponse<Void>> deleteCategory(@PathVariable("id") UUID id) {
    categoryService.deleteCategory(id);
    ApiResponse<Void> apiResponse = ApiResponse.success("Category deleted successfully");
    return ResponseEntity.ok(apiResponse);
  }
}
