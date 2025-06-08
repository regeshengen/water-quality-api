import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SensorDataController } from './sensor-data.controller';
import { SensorDataService } from './sensor-data.service';
import { SensorData, SensorDataSchema } from './schemas/sensor-data.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: SensorData.name,
        schema: SensorDataSchema,
      },
    ]),
  ],
  controllers: [SensorDataController],
  providers: [SensorDataService],
})
export class SensorDataModule {}
