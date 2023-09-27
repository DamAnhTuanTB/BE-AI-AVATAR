import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
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

export enum TypeDownload {
  ALL_RESULT = 'ALL_RESULT',
  ALL_AVATAR = 'ALL_AVATAR',
  ALL_ORIGIN_PHOTO = 'ALL_ORIGIN_PHOTO',
  ALL_AVATAR_WITH_STYLE = 'ALL_AVATAR_WITH_STYLE',
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
  @Expose()
  originImages: string[];

  @IsNotEmpty()
  @ApiProperty({ required: true })
  @IsString()
  @Expose()
  timePayment: string;

  @IsOptional()
  @ApiPropertyOptional()
  @Expose()
  results: any;
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

export class QueryDownloadAvatarDto {
  @IsNotEmpty()
  @ApiProperty({ required: true })
  @IsString()
  @Expose()
  sessionId: string;

  @IsOptional()
  @ApiPropertyOptional()
  @IsString()
  @Expose()
  style: string;

  @IsOptional()
  @ApiPropertyOptional({ enum: TypeDownload, enumName: 'TypeDownload' })
  @IsEnum(TypeDownload)
  @Expose()
  type: TypeDownload;
}

export class QueryDownloadImageDto {
  @IsNotEmpty()
  @ApiProperty({ required: true })
  @IsString()
  @Expose()
  url: string;
}

export class SendMailDto {
  @IsOptional()
  @ApiPropertyOptional()
  @IsString()
  @Expose()
  to: string;

  @IsNotEmpty()
  @ApiProperty({ required: true })
  @IsString()
  @Expose()
  subject: string;

  @IsNotEmpty()
  @ApiProperty({ required: true })
  @IsString()
  @Expose()
  template: string;
}
