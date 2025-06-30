package dev.coregate.product.api.repositories;

import java.util.Optional;
import java.util.UUID;
import dev.coregate.product.api.entities.Product;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repository interface for managing products.
 * This interface extends JpaRepository to provide CRUD operations for Product
 * entities.
 * It includes methods to find a product by its name or SKU.
 * This repository is used to interact with the database and perform operations
 * related to products.
 * The methods in this interface are used to retrieve, save, and delete products.
 */

@Repository
public interface ProductRepository extends JpaRepository<Product, UUID> {

    /**
     * Finds a product by its name or SKU.
     * This method is used to retrieve a product based on its name.
     * If a product with the specified name does not exist, it returns null.
     * 
     * @param name the name of the product to search for
     * @param sku  the SKU of the product to search for
     * @return an Optional containing the found product, or an empty Optional if no
     *         product is found
     */
    Optional<Product> findByName(String name);

    Optional<Product> findBySku(String sku);
}
