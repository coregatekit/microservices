package dev.coregate.product.api.dto.requests;

import java.math.BigDecimal;
import java.util.UUID;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
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

  @NotNull(message = "Price is required")
  @Positive(message = "Price must be greater than 0")
  private BigDecimal price;

  @NotNull(message = "Weight is required")
  @Positive(message = "Weight must be greater than 0")
  private BigDecimal weightKg;

  @NotNull(message = "Category ID is required")
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
