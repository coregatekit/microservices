package dev.coregate.product.api.dto.responses;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.Data;

/**
 * Generic API response wrapper that provides a consistent response format
 * across all endpoints in the application.
 * 
 * @param <T> The type of data being returned
 */
@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse<T> {
    private String status;
    private String message;
    private T data;

    public ApiResponse() {
    }

    public ApiResponse(String status, String message, T data) {
        this.status = status;
        this.message = message;
        this.data = data;
    }

    /**
     * Creates a successful response with data
     */
    public static <T> ApiResponse<T> success(String message, T data) {
        return new ApiResponse<>("success", message, data);
    }

    /**
     * Creates a successful response without data
     */
    public static <T> ApiResponse<T> success(String message) {
        return new ApiResponse<>("success", message, null);
    }

    /**
     * Creates an error response
     */
    public static <T> ApiResponse<T> error(String message) {
        return new ApiResponse<>("error", message, null);
    }

    /**
     * Creates an error response with data
     */
    public static <T> ApiResponse<T> error(String message, T data) {
        return new ApiResponse<>("error", message, data);
    }
}
