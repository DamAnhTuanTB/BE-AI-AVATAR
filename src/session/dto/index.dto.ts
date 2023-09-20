import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { TypeSessionStatus } from '../model/session.model';

export enum GenderEnum {
  MALE = 'male',
  FEMAIL = 'female',
}

export class CreateSessionDto {
  @IsNotEmpty()
  @ApiProperty({ required: true })
  @IsString()
  @Expose()
  email: string;

  @IsOptional()
  @ApiPropertyOptional()
  @IsString()
  @Expose()
  name: string;

  @IsNotEmpty()
  @ApiProperty({ required: true })
  @IsString()
  @Expose()
  sessionId: string;

  @IsNotEmpty()
  @ApiProperty({ required: true, enum: GenderEnum, enumName: 'GenderEnum' })
  @IsEnum(GenderEnum)
  @Expose()
  gender: GenderEnum;

  @IsNotEmpty()
  @ApiProperty({ required: true })
  @Expose()
  styles: any;

  @IsNotEmpty()
  @ApiProperty({ required: true })
  @IsString()
  @Expose()
  originFirstImage: string;
}

export class UpdateSessionDto {
  @IsOptional()
  @ApiPropertyOptional({
    enum: TypeSessionStatus,
    enumName: 'TypeSessionStatus',
  })
  @IsEnum(TypeSessionStatus)
  @Expose()
  status: TypeSessionStatus;

  @IsOptional()
  @ApiPropertyOptional()
  @Expose()
  results: any;

  @IsOptional()
  @ApiPropertyOptional()
  @IsDateString()
  @Expose()
  updatedAt: Date;

  @IsOptional()
  @ApiPropertyOptional()
  @IsString()
  @Expose()
  email: string;

  @IsOptional()
  @ApiPropertyOptional()
  @IsString()
  @Expose()
  name: string;

  @IsOptional()
  @ApiPropertyOptional({ enum: GenderEnum, enumName: 'GenderEnum' })
  @IsEnum(GenderEnum)
  @Expose()
  gender: GenderEnum;

  @IsOptional()
  @ApiPropertyOptional()
  @Expose()
  styles: any;
}

export class QueryDownloadAllAvatarWithStyleDto {
  @IsNotEmpty()
  @ApiProperty({ required: true })
  @IsString()
  @Expose()
  sessionId: string;

  @IsNotEmpty()
  @ApiProperty({ required: true })
  @IsString()
  @Expose()
  style: string;
}
