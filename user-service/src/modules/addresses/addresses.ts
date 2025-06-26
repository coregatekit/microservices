import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { AddressDB, AddressResponse } from './addresses.interface';
import { AddressType } from './addresses.enum';

export class AddAddressDto {
  @ApiProperty()
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

export class UpdateAddressDto {
  @ApiProperty()
  @IsOptional()
  userId?: string;

  @ApiProperty()
  type: AddressType;

  @ApiProperty()
  @IsOptional()
  addressLine1?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  addressLine2?: string;

  @ApiProperty()
  @IsOptional()
  city?: string;

  @ApiProperty()
  @IsOptional()
  state?: string;

  @ApiProperty()
  @IsOptional()
  postalCode?: string;

  @ApiProperty()
  @IsOptional()
  country?: string;

  constructor(partial: Partial<UpdateAddressDto>) {
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
