import { CreateKeycloakUser } from './keycloak';

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
});
