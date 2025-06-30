package dev.coregate.product.api.repositories;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import dev.coregate.product.api.entities.Category;

@Repository
public interface CategoryRepository extends JpaRepository<Category, UUID> {
    // Custom query methods can be defined here if needed
    // For example, find by name or other attributes
    Category findByName(String name);
}
