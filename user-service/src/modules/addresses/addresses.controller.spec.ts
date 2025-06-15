import { Test, TestingModule } from '@nestjs/testing';
import { AddressesController } from './addresses.controller';
import { AddressesService } from './addresses.service';
import { AddressType } from './addresses.enum';

describe('AddressesController', () => {
  let controller: AddressesController;

  const mockAddressesService = {
    addNewAddress: jest.fn(),
    getUserAddresses: jest.fn(),
    getAddressById: jest.fn(),
    getUserDefaultAddress: jest.fn(),
    changeUserDefaultAddress: jest.fn(),
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

  describe('getUserDefaultAddress', () => {
    const userId = 'user123';

    it('should call AddressesService.getUserDefaultAddress with correct userId', async () => {
      const mockDefaultAddress = [
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
        {
          id: 'FA831B00-7E34-4062-94BE-F4AB15F3FBE4',
          userId: 'user123',
          type: 'BILLING',
          addressLine1: '123 Main St',
          addressLine2: 'Apt 4B',
          city: 'Springfield',
          state: 'IL',
          postalCode: '62701',
          country: 'USA',
          isDefault: true,
        },
      ];

      mockAddressesService.getUserDefaultAddress.mockResolvedValue(
        mockDefaultAddress,
      );

      const result = await controller.getUserDefaultAddress(userId);

      expect(mockAddressesService.getUserDefaultAddress).toHaveBeenCalledWith(
        userId,
      );
      expect(result).toEqual({
        status: 'success',
        message: 'Default address retrieved successfully',
        data: mockDefaultAddress,
      });
    });
  });

  describe('setDefaultAddress', () => {
    const userId = 'user123';
    const addressId = 'FA831B00-7E34-4062-94BE-F4AB15F3FBE3';
    const updateData = { type: AddressType.SHIPPING };

    it('should call AddressesService.setDefaultAddress with correct userId, addressId, and updateData', async () => {
      const mockResponse = { id: addressId };
      mockAddressesService.changeUserDefaultAddress = jest
        .fn()
        .mockResolvedValue(mockResponse);

      const result = await controller.setDefaultAddress(
        userId,
        addressId,
        updateData,
      );

      expect(
        mockAddressesService.changeUserDefaultAddress,
      ).toHaveBeenCalledWith(userId, addressId, updateData.type);
      expect(result).toEqual({
        status: 'success',
        message: 'Default address updated successfully',
        data: mockResponse,
      });
    });

    it('should return error if updateData is invalid', async () => {
      const invalidUpdateData = {};

      const result = await controller.setDefaultAddress(
        userId,
        addressId,
        invalidUpdateData,
      );

      expect(result).toEqual({
        status: 'error',
        message: 'Invalid request body',
      });
    });
  });
});
