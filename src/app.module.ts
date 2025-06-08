import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { SensorDataModule } from './sensor-data/sensor-data.module';

import { User } from './users/entities/user.entity';
import { Product } from './products/entities/product.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: configService.get<any>('DB_TYPE'),
        host: configService.get<string>('DB_HOST'),
        port: parseInt(configService.get<string>('DB_PORT')),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        entities: [User, Product],
        synchronize: configService.get<string>('NODE_ENV') !== 'production',
        autoLoadEntities: true,
        ssl:
          configService.get<string>('DB_SSL_MODE') === 'require'
            ? { rejectUnauthorized: false }
            : false,
      }),
    }),

    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const mongoUser = configService.get<string>('MONGO_USER');
        const mongoPassword = configService.get<string>('MONGO_PASSWORD');
        const mongoCluster = configService.get<string>(
          'MONGO_CLUSTER_HOSTNAME',
        );
        const mongoDbName = configService.get<string>('MONGO_DATABASE_NAME');

        if (!mongoUser || !mongoPassword || !mongoCluster || !mongoDbName) {
          throw new Error(
            'Variáveis de ambiente do MongoDB não configuradas corretamente!',
          );
        }

        const uri = `mongodb+srv://${mongoUser}:${mongoPassword}@${mongoCluster}/${mongoDbName}?retryWrites=true&w=majority`;
        console.log(
          'Conectando ao MongoDB com URI:',
          `mongodb+srv://${mongoUser}:****@${mongoCluster}/${mongoDbName}?retryWrites=true&w=majority`,
        );
        return {
          uri: uri,
        };
      },
    }),

    UsersModule,
    AuthModule,
    ProductsModule,
    SensorDataModule,
  ],
})
export class AppModule {}
