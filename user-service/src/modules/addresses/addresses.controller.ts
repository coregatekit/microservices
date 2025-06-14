import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Param,
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
  @Get(':userId')
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
}
