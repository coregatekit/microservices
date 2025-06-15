import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { AddressesService } from './addresses.service';
import { AddAddressDto } from './addresses';
import { ResultStatus } from '../..//common/enum/result';
import { HttpResponse } from '../../common/http-response';
import { AddressResponse } from './addresses.interface';

@Controller('addresses')
export class AddressesController {
  private readonly addressesService: AddressesService;
  private readonly logger: Logger;

  constructor(addressesService: AddressesService) {
    this.addressesService = addressesService;
    this.logger = new Logger(AddressesController.name);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post()
  async addNewAddress(
    @Body() addressData: AddAddressDto,
  ): Promise<HttpResponse<{ id: string }>> {
    this.logger.log(
      `Incoming request to add new address: ${addressData.userId}`,
    );
    return {
      status: ResultStatus.SUCCESS,
      message: 'Address added successfully',
      data: await this.addressesService.addNewAddress(addressData),
    };
  }

  @HttpCode(HttpStatus.OK)
  @Get('user/:userId')
  async getUserAddresses(
    @Param('userId') userId: string,
  ): Promise<HttpResponse<AddressResponse[]>> {
    this.logger.log(`Incoming request to get addresses for user: ${userId}`);
    return {
      status: ResultStatus.SUCCESS,
      message: 'Addresses retrieved successfully',
      data: await this.addressesService.getUserAddresses(userId),
    };
  }

  @HttpCode(HttpStatus.OK)
  @Get('user/:userId/:addressId')
  async getAddressDetail(
    @Param('userId') userId: string,
    @Param('addressId') addressId: string,
  ): Promise<HttpResponse<AddressResponse>> {
    this.logger.log('Incoming request to get all addresses');
    return {
      status: ResultStatus.SUCCESS,
      message: 'Address retrieved successfully',
      data: await this.addressesService.getAddressById(userId, addressId),
    };
  }

  @HttpCode(HttpStatus.OK)
  @Get('user/:userId/default')
  async getUserDefaultAddress(
    @Param('userId') userId: string,
  ): Promise<HttpResponse<AddressResponse[]>> {
    this.logger.log(
      `Incoming request to get default address for user: ${userId}`,
    );
    return {
      status: ResultStatus.SUCCESS,
      message: 'Default address retrieved successfully',
      data: await this.addressesService.getUserDefaultAddress(userId),
    };
  }

  @HttpCode(HttpStatus.NOT_IMPLEMENTED)
  @Patch('user/:userId/:addressId/update')
  async updateAddress(
    @Param('userId') userId: string,
    @Param('addressId') addressId: string,
  ): Promise<HttpResponse<{ id: string }>> {
    this.logger.log(
      `Incoming request to update address for user: ${userId}, addressId: ${addressId}`,
    );
    return {
      status: ResultStatus.ERROR,
      message: 'The functionality is not implemented yet',
    };
  }

  @HttpCode(HttpStatus.NOT_IMPLEMENTED)
  @Patch('user/:userId/:addressId/default')
  async setDefaultAddress(
    @Param('userId') userId: string,
    @Param('addressId') addressId: string,
  ): Promise<HttpResponse<{ id: string }>> {
    this.logger.log(
      `Incoming request to set default address for user: ${userId}, addressId: ${addressId}`,
    );
    return {
      status: ResultStatus.ERROR,
      message: 'The functionality is not implemented yet',
    };
  }
}
