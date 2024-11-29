import { Test } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';

import {
  getTransactionMock,
  TransactionRepositoryMock,
} from '../_mocks/transaction.mock';

import { AccountRepositoryMock, getAccountMock } from '../_mocks/account.mock';

import { ITransactionRepository } from '../../modules/transaction/domain/transaction.repository';
import { TransactionService } from '../../modules/transaction/application/transaction.service';
import { TransactionMapper } from '../../modules/transaction/interfaces/mappers/transaction.mapper';
import { TransactionType } from '../../modules/transaction/domain/enums/transaction-type.enum';
import { AccountStatus } from '../../modules/account/domain/enums/account-status.enum';

import { IAccountRepository } from '../../modules/account/domain/account.repository';

import { InvalidAccountException } from '../../shared/exceptions/invalid-account.exception';
import { InsuficientFundsException } from '../../shared/exceptions/insuficient-funds.exception';

import { CreateInternalDTO } from '../../modules/transaction/interfaces/dtos/create-internal.dto';
import { TransactionResponseDTO } from '../../modules/transaction/interfaces/dtos/transaction-response.dto';
import { CreateDepositDTO } from '../../modules/transaction/interfaces/dtos/create-deposit.dto';
import { CreateWithdrawalDTO } from '../../modules/transaction/interfaces/dtos/create-withdrawal.dto';

