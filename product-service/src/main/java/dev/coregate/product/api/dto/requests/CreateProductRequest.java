package dev.coregate.product.api.dto.requests;

import java.math.BigDecimal;
import java.util.UUID;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * Request DTO for creating a new product.
 * This class is used to encapsulate the data required to create a new product.
 */

@Data
public class CreateProductRequest {

  @NotBlank(message = "Name is required")
  @Size(max = 255, message = "Name must be at most 255 characters long")
  private String name;

  @Size(max = 500, message = "Description must be at most 500 characters long")
  private String description;

  @NotBlank(message = "SKU is required")
  @Size(max = 50, message = "SKU must be at most 50 characters long")
  private String sku;

  @NotBlank(message = "Price is required")
  private BigDecimal price;

  @NotBlank(message = "Weight is required")
  private BigDecimal weightKg;

  @NotBlank(message = "Category ID is required")
  private UUID categoryId;

  public CreateProductRequest() {
  }

  public CreateProductRequest(String name, String description, String sku, BigDecimal price, BigDecimal weightKg,
      UUID categoryId) {
    this.name = name;
    this.description = description;
    this.sku = sku;
    this.price = price;
    this.weightKg = weightKg;
    this.categoryId = categoryId;
  }
}
