import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateOrderDto {
  @IsNotEmpty()
  @ApiProperty({ required: true })
  @IsString()
  @Expose()
  priceId: string;

  @IsNotEmpty()
  @ApiProperty({ required: true })
  @IsString()
  @Expose()
  redirectUrl: string;

  @IsOptional()
  @ApiPropertyOptional()
  @IsString()
  @Expose()
  email: string;

  @IsOptional()
  @ApiPropertyOptional()
  @IsString()
  @Expose()
  userId: string;
}
