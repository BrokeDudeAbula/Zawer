import { Module } from '@nestjs/common'
import { JwtModule, type JwtModuleOptions } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { JwtStrategy } from './jwt.strategy'
import { User } from '../../entities/user.entity'
import { ZawerVote } from '../../entities/zawer-vote.entity'
import { Favorite } from '../../entities/favorite.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([User, ZawerVote, Favorite]),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService): Promise<JwtModuleOptions> => ({
        secret: configService.get<string>('JWT_SECRET') || 'default-secret',
        signOptions: {
          // ms 的 StringValue 是模板字面量类型，无法直接接收运行时读到的任意字符串
          expiresIn: (configService.get<string>('JWT_EXPIRES_IN') || '7d') as NonNullable<
            JwtModuleOptions['signOptions']
          >['expiresIn'],
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
