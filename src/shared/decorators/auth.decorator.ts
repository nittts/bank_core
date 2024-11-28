import { SetMetadata } from '@nestjs/common';
import { AuthType } from 'src/modules/auth/domain/enum/auth-type';

export const AUTH_KEY_TYPE = 'authType';

export const Auth = (...authTypes: AuthType[]) =>
  SetMetadata(AUTH_KEY_TYPE, authTypes);
