import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateInfoUserDto {
  @IsOptional()
  @ApiPropertyOptional()
  @IsString()
  @Expose()
  userId: string;

  @IsOptional()
  @ApiPropertyOptional()
  @IsBoolean()
  @Expose()
  active: boolean;

  @IsOptional()
  @ApiPropertyOptional()
  @Expose()
  userInfo: any;

  @IsOptional()
  @ApiPropertyOptional()
  @Expose()
  listGenerate: any;
}
