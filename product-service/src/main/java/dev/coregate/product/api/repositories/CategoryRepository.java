package dev.coregate.product.api.repositories;

import java.util.UUID;
import java.util.Locale.Category;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRepository extends JpaRepository<Category, UUID> {
    // Custom query methods can be defined here if needed
    // For example, find by name or other attributes
    Category findByName(String name);
}
