package dev.coregate.product.api.dto.requests;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * Request DTO for creating a new category.
 * This class is used to encapsulate the data required to create a new category.
 * It includes validation annotations to ensure that the name and description
 * fields meet specific criteria.
 */

@Data
public class CreateCategoryRequest {
  @NotBlank(message = "Name is required")
  @Size(max = 255, message = "Name must be at most 50 characters long")
  private String name;

  @Size(max = 500, message = "Description must be at most 500 characters long")
  private String description;

  public CreateCategoryRequest() {
  }

  public CreateCategoryRequest(String name, String description) {
    this.name = name;
    this.description = description;
  }
}
