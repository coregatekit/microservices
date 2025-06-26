import { Test, TestingModule } from '@nestjs/testing';
import { AddressesController } from './addresses.controller';
import { AddressesService } from './addresses.service';
import { AddressType } from './addresses.enum';
import { UserInfoResponse } from '../keycloak/keycloak.type';

jest.mock('../auth/auth.decorator.ts', () => ({
  CurrentUser: () => (target: any, key: string, index: number) => {
    // This stores information about where the decorator was used
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    Reflect.defineMetadata('current_user_param_index', index, target, key);
  },
}));

describe('AddressesController', () => {
  let controller: AddressesController;

  const mockAddressesService = {
    addNewAddress: jest.fn(),
    getUserAddresses: jest.fn(),
    getAddressById: jest.fn(),
    getUserDefaultAddress: jest.fn(),
    updateAddress: jest.fn(),
    changeUserDefaultAddress: jest.fn(),
  };

  const mockUser: UserInfoResponse = {
    sub: '1234567890',
    uid: 'user123',
    email_verified: true,
    name: 'John Doe',
    preferred_username: 'john@example.com',
    given_name: 'John',
    family_name: 'Doe',
    email: 'john@example.com',
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

      const result = await controller.addNewAddress(addressData, mockUser);

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
      const type = '';
      mockAddressesService.getUserAddresses.mockResolvedValue(mockAddresses);

      const result = await controller.getUserAddresses(type, mockUser);

      expect(mockAddressesService.getUserAddresses).toHaveBeenCalledWith(
        userId,
        '',
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

      const result = await controller.getAddressDetail(mockUser, addressId);

      expect(mockAddressesService.getAddressById).toHaveBeenCalledWith(
        addressId,
        userId,
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

      const result = await controller.getUserDefaultAddress(mockUser);

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

  describe('updateAddress', () => {
    const userId = 'user123';
    const addressId = 'FA831B00-7E34-4062-94BE-F4AB15F3FBE3';
    const updateData = {
      type: AddressType.SHIPPING,
      addressLine1: '456 Elm St',
      addressLine2: 'Apt 5C',
      city: 'Springfield',
      state: 'IL',
      postalCode: '62702',
      country: 'USA',
    };

    it('should call AddressesService.updateAddress with correct userId, addressId, and updateData', async () => {
      const mockResponse = { id: addressId };
      mockAddressesService.updateAddress = jest
        .fn()
        .mockResolvedValue(mockResponse);

      const result = await controller.updateAddress(
        mockUser,
        addressId,
        updateData,
      );

      expect(mockAddressesService.updateAddress).toHaveBeenCalledWith(
        userId,
        addressId,
        updateData,
      );
      expect(result).toEqual({
        status: 'success',
        message: 'Address updated successfully',
        data: mockResponse,
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
        mockUser,
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
  });
});
