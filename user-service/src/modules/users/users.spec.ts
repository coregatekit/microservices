import { CreateUserDto } from './users';

describe('Users', () => {
  describe('CreateUserDto', () => {
    it('should correctly parse data to object', () => {
      const dto = new CreateUserDto({
        email: 'john@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
        phone: '123-456-7890',
      });

      expect(dto).toBeDefined();
      expect(dto.email).toBe('john@example.com');
      expect(dto.password).toBe('password123');
      expect(dto.firstName).toBe('John');
      expect(dto.lastName).toBe('Doe');
      expect(dto.phone).toBe('123-456-7890');
    });

    it('should handle partial data', () => {
      const dto = new CreateUserDto({
        email: 'john@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
      });

      expect(dto).toBeDefined();
      expect(dto.email).toBe('john@example.com');
      expect(dto.phone).toBeUndefined();
    });
  });
});
