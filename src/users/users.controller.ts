import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseUUIDPipe,
  ClassSerializerInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserType } from './enums/user-type.enum';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { User } from './entities/user.entity';

@ApiTags('Users')
@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({
    summary: 'Criar um novo usuário (aberto ou restrito a admin)',
  })
  @ApiResponse({
    status: 201,
    description: 'Usuário criado com sucesso.',
    type: User,
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  @ApiResponse({ status: 409, description: 'Email já existe.' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserType.ADMINISTRATOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar todos os usuários (somente admin)' })
  @ApiResponse({ status: 200, description: 'Lista de usuários.', type: [User] })
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':uuid')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserType.ADMINISTRATOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obter um usuário pelo UUID (somente admin)' })
  @ApiParam({
    name: 'uuid',
    type: 'string',
    format: 'uuid',
    description: 'UUID do usuário',
  })
  @ApiResponse({ status: 200, description: 'Detalhes do usuário.', type: User })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado.' })
  findOne(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.usersService.findOne(uuid);
  }

  @Patch(':uuid')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserType.ADMINISTRATOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar um usuário (somente admin)' })
  @ApiParam({
    name: 'uuid',
    type: 'string',
    format: 'uuid',
    description: 'UUID do usuário',
  })
  @ApiResponse({ status: 200, description: 'Usuário atualizado.', type: User })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado.' })
  update(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(uuid, updateUserDto);
  }

  @Delete(':uuid')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserType.ADMINISTRATOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Deletar um usuário (somente admin)' })
  @ApiParam({
    name: 'uuid',
    type: 'string',
    format: 'uuid',
    description: 'UUID do usuário',
  })
  @ApiResponse({ status: 204, description: 'Usuário deletado.' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado.' })
  async remove(@Param('uuid', ParseUUIDPipe) uuid: string) {
    await this.usersService.remove(uuid);
  }
}
