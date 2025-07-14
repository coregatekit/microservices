package dev.coregate.product.api.repositories;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import dev.coregate.product.api.entities.Product;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Repository interface for managing products.
 * This interface extends JpaRepository to provide CRUD operations for Product
 * entities.
 * It includes methods to find a product by its name or SKU.
 * This repository is used to interact with the database and perform operations
 * related to products.
 * The methods in this interface are used to retrieve, save, and delete
 * products.
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

    /**
     * Finds products based on a search query and pagination.
     * This method retrieves a list of products that match the search query.
     * It supports pagination using the Pageable parameter.
     * 
     * @param query    the search query string to filter products
     * @param pageable the pagination information
     * @return a list of products that match the search criteria
     */
    @Query("SELECT p FROM Product p WHERE " +
            "(:query IS NULL OR :query = '' OR LOWER(p.name) LIKE LOWER(CONCAT('%', :query, '%'))) " +
            "ORDER BY p.createdAt DESC, p.id DESC")
    List<Product> findTopProductsWithSearch(@Param("query") String query, Pageable pageable);

    /**
     * Finds products after a specific cursor timestamp.
     * This method retrieves products that were created before a specified cursor timestamp.
     * It supports pagination using the Pageable parameter.
     * 
     * @param query         the search query string to filter products
     * @param cursorCreatedAt the timestamp of the product to start from
     * @param pageable      the pagination information
     * @return a list of products that match the search criteria and were created before the cursor
     */
    @Query("SELECT p FROM Product p WHERE " +
            "p.createdAt < :cursorCreatedAt AND " +
            "(:query IS NULL OR :query = '' OR LOWER(p.name) LIKE LOWER(CONCAT('%', :query, '%'))) " +
            "ORDER BY p.createdAt DESC, p.id DESC")
    List<Product> findProductsAfterCursor(@Param("query") String query, 
                                        @Param("cursorCreatedAt") java.time.LocalDateTime cursorCreatedAt,
                                        Pageable pageable);

    default List<Product> findTopProductsWithSearch(String query, int size) {
        return findTopProductsWithSearch(query, PageRequest.of(0, size));
    }

    default List<Product> findProductsAfterCursor(String query, java.time.LocalDateTime cursorCreatedAt, int size) {
        return findProductsAfterCursor(query, cursorCreatedAt, PageRequest.of(0, size));
    }
}