describe(TransactionService.name, () => {
  let transactionService: jest.Mocked<TransactionService>;
  let accountRepository: jest.Mocked<IAccountRepository>;
  let transactionRepository: jest.Mocked<ITransactionRepository>;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        TransactionService,
        {
          provide: ITransactionRepository,
          useValue: TransactionRepositoryMock,
        },
        { provide: IAccountRepository, useValue: AccountRepositoryMock },
        TransactionMapper,
      ],
    }).compile();

    transactionService = moduleRef.get(TransactionService);
    transactionRepository = moduleRef.get(ITransactionRepository);
    accountRepository = moduleRef.get(IAccountRepository);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('Should  be defined', () => {
    expect(transactionService).toBeDefined();
  });

  describe(TransactionService.prototype.findTransaction.name, () => {
    it('Should be able to find a transaction with its relations', async () => {
      const transaction = getTransactionMock();
      const accounts = [getAccountMock(), getAccountMock()];

      transactionRepository.findById.mockResolvedValue(transaction);
      accountRepository.findById
        .mockResolvedValueOnce(accounts[0])
        .mockResolvedValueOnce(accounts[1]);

      transaction.referenceSender(accounts[0]);
      transaction.referenceReceiver(accounts[1]);

      const response = await transactionService.findTransaction(
        transaction.id,
        true,
      );

      expect(response).toEqual(new TransactionResponseDTO(transaction));
    });

    it('Should fail if transaction cannot be found', async () => {
      const transaction = getTransactionMock();

      transactionRepository.findById.mockResolvedValue(null);

      const toRun = async () =>
        await transactionService.findTransaction(transaction.id, true);

      expect(toRun).rejects.toThrow(
        new BadRequestException('Transaction not Found'),
      );
    });
  });

  describe(TransactionService.prototype.performInternal.name, () => {
    it('Should be able to perform an internal transaction', async () => {
      const sender = getAccountMock();
      const receiver = getAccountMock();
      const transaction = getTransactionMock({
        amount: 10,
        sender_id: sender.id,
        receiver_id: receiver.id,
        type: TransactionType.INTERNAL,
      });

      sender.incrementBalance(transaction.amount);

      accountRepository.findByNumber.mockResolvedValueOnce(sender);
      accountRepository.findByNumber.mockResolvedValueOnce(receiver);
      transactionRepository.performTransaction.mockResolvedValue(transaction);

      const command: CreateInternalDTO = {
        amount: 10,
        receiverNumber: receiver.number,
        senderNumber: sender.number,
        type: TransactionType.INTERNAL,
      };

      const response = await transactionService.performInternal(command);

      sender.decrementBalance(transaction.amount);
      receiver.incrementBalance(transaction.amount);

      expect(response).toEqual(new TransactionResponseDTO(transaction));
    });

    it('Should fail if sender does not have enough funds', async () => {
      const sender = getAccountMock();
      const receiver = getAccountMock();

      accountRepository.findByNumber.mockResolvedValueOnce(sender);

      const command: CreateInternalDTO = {
        amount: 10,
        receiverNumber: receiver.number,
        senderNumber: sender.number,
        type: TransactionType.INTERNAL,
      };

      const toRun = async () =>
        await transactionService.performInternal(command);

      expect(toRun).rejects.toThrow(new InsuficientFundsException());
    });

    it('Should fail if sender cannot be found', async () => {
      const sender = getAccountMock();
      const receiver = getAccountMock();

      accountRepository.findByNumber.mockResolvedValueOnce(null);

      const command: CreateInternalDTO = {
        amount: 10,
        receiverNumber: receiver.number,
        senderNumber: sender.number,
        type: TransactionType.INTERNAL,
      };

      const toRun = async () =>
        await transactionService.performInternal(command);

      expect(toRun).rejects.toThrow(
        new InvalidAccountException('Sender Account not found'),
      );
    });

    it('Should fail if sender is not active', async () => {
      const sender = getAccountMock({ status: AccountStatus.INACTIVE });
      const receiver = getAccountMock();

      accountRepository.findByNumber.mockResolvedValueOnce(sender);
      accountRepository.findByNumber.mockResolvedValueOnce(receiver);

      const command: CreateInternalDTO = {
        amount: 10,
        receiverNumber: receiver.number,
        senderNumber: sender.number,
        type: TransactionType.INTERNAL,
      };

      const toRun = async () =>
        await transactionService.performInternal(command);

      expect(toRun).rejects.toThrow(
        new InvalidAccountException('Sender Account not active'),
      );
    });

    it('Should fail if receiver cannot be found', async () => {
      const sender = getAccountMock({ number: '127391278398127' });
      const receiver = getAccountMock();

      sender.incrementBalance(20);

      accountRepository.findByNumber.mockResolvedValueOnce(sender);
      accountRepository.findByNumber.mockResolvedValueOnce(null);

      const command: CreateInternalDTO = {
        amount: 10,
        receiverNumber: receiver.number,
        senderNumber: sender.number,
        type: TransactionType.INTERNAL,
      };

      const toRun = async () =>
        await transactionService.performInternal(command);

      expect(toRun).rejects.toThrow(
        new InvalidAccountException('Receiver Account not found'),
      );
    });

    it('Should fail if receiver is not active', async () => {
      const sender = getAccountMock();
      const receiver = getAccountMock({ status: AccountStatus.INACTIVE });

      sender.incrementBalance(10);

      accountRepository.findByNumber.mockResolvedValueOnce(sender);
      accountRepository.findByNumber.mockResolvedValueOnce(receiver);

      const command: CreateInternalDTO = {
        amount: 10,
        receiverNumber: receiver.number,
        senderNumber: sender.number,
        type: TransactionType.INTERNAL,
      };

      const toRun = async () =>
        await transactionService.performInternal(command);

      expect(toRun).rejects.toThrow(
        new InvalidAccountException('Receiver Account not active'),
      );
    });
  });

  describe(TransactionService.prototype.performDeposit.name, () => {
    it('Should be able to perform a deposit', async () => {
      const receiver = getAccountMock();
      const transaction = getTransactionMock({
        amount: 10,
        receiver_id: receiver.id,
        type: TransactionType.DEPOSIT,
      });

      accountRepository.findByNumber.mockResolvedValueOnce(receiver);

      const command: CreateDepositDTO = {
        amount: transaction.amount,
        number: receiver.number,
        type: TransactionType.DEPOSIT,
      };

      transactionRepository.performDeposit.mockResolvedValueOnce(transaction);

      const response = await transactionService.performDeposit(command);

      expect(response).toEqual(new TransactionResponseDTO(transaction));
    });

    it('Should fail if receiver is not found', async () => {
      const receiver = getAccountMock();
      const transaction = getTransactionMock({
        amount: 10,
        receiver_id: receiver.id,
        type: TransactionType.DEPOSIT,
      });

      accountRepository.findByNumber.mockResolvedValueOnce(null);

      const command: CreateDepositDTO = {
        amount: transaction.amount,
        number: receiver.number,
        type: TransactionType.DEPOSIT,
      };

      transactionRepository.performDeposit.mockResolvedValueOnce(transaction);

      const toRun = async () =>
        await transactionService.performDeposit(command);

      expect(toRun).rejects.toThrow(
        new InvalidAccountException('Receiver account not found'),
      );
    });

    it('Should fail if receiver is not active', async () => {
      const receiver = getAccountMock({ status: AccountStatus.INACTIVE });
      const transaction = getTransactionMock({
        amount: 10,
        receiver_id: receiver.id,
        type: TransactionType.DEPOSIT,
      });

      accountRepository.findByNumber.mockResolvedValueOnce(receiver);

      const command: CreateDepositDTO = {
        amount: transaction.amount,
        number: receiver.number,
        type: TransactionType.DEPOSIT,
      };

      transactionRepository.performDeposit.mockResolvedValueOnce(transaction);

      const toRun = async () =>
        await transactionService.performDeposit(command);

      expect(toRun).rejects.toThrow(
        new InvalidAccountException('Receiver account not active'),
      );
    });
  });

  describe(TransactionService.prototype.performWithDrawal.name, () => {
    it('Should be able to perform a withdrawal', async () => {
      const sender = getAccountMock();
      const transaction = getTransactionMock({
        amount: 10,
        sender_id: sender.id,
        type: TransactionType.DEPOSIT,
      });

      sender.incrementBalance(10);

      accountRepository.findByNumber.mockResolvedValueOnce(sender);

      const command: CreateWithdrawalDTO = {
        amount: transaction.amount,
        number: sender.number,
        type: TransactionType.WITHDRAWAL,
      };

      transactionRepository.performWithdrawal.mockResolvedValueOnce(
        transaction,
      );

      const response = await transactionService.performWithDrawal(command);

      expect(response).toEqual(new TransactionResponseDTO(transaction));
    });

    it('Should fail if sender is not found', async () => {
      const sender = getAccountMock();
      const transaction = getTransactionMock({
        amount: 10,
        sender_id: sender.id,
        type: TransactionType.DEPOSIT,
      });

      accountRepository.findByNumber.mockResolvedValueOnce(null);

      const command: CreateWithdrawalDTO = {
        amount: transaction.amount,
        number: sender.number,
        type: TransactionType.WITHDRAWAL,
      };

      transactionRepository.performDeposit.mockResolvedValueOnce(transaction);

      const toRun = async () =>
        await transactionService.performWithDrawal(command);

      expect(toRun).rejects.toThrow(
        new InvalidAccountException('Sender account not found'),
      );
    });

    it('Should fail if sender is not active', async () => {
      const sender = getAccountMock({ status: AccountStatus.INACTIVE });
      const transaction = getTransactionMock({
        amount: 10,
        sender_id: sender.id,
        type: TransactionType.DEPOSIT,
      });

      accountRepository.findByNumber.mockResolvedValueOnce(sender);

      const command: CreateWithdrawalDTO = {
        amount: transaction.amount,
        number: sender.number,
        type: TransactionType.WITHDRAWAL,
      };

      transactionRepository.performDeposit.mockResolvedValueOnce(transaction);

      const toRun = async () =>
        await transactionService.performWithDrawal(command);

      expect(toRun).rejects.toThrow(
        new InvalidAccountException('Sender account not active'),
      );
    });
  });
});
