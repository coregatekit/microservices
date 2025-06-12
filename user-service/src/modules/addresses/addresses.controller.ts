import { Body, Controller, Post } from '@nestjs/common';
import { AddressesService } from './addresses.service';
import { AddAddressDto } from './addresses';
import { ResultStatus } from '../..//common/enum/result';
import { HttpResponse } from '../../common/http-response';

@Controller('addresses')
export class AddressesController {
  private readonly addressesService: AddressesService;

  constructor(addressesService: AddressesService) {
    this.addressesService = addressesService;
  }

  @Post()
  async addNewAddress(
    @Body() addressData: AddAddressDto,
  ): Promise<HttpResponse<{ id: string }>> {
    try {
      return {
        status: ResultStatus.SUCCESS,
        message: 'Address added successfully',
        data: await this.addressesService.addNewAddress(addressData),
      };
    } catch (error) {
      console.error('Error adding address:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to add address';
      return {
        status: ResultStatus.ERROR,
        message: errorMessage,
      };
    }
  }
}
