package dev.coregate.product.api.dto.requests;

import java.math.BigDecimal;
import java.util.UUID;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * Request DTO for updating a product.
 * This class is used to encapsulate the data required to update an existing
 * product.
 * The fields can be optional, allowing partial updates to the product.
 */

@Data
public class UpdateProductRequest {

  @Size(min = 1, max = 255, message = "Name must be between 1 and 255 characters long")
  private String name;

  @Size(max = 500, message = "Description must be at most 500 characters long")
  private String description;

  // SKU is not allowed to be updated, so it is not included here.

  @DecimalMin(value = "0.01", message = "Price must be greater than 0")
  private BigDecimal price;

  @DecimalMin(value = "0.01", message = "Weight must be greater than 0")
  private BigDecimal weightKg;

  private UUID categoryId;

  public UpdateProductRequest() {
  }

  public UpdateProductRequest(String name, String description, BigDecimal price, BigDecimal weightKg,
      UUID categoryId) {
    this.name = name;
    this.description = description;
    this.price = price;
    this.weightKg = weightKg;
    this.categoryId = categoryId;
  }
}
