import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  ParseUUIDPipe,
  ClassSerializerInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../users/entities/user.entity'; // Importe a entidade User
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { Product } from './entities/product.entity';

@ApiTags('Products')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('products')
@UseInterceptors(ClassSerializerInterceptor)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ApiOperation({ summary: 'Criar um novo produto' })
  @ApiResponse({
    status: 201,
    description: 'Produto criado com sucesso.',
    type: Product,
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  @ApiResponse({
    status: 403,
    description: 'Proibido (ex: customer tentando criar para outro customer).',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflito (ex: id_product já existe).',
  })
  create(@Body() createProductDto: CreateProductDto, @Request() req) {
    const currentUser: User = req.user;
    return this.productsService.create(createProductDto, currentUser);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar produtos (admin vê todos, customer vê os seus)',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de produtos.',
    type: [Product],
  })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  findAll(@Request() req) {
    const currentUser: User = req.user;
    return this.productsService.findAll(currentUser);
  }

  @Get(':uuid')
  @ApiOperation({ summary: 'Obter um produto pelo UUID' })
  @ApiParam({
    name: 'uuid',
    type: 'string',
    format: 'uuid',
    description: 'UUID do produto',
  })
  @ApiResponse({
    status: 200,
    description: 'Detalhes do produto.',
    type: Product,
  })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  @ApiResponse({
    status: 403,
    description: 'Proibido (customer tentando acessar produto de outro).',
  })
  @ApiResponse({ status: 404, description: 'Produto não encontrado.' })
  findOne(@Param('uuid', ParseUUIDPipe) uuid: string, @Request() req) {
    const currentUser: User = req.user;
    return this.productsService.findOne(uuid, currentUser);
  }

  @Patch(':uuid')
  @ApiOperation({ summary: 'Atualizar um produto' })
  @ApiParam({
    name: 'uuid',
    type: 'string',
    format: 'uuid',
    description: 'UUID do produto',
  })
  @ApiResponse({
    status: 200,
    description: 'Produto atualizado.',
    type: Product,
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  @ApiResponse({ status: 403, description: 'Proibido.' })
  @ApiResponse({ status: 404, description: 'Produto não encontrado.' })
  @ApiResponse({
    status: 409,
    description: 'Conflito (ex: id_product já existe).',
  })
  update(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() updateProductDto: UpdateProductDto,
    @Request() req,
  ) {
    const currentUser: User = req.user;
    return this.productsService.update(uuid, updateProductDto, currentUser);
  }

  @Delete(':uuid')
  @ApiOperation({ summary: 'Deletar um produto' })
  @ApiParam({
    name: 'uuid',
    type: 'string',
    format: 'uuid',
    description: 'UUID do produto',
  })
  @ApiResponse({ status: 204, description: 'Produto deletado.' })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  @ApiResponse({ status: 403, description: 'Proibido.' })
  @ApiResponse({ status: 404, description: 'Produto não encontrado.' })
  async remove(@Param('uuid', ParseUUIDPipe) uuid: string, @Request() req) {
    const currentUser: User = req.user;
    await this.productsService.remove(uuid, currentUser);
  }
}
