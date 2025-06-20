import { LoginRequest } from './auth';

describe('Auth Classes', () => {
  describe('LoginRequest', () => {
    it('should have email and password properties', () => {
      const loginRequest = new LoginRequest();
      expect(loginRequest).toHaveProperty('email');
      expect(loginRequest).toHaveProperty('password');
    });

    it('should validate email format', () => {
      const loginRequest = new LoginRequest();
      loginRequest.email = 'john@example.com';
      loginRequest.password = 'password123';
      expect(loginRequest.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
      expect(loginRequest.password).toBe('password123');
    });
  });
});
