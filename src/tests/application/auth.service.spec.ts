import { Test } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { LoginDTO } from '../../modules/auth/interfaces/dtos/login.dto';
import { AuthService } from '../../modules/auth/application/auth.service';

import { ICustomerRepository } from '../../modules/customer/domain/customer.repository';

import {
  CustomerRepositoryMock,
  getCustomerMock,
} from '..//_mocks/customer.mock';

import jwtConfig from '../../shared/config/jwt.config';
import { WrongCredentialsException } from '../../shared/exceptions/wrong-credentials.exception';

describe(AuthService.name, () => {
  let authService: jest.Mocked<AuthService>;
  let customerRepository: jest.Mocked<ICustomerRepository>;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthService,

        { provide: ICustomerRepository, useValue: CustomerRepositoryMock },
        {
          provide: jwtConfig.KEY,
          useValue: { secret: 'TOKEN', expiresIn: '1h' },
        },
        JwtService,
      ],
    }).compile();

    authService = moduleRef.get(AuthService);
    customerRepository = moduleRef.get(ICustomerRepository);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('Should  be defined', () => {
    expect(authService).toBeDefined();
  });

  describe(AuthService.prototype.login.name, () => {
    it('Should be able to login', async () => {
      const customer = getCustomerMock();

      customerRepository.findByDocument.mockResolvedValue(customer);

      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);

      const command: LoginDTO = {
        document: customer.document,
        password: customer.password,
      };

      const response = await authService.login(command);

      expect(response).toHaveProperty('token');
    });

    it('Should fail if customer cant be found', async () => {
      const customer = getCustomerMock();

      customerRepository.findByDocument.mockResolvedValue(null);

      const command: LoginDTO = {
        document: customer.document,
        password: customer.password,
      };

      const toRun = async () => await authService.login(command);

      expect(toRun).rejects.toThrow(new WrongCredentialsException());
    });

    it('Should fail if passwords dont match', async () => {
      const customer = getCustomerMock();

      customerRepository.findByDocument.mockResolvedValue(customer);

      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

      const command: LoginDTO = {
        document: customer.document,
        password: customer.password,
      };

      const toRun = async () => await authService.login(command);

      expect(toRun).rejects.toThrow(new WrongCredentialsException());
    });
  });
});
