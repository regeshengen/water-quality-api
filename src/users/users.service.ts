import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { email, password, type } = createUserDto;

    const existingUser = await this.usersRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new ConflictException('Email já está em uso.');
    }

    const user = this.usersRepository.create(createUserDto);
    if (type) {
      user.type = type;
    }

    try {
      return await this.usersRepository.save(user);
    } catch (error) {
      throw new BadRequestException('Erro ao criar usuário.', error.detail);
    }
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findOne(uuid: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { uuid } });
    if (!user) {
      throw new NotFoundException(`Usuário com UUID ${uuid} não encontrado.`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async update(uuid: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(uuid);

    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.usersRepository.findOne({
        where: { email: updateUserDto.email },
      });
      if (existingUser) {
        throw new ConflictException('Novo email já está em uso.');
      }
    }

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    this.usersRepository.merge(user, updateUserDto);

    try {
      return await this.usersRepository.save(user);
    } catch (error) {
      throw new BadRequestException('Erro ao atualizar usuário.', error.detail);
    }
  }

  async remove(uuid: string): Promise<void> {
    const result = await this.usersRepository.delete(uuid);
    if (result.affected === 0) {
      throw new NotFoundException(`Usuário com UUID ${uuid} não encontrado.`);
    }
  }
}
