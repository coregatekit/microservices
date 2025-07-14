package dev.coregate.product.api.configs;

import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

  @Autowired
  private PublicEndpointCollector publicEndpointCollector;

  /**
   * Configures API security settings including CSRF, session management
   * abd JWT-based authentication using OAuth2 Resource Server.
   * Public endpoints are automatically detected using @PublicEndpoint annotation.
   * 
   * @param http the HttpSecurity to configure
   * @return configured SecurityFilterChain
   * @throws Exception if configuration fails
   * @see SecurityFilterChain
   */
  @Bean
  public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    // Get public endpoints from annotation scanning
    List<String> publicEndpoints = publicEndpointCollector.getPublicEndpoints();
    String[] publicEndpointArray = publicEndpoints.toArray(new String[0]);
    
    http.csrf(csrf -> csrf.disable())
        .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        .authorizeHttpRequests(authorize -> authorize
            .requestMatchers(publicEndpointArray).permitAll() // Allow public access to annotated endpoints
            .anyRequest().authenticated())
        .oauth2ResourceServer(oauth2 -> oauth2
            .jwt(jwt -> jwt.jwtAuthenticationConverter(jwtAuthenticationConverter()))
            .authenticationEntryPoint((request, response, ex) -> {
              // Allow anonymous access for public endpoints
              response.setStatus(401);
            }))
        .anonymous(anonymous -> anonymous.disable()); // Disable anonymous to use permitAll properly

    return http.build();
  }

  /**
   * Converts JWT Claims to Granted Authorities.
   * This method extracts roles from the JWT's realm_access claim
   * and maps them to SimpleGrantedAuthority with "ROLE_" prefix.
   * 
   * @return JwtAuthenticationConverter configured to convert JWT claims
   *        to Granted Authorities.
   * @see JwtAuthenticationConverter
   */
  @Bean
  public JwtAuthenticationConverter jwtAuthenticationConverter() {
    JwtAuthenticationConverter converter = new JwtAuthenticationConverter();
    converter.setJwtGrantedAuthoritiesConverter(jwt -> {
      Object realmAccessObj = jwt.getClaims().get("realm_access");
      
      // Handle missing or invalid realm_access claim
      if (!(realmAccessObj instanceof Map)) {
        return java.util.Collections.emptyList();
      }

      @SuppressWarnings("unchecked")
      Map<String, Object> realmAccess = (Map<String, Object>) realmAccessObj;

      Object rolesObj = realmAccess.get("roles");
      if (!(rolesObj instanceof Collection)) {
        return java.util.Collections.emptyList();
      }

      // Convert roles to Granted Authorities with "ROLE_" prefix
      @SuppressWarnings("unchecked")
      Collection<String> roles = (Collection<String>) rolesObj;
      return roles.stream()
          .map(role -> new SimpleGrantedAuthority("ROLE_" + role.toUpperCase())).collect(Collectors.toList());
    });

    return converter;
  }
}
