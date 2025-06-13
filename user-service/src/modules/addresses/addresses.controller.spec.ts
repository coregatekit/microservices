import { Test, TestingModule } from '@nestjs/testing';
import { AddressesController } from './addresses.controller';
import { AddressesService } from './addresses.service';

const mockAddressesService = {
  addNewAddress: jest.fn(),
};

describe('AddressesController', () => {
  let controller: AddressesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AddressesController],
      providers: [
        {
          provide: AddressesService,
          useValue: mockAddressesService,
        },
      ],
    }).compile();

    controller = module.get<AddressesController>(AddressesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('addNewAddress', () => {
    it('should call AddressesService.addNewAddress with correct data', async () => {
      const addressData = {
        userId: 'user123',
        type: 'SHIPPING',
        addressLine1: '123 Main St',
        addressLine2: 'Apt 4B',
        city: 'Springfield',
        state: 'IL',
        postalCode: '62701',
        country: 'USA',
        isDefault: true,
      };
      mockAddressesService.addNewAddress.mockResolvedValue({
        id: 'FA831B00-7E34-4062-94BE-F4AB15F3FBE3',
      });

      const result = await controller.addNewAddress(addressData);

      expect(mockAddressesService.addNewAddress).toHaveBeenCalledWith(
        addressData,
      );
      expect(result).toEqual({
        status: 'success',
        message: 'Address added successfully',
        data: { id: 'FA831B00-7E34-4062-94BE-F4AB15F3FBE3' },
      });
    });
  });
});
