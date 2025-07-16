package dev.coregate.product.api.builders;

import java.math.BigDecimal;
import java.util.UUID;

import dev.coregate.product.api.entities.Product;
import dev.coregate.product.api.repositories.CategoryRepository;

public class ProductUpdateBuilder {
  private final Product product;
  private CategoryRepository categoryRepository;

  public ProductUpdateBuilder(Product product, CategoryRepository categoryRepository) {
    this.product = product;
    this.categoryRepository = categoryRepository;
  }

  public ProductUpdateBuilder updateName(String name) {
    if (name != null && !name.isEmpty()) {
      this.product.setName(name);
    }
    return this;
  }

  public ProductUpdateBuilder updateDescription(String description) {
    if (description != null && !description.isEmpty()) {
      this.product.setDescription(description);
    }
    return this;
  }

  public ProductUpdateBuilder updatePrice(BigDecimal price) {
    if (price != null && price.compareTo(BigDecimal.ZERO) > 0) {
      this.product.setPrice(price);
    }
    return this;
  }

  public ProductUpdateBuilder updateWeightKg(BigDecimal weightKg) {
    if (weightKg != null && weightKg.compareTo(BigDecimal.ZERO) > 0) {
      this.product.setWeightKg(weightKg);
    }
    return this;
  }

  public ProductUpdateBuilder updateCategoryId(UUID categoryId) {
    if (categoryId != null) {
      if (categoryRepository.existsById(categoryId)) {
        this.product.setCategoryId(categoryId);
      } else {
        throw new IllegalArgumentException("Category with ID " + categoryId + " does not exist.");
      }
    }
    return this;
  }

  public Product build() {
    return product;
  }
}
