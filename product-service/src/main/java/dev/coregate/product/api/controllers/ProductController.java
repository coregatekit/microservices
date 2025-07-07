package dev.coregate.product.api.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import dev.coregate.product.api.constants.SecurityConstants;
import dev.coregate.product.api.dto.requests.CreateProductRequest;
import dev.coregate.product.api.dto.responses.ApiResponse;
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
}
