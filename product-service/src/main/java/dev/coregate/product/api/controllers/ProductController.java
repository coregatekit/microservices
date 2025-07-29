package dev.coregate.product.api.controllers;

import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import dev.coregate.product.api.annotations.PublicEndpoint;
import dev.coregate.product.api.constants.SecurityConstants;
import dev.coregate.product.api.dto.requests.CreateProductRequest;
import dev.coregate.product.api.dto.requests.UpdateProductRequest;
import dev.coregate.product.api.dto.responses.ApiResponse;
import dev.coregate.product.api.dto.responses.CursorPageResponse;
import dev.coregate.product.api.dto.responses.ProductResponse;
import dev.coregate.product.api.services.ProductService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/products")
public class ProductController {

  private final ProductService productService;

  public ProductController(ProductService productService) {
    this.productService = productService;
  }

  /**
   * Creates a new product.
   * This endpoint allows users with the "MANAGER" role to create a new product.
   * It accepts a CreateProductRequest object containing the product details.
   * 
   * @param request the request object containing product details
   * @see CreateProductRequest
   * @return ResponseEntity containing ApiResponse with ProductResponse
   * @see ApiResponse
   * @see ProductResponse
   */
  @PostMapping
  @PreAuthorize(SecurityConstants.HAS_MANAGER_ROLE)
  public ResponseEntity<ApiResponse<ProductResponse>> createProduct(@Valid @RequestBody CreateProductRequest request) {
    ProductResponse response = productService.createProduct(request);
    ApiResponse<ProductResponse> apiResponse = ApiResponse.success("Product created successfully", response);
    return ResponseEntity.status(HttpStatus.CREATED).body(apiResponse);
  }

  /**
   * Search products with cursor-based pagination.
   * This endpoint allows users to search for products based on a query string.
   * It supports cursor-based pagination to efficiently navigate through large
   * datasets.
   * This is a public endpoint that doesn't require authentication.
   * 
   * @param query  the search query string
   * @param cursor the cursor for pagination, can be null or empty for the first
   *               page
   * @param size   the number of products to return per page
   * @return ResponseEntity containing ApiResponse with CursorPageResponse of
   *         ProductResponse
   * @see ApiResponse
   * @see CursorPageResponse
   * @see ProductResponse
   */
  @GetMapping("/search")
  @PublicEndpoint
  public ResponseEntity<ApiResponse<CursorPageResponse<ProductResponse>>> searchProducts(
      @RequestParam(value = "query", required = false) String query,
      @RequestParam(value = "cursor", required = false) String cursor,
      @RequestParam(value = "size", defaultValue = "10") int size) {

    if (size <= 0 || size > 100) {
      size = 10; // Default size if invalid
    }

    CursorPageResponse<ProductResponse> response = productService.searchProducts(query, cursor, size);
    ApiResponse<CursorPageResponse<ProductResponse>> apiResponse = ApiResponse
        .success("Products retrieved successfully", response);
    return ResponseEntity.ok(apiResponse);
  }

  /**
   * Updates partial product details.
   * This endpoint allows users with the "MANAGER" role to update an existing
   * product.
   * It accepts a ProductUpdateRequest object containing the updated product
   * details.
   * 
   * @param request the request object containing updated product details
   * @see UpdateProductRequest
   * @return ResponseEntity containing ApiResponse with ProductResponse
   * @see ApiResponse
   * @see ProductResponse
   */
  @PatchMapping("/{productId}")
  @PreAuthorize(SecurityConstants.HAS_MANAGER_ROLE)
  public ResponseEntity<ApiResponse<ProductResponse>> updateProduct(
      @PathVariable("productId") UUID productId,
      @RequestBody @Valid UpdateProductRequest request) {
    ProductResponse response = productService.updateProduct(productId, request);
    ApiResponse<ProductResponse> apiResponse = ApiResponse.success("Product updated successfully", response);
    return ResponseEntity.ok(apiResponse);
  }
}
