package dev.coregate.product.api.services;

import dev.coregate.product.api.dto.requests.CreateProductRequest;
import dev.coregate.product.api.dto.responses.CursorPageResponse;
import dev.coregate.product.api.dto.responses.ProductResponse;

public interface ProductService {

  /**
   * Creates a new product.
   * This method checks if the category exists before creating the product.
   * If the category does not exist, it throws a ResourceNotFoundException.
   * It maps the request to an entity, saves it to the repository, and returns the
   * ProductResponse.
   * @param request The request containing the product details.
   * @throws ResourceNotFoundException if the category with the given ID does not exist.
   * @return The created product response.
   * @see ProductResponse
   */
  public ProductResponse createProduct(CreateProductRequest request);

  /**
   * Searches for products based on a query string.
   * @param query the search query string to filter products.
   * @param cursor the cursor for pagination, used to fetch the next set of results.
   * @param size the maximum size of the result set to return.
   * @return a list of ProductResposnse objects that match the search criteria.
   * @see ProductResponse
   */
  public CursorPageResponse<ProductResponse> searchProducts(String query, String cursor, int size);
}
