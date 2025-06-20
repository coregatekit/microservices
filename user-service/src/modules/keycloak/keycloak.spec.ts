import { CreateKeycloakUser, LoginRequest } from './keycloak';

describe('Keycloak', () => {
  describe('CreateKeycloakUser', () => {
    it('should correctly parse data to object', () => {
      const dto = new CreateKeycloakUser({
        uid: '12345',
        email: 'john@example.com',
        firstName: 'John',
        lastName: 'Doe',
        password: 'secureP@ssw0rd',
      });

      expect(dto).toBeDefined();
      expect(dto.uid).toBe('12345');
      expect(dto.email).toBe('john@example.com');
      expect(dto.firstName).toBe('John');
      expect(dto.lastName).toBe('Doe');
    });
  });

  describe('LoginRequest', () => {
    it('should correctly parse username and password', () => {
      const loginRequest = new LoginRequest('john_doe', 'secureP@ssw0rd');
      expect(loginRequest).toBeDefined();
      expect(loginRequest.username).toBe('john_doe');
      expect(loginRequest.password).toBe('secureP@ssw0rd');
    });
  });
});
