package dev.coregate.product.api.repositories;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import dev.coregate.product.api.entities.Category;

/**
 * Repository interface for managing categories.
 * This interface extends JpaRepository to provide CRUD operations for Category
 * entities.
 * It includes a method to find a category by its name.
 * This repository is used to interact with the database and perform operations
 * related to categories.
 * The methods in this interface are used to retrieve, save, and delete
 * categories.
 */

@Repository
public interface CategoryRepository extends JpaRepository<Category, UUID> {

    /**
     * Finds a category by its name.
     * This method is used to retrieve a category based on its name.
     * If a category with the specified name does not exist, it returns an empty
     * Optional.
     * 
     * @param name
     * @return an Optional containing the found category, or an empty Optional if no
     *         category is found
     */
    Optional<Category> findByName(String name);
}
