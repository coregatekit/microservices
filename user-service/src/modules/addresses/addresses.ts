import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { AddressDB, AddressResponse } from './addresses.interface';

export class AddAddressDto {
  @ApiProperty()
  @IsNotEmpty()
  userId: string;

  @ApiProperty()
  @IsNotEmpty()
  type: string;

  @ApiProperty()
  @IsNotEmpty()
  addressLine1: string;

  @ApiProperty({ required: false })
  addressLine2?: string;

  @ApiProperty()
  @IsNotEmpty()
  city: string;

  @ApiProperty()
  @IsNotEmpty()
  state: string;

  @ApiProperty()
  @IsNotEmpty()
  postalCode: string;

  @ApiProperty()
  @IsNotEmpty()
  country: string;

  @ApiProperty({ default: false })
  isDefault?: boolean;

  constructor(partial: Partial<AddAddressDto>) {
    Object.assign(this, partial);
  }
}

export function transformAddressResponse(address: AddressDB): AddressResponse {
  return {
    id: address.id,
    userId: address.userId,
    type: address.type,
    addressLine1: address.addressLine1,
    addressLine2: address.addressLine2 || undefined,
    city: address.city,
    state: address.state,
    postalCode: address.postalCode,
    country: address.country,
    isDefault: address.isDefault,
    createdAt: new Date(address.createdAt),
    updatedAt: new Date(address.updatedAt),
  };
}
