import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { SensorDataService } from './sensor-data.service';
import { SensorData } from './schemas/sensor-data.schema';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('Sensor Data')
@Controller('sensor-data')
export class SensorDataController {
  constructor(private readonly sensorDataService: SensorDataService) {}

  @Get(':productId')
  @ApiOperation({
    summary: 'Obter todos os dados de sensores por ID do produto',
  })
  @ApiParam({
    name: 'productId',
    description: 'ID do produto (ex: device_XYZ123)',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de leituras de sensores.',
    type: [SensorData],
  })
  @ApiResponse({
    status: 404,
    description:
      'Produto não encontrado ou sem leituras (se o serviço lançar erro).',
  })
  async findAllByProductId(
    @Param('productId') productId: string,
  ): Promise<SensorData[]> {
    return this.sensorDataService.findAllByProductId(productId);
  }

  @Get('latest/:productId')
  @ApiOperation({
    summary: 'Obter a leitura mais recente de um sensor por ID do produto',
  })
  @ApiParam({
    name: 'productId',
    description: 'ID do produto (ex: device_XYZ123)',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Leitura mais recente do sensor.',
    type: SensorData,
  })
  @ApiResponse({
    status: 404,
    description: 'Nenhuma leitura encontrada para o produto.',
  })
  async findLatestByProductId(
    @Param('productId') productId: string,
  ): Promise<SensorData> {
    const latestData =
      await this.sensorDataService.findLatestByProductId(productId);
    if (!latestData) {
      throw new NotFoundException(
        `Nenhuma leitura (recente ou qualquer) encontrada para o product_id: ${productId}`,
      );
    }
    return latestData;
  }
}
