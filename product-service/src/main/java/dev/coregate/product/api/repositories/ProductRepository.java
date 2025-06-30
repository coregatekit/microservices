package dev.coregate.product.api.repositories;

import java.util.UUID;
import dev.coregate.product.api.entities.Product;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends JpaRepository<Product, UUID> {

    // Custom query methods can be defined here if needed
    // For example, find by name, category, or other attributes
    Product findByName(String name);
    Product findBySku(String sku);
}
