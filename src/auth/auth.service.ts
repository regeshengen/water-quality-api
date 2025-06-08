import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    email: string,
    pass: string,
  ): Promise<Omit<
    User,
    'password' | 'validatePassword' | 'hashPassword'
  > | null> {
    const user = await this.usersService.findByEmail(email);
    if (user && (await user.validatePassword(pass))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, validatePassword, hashPassword, ...result } = user;
      return result;
    }
    return null;
  }

  async login(
    user: Omit<User, 'password' | 'validatePassword' | 'hashPassword'>,
  ) {
    const payload = { email: user.email, sub: user.uuid, type: user.type };
    return {
      access_token: this.jwtService.sign(payload),
      user: user,
    };
  }

  async register(createUserDto: CreateUserDto): Promise<User> {
    try {
      const newUser = await this.usersService.create(createUserDto);
      return newUser;
    } catch (error) {
      throw error;
    }
  }
}
