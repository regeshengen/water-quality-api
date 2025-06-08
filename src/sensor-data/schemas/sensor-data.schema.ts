import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SensorDataDocument = SensorData & Document;

@Schema({ collection: 'data', timestamps: false })
export class SensorData {
  @Prop({ required: true, index: true })
  product_id: string;

  @Prop({ required: true })
  sensor_id: string;

  @Prop({ type: Date, required: true })
  timestamp: Date;

  @Prop({ required: true })
  temperatura_celsius: number;

  @Prop({ required: true })
  nivel_agua_percentual: number;

  @Prop({ required: true })
  turbidez_ntu: number;
}

export const SensorDataSchema = SchemaFactory.createForClass(SensorData);
