import { IsString, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProductDto {
  @ApiPropertyOptional({
    example: 'EXT_ID_67890',
    description: 'Novo ID externo do produto',
  })
  @IsOptional()
  @IsString()
  id_product?: string;
}
