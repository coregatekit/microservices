package dev.coregate.product.api.dto.responses;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

import lombok.Data;

/**
 * Response DTO for product details.
 * this class is used to encapsulate the data returned when a product is
 * retrieved.
 * It includes fields for the product ID, name, description, price, category ID,
 * and timestamps for creation and last update.
 */

@Data
public class ProductRespons {
  private UUID id;
  private UUID categoryId;
  private String name;
  private String description;
  private BigDecimal price;
  private String sku;
  private BigDecimal weightKg;
  private LocalDateTime createdAt;
  private LocalDateTime updatedAt;

  public ProductRespons() {
  }

  public ProductRespons(UUID id, UUID categoryId, String name, String description, BigDecimal price, String sku,
      BigDecimal weightKg, LocalDateTime createdAt, LocalDateTime updatedAt) {
    this.id = id;
    this.categoryId = categoryId;
    this.name = name;
    this.description = description;
    this.price = price;
    this.sku = sku;
    this.weightKg = weightKg;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
