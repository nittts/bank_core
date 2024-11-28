import { Module } from '@nestjs/common';
import { CustomerModule } from '../customer/customer.module';
import { AuthService } from './application/auth.service';
import { AuthController } from './interfaces/controller/auth.controller';
import { JwtModule } from '@nestjs/jwt';
import jwtConfig from 'src/shared/config/jwt.config';
import { ConfigModule } from '@nestjs/config';

const _JwtModule = JwtModule.registerAsync(jwtConfig.asProvider());
const _ConfigModule = ConfigModule.forFeature(jwtConfig);

@Module({
  imports: [CustomerModule, _JwtModule, _ConfigModule],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService, _JwtModule, _ConfigModule],
})
export class AuthModule {}
