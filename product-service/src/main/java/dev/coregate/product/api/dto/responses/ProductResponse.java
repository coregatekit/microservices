package dev.coregate.product.api.dto.responses;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.Data;

/**
 * Response DTO for product details.
 * this class is used to encapsulate the data returned when a product is
 * retrieved.
 * It includes fields for the product ID, name, description, price, category ID,
 * and timestamps for creation and last update.
 */

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ProductResponse {
  private UUID id;
  private String name;
  private String description;
  private BigDecimal price;
  private String sku;
  private BigDecimal weightKg;
  private UUID categoryId;
  private CategoryResponse category; // Optional, if category details are needed
  private LocalDateTime createdAt;
  private LocalDateTime updatedAt;

  public ProductResponse() {
    // Default constructor
  }

  public ProductResponse(UUID id, String name, String description, BigDecimal price, String sku,
      BigDecimal weightKg, UUID categoryId, CategoryResponse category, LocalDateTime createdAt,
      LocalDateTime updatedAt) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.price = price;
    this.sku = sku;
    this.weightKg = weightKg;
    this.categoryId = categoryId;
    this.category = category;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

}
