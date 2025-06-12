import { Body, Controller, Post } from '@nestjs/common';
import { AddressesService } from './addresses.service';
import { AddAddressDto } from './addresses';

@Controller('addresses')
export class AddressesController {
  private readonly addressesService: AddressesService;

  constructor(addressesService: AddressesService) {
    this.addressesService = addressesService;
  }

  @Post()
  async addNewAddress(@Body() addressData: AddAddressDto) {
    try {
      return await this.addressesService.addNewAddress(addressData);
    } catch (error) {
      console.error('Error adding address:', error);
      return {
        message: 'Failed to add address',
      };
    }
  }
}
