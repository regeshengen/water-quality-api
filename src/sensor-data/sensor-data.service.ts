// src/sensor-data/sensor-data.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SensorData, SensorDataDocument } from './schemas/sensor-data.schema';

@Injectable()
export class SensorDataService {
  constructor(
    @InjectModel(SensorData.name)
    private sensorDataModel: Model<SensorDataDocument>,
  ) {}

  async findAllByProductId(productId: string): Promise<SensorData[]> {
    const sensorReadings = await this.sensorDataModel
      .find({ product_id: productId })
      .sort({ timestamp: -1 })
      .limit(100)
      .lean()
      .exec();

    return sensorReadings as SensorData[];
  }

  async findLatestByProductId(productId: string): Promise<SensorData | null> {
    const latestReading = await this.sensorDataModel
      .findOne({ product_id: productId })
      .sort({ timestamp: -1 })
      .lean()
      .exec();

    return latestReading as SensorData | null;
  }
}
