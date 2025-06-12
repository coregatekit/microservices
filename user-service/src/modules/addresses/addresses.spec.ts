import { AddAddressDto } from './addresses';

describe('Addresses', () => {
  describe('AddAddressDto', () => {
    it('should correctly parse data to object', () => {
      const dto = new AddAddressDto({
        userId: 'user123',
        type: 'SHIPPING',
        addressLine1: '123 Main St',
        addressLine2: 'Apt 4B',
        city: 'Springfield',
        state: 'IL',
        postalCode: '62701',
        country: 'USA',
        isDefault: true,
      });

      expect(dto).toBeDefined();

      expect(dto.userId).toBe('user123');
      expect(dto.type).toBe('SHIPPING');
      expect(dto.addressLine1).toBe('123 Main St');
      expect(dto.addressLine2).toBe('Apt 4B');
      expect(dto.city).toBe('Springfield');
      expect(dto.state).toBe('IL');
      expect(dto.postalCode).toBe('62701');
      expect(dto.country).toBe('USA');
      expect(dto.isDefault).toBe(true);
    });

    it('should handle partial data', () => {
      const dto = new AddAddressDto({
        userId: 'user123',
        type: 'SHIPPING',
        addressLine1: '123 Main St',
        city: 'Springfield',
        state: 'IL',
        postalCode: '62701',
        country: 'USA',
      });

      expect(dto).toBeDefined();

      expect(dto.userId).toBe('user123');
      expect(dto.type).toBe('SHIPPING');
      expect(dto.addressLine1).toBe('123 Main St');
      expect(dto.addressLine2).toBeUndefined();
      expect(dto.city).toBe('Springfield');
      expect(dto.state).toBe('IL');
      expect(dto.postalCode).toBe('62701');
      expect(dto.country).toBe('USA');
      expect(dto.isDefault).toBeUndefined();
    });
  });
});
