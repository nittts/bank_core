import { Request } from 'express';
import { ParsedAuthToken } from './parsed-auth-token.type';

export type AuthenticatedRequest = Request & { user: ParsedAuthToken };
