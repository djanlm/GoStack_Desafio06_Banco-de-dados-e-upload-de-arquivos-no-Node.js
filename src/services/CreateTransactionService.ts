import { getCustomRepository, getRepository } from 'typeorm';

// import AppError from '../errors/AppError';
import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';
import Category from '../models/Category';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}
class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const transactionRepository = getCustomRepository(TransactionsRepository);
    const categoryRepository = getRepository(Category);

    // check if a category with the same name exists
    const categoryExists = await categoryRepository.findOne({
      where: { title: category },
    });

    // if it doesn't exist
    if (!categoryExists) {
      // creates category
      const categoryCreated = categoryRepository.create({
        title: category,
      });

      // add it to the database
      await categoryRepository.save(categoryCreated);

      // create transaction with the new category
      const transaction = transactionRepository.create({
        title,
        value,
        type,
        category_id: categoryCreated.id,
      });

      await transactionRepository.save(transaction);
      return transaction;
    }

    // create transaction with the new category
    const transaction = transactionRepository.create({
      title,
      value,
      type,
      category_id: categoryExists.id,
    });

    await transactionRepository.save(transaction);
    return transaction;
  }
}

export default CreateTransactionService;
