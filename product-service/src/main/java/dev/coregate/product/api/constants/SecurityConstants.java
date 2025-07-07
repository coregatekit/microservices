package dev.coregate.product.api.constants;

/**
 * SecurityConstants provides constants for role-based access control.
 * These constants are used to define security rules in the application.
 */

public final class SecurityConstants {
  public static final String HAS_MANAGER_ROLE = "hasRole('" + "MANAGER" + "')";
  public static final String HAS_USER_ROLE = "hasRole('" + "USER" + "')";
  public static final String HAS_ADMIN_ROLE = "hasRole('" + "ADMIN" + "')";

  private SecurityConstants() {
    // Prevent instantiation
  }
}
