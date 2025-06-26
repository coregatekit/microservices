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
import { AddAddressDto, UpdateAddressDto } from './addresses';
import { ResultStatus } from '../..//common/enum/result';
import { HttpResponse } from '../../common/http-response';
import { AddressResponse } from './addresses.interface';
import { CurrentUser } from '../auth/auth.decorator';
import { UserInfoResponse } from '../keycloak/keycloak.type';

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
    @CurrentUser() user: UserInfoResponse,
  ): Promise<HttpResponse<{ id: string }>> {
    this.logger.log(`Incoming request to add new address: ${user.uid}`);

    const input = {
      ...addressData,
      userId: user.uid,
    };

    return {
      status: ResultStatus.SUCCESS,
      message: 'Address added successfully',
      data: await this.addressesService.addNewAddress(input),
    };
  }

  @HttpCode(HttpStatus.OK)
  @Get()
  async getUserAddresses(
    @CurrentUser() user: UserInfoResponse,
  ): Promise<HttpResponse<AddressResponse[]>> {
    this.logger.log(`Incoming request to get addresses for user: ${user.uid}`);
    return {
      status: ResultStatus.SUCCESS,
      message: 'Addresses retrieved successfully',
      data: await this.addressesService.getUserAddresses(user.uid),
    };
  }

  @HttpCode(HttpStatus.OK)
  @Get('default')
  async getUserDefaultAddress(
    @CurrentUser() user: UserInfoResponse,
  ): Promise<HttpResponse<AddressResponse[]>> {
    this.logger.log(
      `Incoming request to get default address for user: ${user.uid}`,
    );
    return {
      status: ResultStatus.SUCCESS,
      message: 'Default address retrieved successfully',
      data: await this.addressesService.getUserDefaultAddress(user.uid),
    };
  }

  @HttpCode(HttpStatus.OK)
  @Get(':addressId')
  async getAddressDetail(
    @CurrentUser() user: UserInfoResponse,
    @Param('addressId') addressId: string,
  ): Promise<HttpResponse<AddressResponse>> {
    this.logger.log('Incoming request to get all addresses');
    return {
      status: ResultStatus.SUCCESS,
      message: 'Address retrieved successfully',
      data: await this.addressesService.getAddressById(addressId, user.uid),
    };
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch('user/:userId/:addressId/update')
  async updateAddress(
    @CurrentUser() user: UserInfoResponse,
    @Param('addressId') addressId: string,
    @Body() body: UpdateAddressDto,
  ): Promise<HttpResponse<{ id: string }>> {
    this.logger.log(
      `Incoming request to update address for user: ${user.uid}, addressId: ${addressId}`,
    );

    if (!body || !body.type) {
      this.logger.error(
        `Invalid request body for updating address: ${JSON.stringify(body)}`,
      );
      return {
        status: ResultStatus.ERROR,
        message: 'Invalid request body',
      };
    }

    return {
      status: ResultStatus.SUCCESS,
      message: 'Address updated successfully',
      data: await this.addressesService.updateAddress(
        user.uid,
        addressId,
        body,
      ),
    };
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch('user/:userId/:addressId/default')
  async setDefaultAddress(
    @CurrentUser() user: UserInfoResponse,
    @Param('addressId') addressId: string,
    @Body() body: UpdateAddressDto,
  ): Promise<HttpResponse<{ id: string }>> {
    this.logger.log(
      `Incoming request to set default address for user: ${user.uid}, addressId: ${addressId}`,
    );

    if (!body || !body.type) {
      this.logger.error(
        `Invalid request body for setting default address: ${JSON.stringify(body)}`,
      );
      return {
        status: ResultStatus.ERROR,
        message: 'Invalid request body',
      };
    }

    return {
      status: ResultStatus.SUCCESS,
      message: 'Default address updated successfully',
      data: await this.addressesService.changeUserDefaultAddress(
        user.uid,
        addressId,
        body.type,
      ),
    };
  }
}
