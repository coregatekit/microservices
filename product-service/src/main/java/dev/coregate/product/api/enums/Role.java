package dev.coregate.product.api.enums;

public enum Role {
  MANAGER("ROLE_MANAGER"), 
  USER("ROLE_USER");

  private final String authority;

  Role(String authority) {
    this.authority = authority;
  }

  public String getAuthority() {
    return authority;
  }
  public String getRoleName() {
    return this.name();
  }

  public boolean matches(String roleName) {
    return this.name().equalsIgnoreCase(roleName);
  }
}
