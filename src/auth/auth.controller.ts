import {
  Controller,
  Post,
  Body,
  Request,
  UseGuards,
  Get,
  ClassSerializerInterceptor,
  UseInterceptors,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CreateUserDto } from '../users/dto/create-user.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { User } from '../users/entities/user.entity';
import { UserType } from 'src/users/enums/user-type.enum';

@ApiTags('Authentication')
@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Autenticar usuário e obter token JWT' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 201,
    description: 'Login bem-sucedido, retorna token e dados do usuário.',
  })
  @ApiResponse({ status: 401, description: 'Credenciais inválidas.' })
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
    );
    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas.');
    }
    return this.authService.login(user);
  }

  @Post('register')
  @ApiOperation({ summary: 'Registrar um novo usuário (cliente)' })
  @ApiResponse({
    status: 201,
    description: 'Usuário registrado com sucesso.',
    type: User,
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  @ApiResponse({ status: 409, description: 'Email já está em uso.' })
  async register(@Body() createUserDto: CreateUserDto) {
    createUserDto.type = createUserDto.type || UserType.CUSTOMER;
    return this.authService.register(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('profile')
  @ApiOperation({ summary: 'Obter perfil do usuário logado' })
  @ApiResponse({ status: 200, description: 'Perfil do usuário.', type: User })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  getProfile(@Request() req) {
    return req.user;
  }
}
