import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { WrongCredentialsException } from '../../../shared/exceptions/wrong-credentials.exception';
import { LoginDTO } from '../interfaces/dtos/login.dto';
import jwtConfig from '../../../shared/config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { ICustomerRepository } from '../../customer/domain/customer.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly customerRepository: ICustomerRepository,
    @Inject(jwtConfig.KEY)
    private jwtConfiguration: ConfigType<typeof jwtConfig>,
    private readonly jwtService: JwtService,
  ) {}

  async login({ document, password }: LoginDTO) {
    const customer = await this.customerRepository.findByDocument(document);

    if (!customer) throw new WrongCredentialsException();

    const passwordMatch = await bcrypt.compare(password, customer.password);

    if (!passwordMatch) throw new WrongCredentialsException();

    const payload = {
      accounts: customer.accounts,
      fullName: customer.fullName,
      birthDate: customer.birthDate,
    };

    const token = this.jwtService.sign(payload, {
      secret: this.jwtConfiguration.secret,
      expiresIn: this.jwtConfiguration.expiresIn,
      subject: String(customer.id),
    });
    return { token };
  }
}
