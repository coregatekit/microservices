package dev.coregate.product.api.dto.responses;

import java.time.LocalDateTime;
import java.util.UUID;

import lombok.Data;

@Data
public class CategoryResponse {
  private UUID id;
  private String name;
  private String description;
  private LocalDateTime createdAt;
  private LocalDateTime updatedAt;

  public CategoryResponse() {
  }

  public CategoryResponse(UUID id, String name, String description, LocalDateTime createdAt, LocalDateTime updatedAt) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
