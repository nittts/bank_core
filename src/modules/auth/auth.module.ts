import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

import jwtConfig from 'src/shared/config/jwt.config';

import { AuthService } from './application/auth.service';
import { AuthController } from './interfaces/controller/auth.controller';

import { CustomerModule } from '../customer/customer.module';

const _JwtModule = JwtModule.registerAsync(jwtConfig.asProvider());
const _ConfigModule = ConfigModule.forFeature(jwtConfig);

@Module({
  imports: [CustomerModule, _JwtModule, _ConfigModule],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService, _JwtModule, _ConfigModule],
})
export class AuthModule {}
