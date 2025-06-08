import {
  IsEmail,
  IsString,
  MinLength,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { UserType } from '../enums/user-type.enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Email do usuário (único)',
  })
  @IsEmail({}, { message: 'Email inválido.' })
  email: string;

  @ApiProperty({ example: 'john_doe', description: 'Nome de usuário' })
  @IsString()
  @MinLength(3, { message: 'Nome de usuário deve ter no mínimo 3 caracteres.' })
  username: string;

  @ApiProperty({ example: 'S3cr3tP@ss!', description: 'Senha do usuário' })
  @IsString()
  @MinLength(6, { message: 'Senha deve ter no mínimo 6 caracteres.' })
  password: string;

  @ApiPropertyOptional({
    enum: UserType,
    default: UserType.CUSTOMER,
    description: 'Tipo de usuário',
  })
  @IsOptional()
  @IsEnum(UserType, { message: 'Tipo de usuário inválido.' })
  type?: UserType = UserType.CUSTOMER;
}
