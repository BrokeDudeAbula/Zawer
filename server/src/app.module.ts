import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { resolve } from 'path'
import { AuthModule } from './modules/auth/auth.module'
import { MerchantsModule } from './modules/merchants/merchants.module'
import { ReviewsModule } from './modules/reviews/reviews.module'
import { UsersModule } from './modules/users/users.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        resolve(process.cwd(), '../.env.local'),
        resolve(process.cwd(), '../.env'),
        resolve(process.cwd(), '.env'),
      ],
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'better-sqlite3' as const,
        database: process.env.DATABASE_PATH || 'data/zawer.db',
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,
        autoLoadEntities: true,
      }),
    }),
    AuthModule,
    MerchantsModule,
    ReviewsModule,
    UsersModule,
  ],
})
export class AppModule {}
