import { Body, Controller, Post } from '@nestjs/common';
import { LoginDTO } from '../dtos/login.dto';
import { AuthService } from '../../application/auth.service';

import { Auth } from 'src/shared/decorators/auth.decorator';
import { AuthType } from '../../domain/enum/auth-type';

@Controller('auth')
@Auth(AuthType.None)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() payload: LoginDTO) {
    return this.authService.login(payload);
  }
}
