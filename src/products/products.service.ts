import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOneOptions } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { User } from '../users/entities/user.entity';
import { UserType } from '../users/enums/user-type.enum';
import { UsersService } from '../users/users.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    private usersService: UsersService,
  ) {}

  async create(
    createProductDto: CreateProductDto,
    currentUser: User,
  ): Promise<Product> {
    const { id_product, customerUuid } = createProductDto;

    const existingProduct = await this.productsRepository.findOne({
      where: { id_product },
    });
    if (existingProduct) {
      throw new ConflictException(
        `Produto com id_product '${id_product}' já existe.`,
      );
    }

    let targetCustomerUuid: string;

    if (currentUser.type === UserType.ADMINISTRATOR) {
      if (!customerUuid) {
        throw new BadRequestException(
          'Administradores devem fornecer o customerUuid para criar um produto.',
        );
      }
      await this.usersService.findOne(customerUuid);
      targetCustomerUuid = customerUuid;
    } else if (currentUser.type === UserType.CUSTOMER) {
      if (customerUuid && customerUuid !== currentUser.uuid) {
        throw new ForbiddenException(
          'Clientes só podem criar produtos para si mesmos.',
        );
      }
      targetCustomerUuid = currentUser.uuid;
    } else {
      throw new ForbiddenException('Tipo de usuário desconhecido.');
    }

    const product = this.productsRepository.create({
      id_product,
      customerUuid: targetCustomerUuid,
    });

    try {
      return await this.productsRepository.save(product);
    } catch (error) {
      throw new BadRequestException('Erro ao criar produto.', error.detail);
    }
  }

  async findAll(currentUser: User): Promise<Product[]> {
    if (currentUser.type === UserType.ADMINISTRATOR) {
      return this.productsRepository.find({ relations: ['customer'] });
    } else if (currentUser.type === UserType.CUSTOMER) {
      return this.productsRepository.find({
        where: { customerUuid: currentUser.uuid },
        relations: ['customer'],
      });
    }
    return [];
  }

  async findOne(uuid: string, currentUser: User): Promise<Product> {
    const options: FindOneOptions<Product> = {
      where: { uuid },
      relations: ['customer'],
    };
    const product = await this.productsRepository.findOne(options);

    if (!product) {
      throw new NotFoundException(`Produto com UUID ${uuid} não encontrado.`);
    }

    if (
      currentUser.type === UserType.CUSTOMER &&
      product.customerUuid !== currentUser.uuid
    ) {
      throw new ForbiddenException(
        'Você não tem permissão para acessar este produto.',
      );
    }
    return product;
  }

  async update(
    uuid: string,
    updateProductDto: UpdateProductDto,
    currentUser: User,
  ): Promise<Product> {
    const product = await this.findOne(uuid, currentUser);

    if (
      currentUser.type === UserType.CUSTOMER &&
      product.customerUuid !== currentUser.uuid
    ) {
      throw new ForbiddenException(
        'Você não tem permissão para atualizar este produto.',
      );
    }

    if (
      updateProductDto.id_product &&
      updateProductDto.id_product !== product.id_product
    ) {
      const existingProduct = await this.productsRepository.findOne({
        where: { id_product: updateProductDto.id_product },
      });
      if (existingProduct && existingProduct.uuid !== product.uuid) {
        throw new ConflictException(
          `Produto com id_product '${updateProductDto.id_product}' já existe.`,
        );
      }
    }

    this.productsRepository.merge(product, updateProductDto);

    try {
      return await this.productsRepository.save(product);
    } catch (error) {
      throw new BadRequestException('Erro ao atualizar produto.', error.detail);
    }
  }

  async remove(uuid: string, currentUser: User): Promise<void> {
    const product = await this.findOne(uuid, currentUser);
    if (
      currentUser.type === UserType.CUSTOMER &&
      product.customerUuid !== currentUser.uuid
    ) {
      throw new ForbiddenException(
        'Você não tem permissão para deletar este produto.',
      );
    }

    const result = await this.productsRepository.delete(uuid);
    if (result.affected === 0) {
      throw new NotFoundException(
        `Produto com UUID ${uuid} não encontrado para deleção.`,
      );
    }
  }
}
