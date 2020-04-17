import { getCustomRepository } from 'typeorm';

import TransactionsRepository from '../repositories/TransactionsRepository';
import AppError from '../errors/AppError';

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    if (!(await transactionsRepository.findOne(id))) {
      throw new AppError('No transaction with this id was found');
    }
    // deletes the entity with the given id
    await transactionsRepository.delete(id);
  }
}

export default DeleteTransactionService;
