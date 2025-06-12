import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

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
