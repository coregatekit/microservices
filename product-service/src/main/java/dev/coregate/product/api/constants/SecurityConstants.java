package dev.coregate.product.api.constants;

public final class SecurityConstants {
  public static final String HAS_MANAGER_ROLE = "hasRole('" + "MANAGER" + "')";
  public static final String HAS_USER_ROLE = "hasRole('" + "USER" + "')";
  public static final String HAS_ADMIN_ROLE = "hasRole('" + "ADMIN" + "')";

  private SecurityConstants() {
    // Prevent instantiation
  }
}
