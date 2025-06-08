import { IsString, IsNotEmpty, IsUUID, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({
    example: 'EXT_ID_12345',
    description: 'ID externo do produto',
  })
  @IsString()
  @IsNotEmpty()
  id_product: string;

  @ApiPropertyOptional({
    example: 'uuid-do-customer-se-admin',
    description: 'UUID do cliente (apenas para administradores)',
  })
  @IsOptional()
  @IsUUID('4', { message: 'Customer UUID inválido.' })
  customerUuid?: string;
}
