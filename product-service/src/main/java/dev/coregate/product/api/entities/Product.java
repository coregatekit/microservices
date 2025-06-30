package dev.coregate.product.api.entities;

import java.time.LocalDateTime;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "products")
public class Product {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private UUID id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "category_id", nullable = false)
  private Category category;

  @Column(name = "name", nullable = false, length = 255)
  private String name;

  @Column(name = "description", nullable = true, length = 500)
  private String description;

  @Column(name = "price", nullable = false)
  private Double price;

  @Column(name = "sku", nullable = false, unique = true, length = 50)
  private String sku;

  @Column(name = "weight_kg", nullable = false)
  private Double weightKg;

  @Column(name = "created_at", nullable = false)
  private LocalDateTime createdAt;

  @Column(name = "updated_at", nullable = false)
  private LocalDateTime updatedAt;

  public UUID getCategoryId() {
    return category != null ? category.getId() : null;
  }

  @PrePersist
  protected void onCreate() {
    LocalDateTime now = LocalDateTime.now();
    this.createdAt = now;
    this.updatedAt = now;
  }

  @PreUpdate
  protected void onUpdate() {
    this.updatedAt = LocalDateTime.now();
  }

  public Product() {
  }

  public Product(Category category, String name, String description, Double price, String sku, Double weightKg) {
    this.category = category;
    this.name = name;
    this.description = description;
    this.price = price;
    this.sku = sku;
    this.weightKg = weightKg;
  }
}
