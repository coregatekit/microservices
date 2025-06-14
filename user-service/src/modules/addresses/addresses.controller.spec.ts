import { Test, TestingModule } from '@nestjs/testing';
import { AddressesController } from './addresses.controller';
import { AddressesService } from './addresses.service';

describe('AddressesController', () => {
  let controller: AddressesController;

  const mockAddressesService = {
    addNewAddress: jest.fn(),
    getUserAddresses: jest.fn(),
    getAddressById: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

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

    const mockResponse = {
      id: 'FA831B00-7E34-4062-94BE-F4AB15F3FBE3',
    };

    it('should call AddressesService.addNewAddress with correct data', async () => {
      mockAddressesService.addNewAddress.mockResolvedValue(mockResponse);

      const result = await controller.addNewAddress(addressData);

      expect(mockAddressesService.addNewAddress).toHaveBeenCalledWith(
        addressData,
      );
      expect(result).toEqual({
        status: 'success',
        message: 'Address added successfully',
        data: mockResponse,
      });
    });
  });

  describe('getUserAddresses', () => {
    const userId = 'user123';
    const mockAddresses = [
      {
        id: 'FA831B00-7E34-4062-94BE-F4AB15F3FBE3',
        userId: 'user123',
        type: 'SHIPPING',
        addressLine1: '123 Main St',
        addressLine2: 'Apt 4B',
        city: 'Springfield',
        state: 'IL',
        postalCode: '62701',
        country: 'USA',
        isDefault: true,
      },
    ];

    it('should call AddressesService.getUserAddresses with correct userId', async () => {
      mockAddressesService.getUserAddresses.mockResolvedValue(mockAddresses);

      const result = await controller.getUserAddresses(userId);

      expect(mockAddressesService.getUserAddresses).toHaveBeenCalledWith(
        userId,
      );
      expect(result).toEqual({
        status: 'success',
        message: 'Addresses retrieved successfully',
        data: mockAddresses,
      });
    });
  });

  describe('getAddressDetail', () => {
    const userId = 'user123';
    const addressId = 'FA831B00-7E34-4062-94BE-F4AB15F3FBE3';
    const mockAddressDetail = {
      id: addressId,
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

    it('should call AddressesService.getAddressById with correct userId and addressId', async () => {
      mockAddressesService.getAddressById.mockResolvedValue(mockAddressDetail);

      const result = await controller.getAddressDetail(userId, addressId);

      expect(mockAddressesService.getAddressById).toHaveBeenCalledWith(
        userId,
        addressId,
      );
      expect(result).toEqual({
        status: 'success',
        message: 'Address retrieved successfully',
        data: mockAddressDetail,
      });
    });
  });
});
