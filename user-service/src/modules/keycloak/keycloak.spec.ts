import { CreateKeycloakUser } from './keycloak';

describe('Keycloak', () => {
  describe('CreateKeycloakUser', () => {
    it('should correctly parse data to object', () => {
      const dto = new CreateKeycloakUser({
        email: 'john@example.com',
        firstName: 'John',
        lastName: 'Doe',
        password: 'secureP@ssw0rd',
        phone: '123-456-7890',
      });

      expect(dto).toBeDefined();
      expect(dto.email).toBe('john@example.com');
      expect(dto.firstName).toBe('John');
      expect(dto.lastName).toBe('Doe');
    });
  });
});
