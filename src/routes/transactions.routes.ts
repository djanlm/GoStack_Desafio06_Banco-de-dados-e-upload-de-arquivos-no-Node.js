import { Router } from 'express';
import { getCustomRepository } from 'typeorm';
import multer from 'multer';

import uploadConfig from '../config/upload';
import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';
import ImportTransactionsService from '../services/ImportTransactionsService';

const transactionsRouter = Router();
const upload = multer(uploadConfig);

transactionsRouter.get('/', async (request, response) => {
  const transactionsRepository = getCustomRepository(TransactionsRepository);

  const transactions = await transactionsRepository.find({
    relations: ['category'],
  });

  transactions.map(transaction => {
    delete transaction.created_at;
    delete transaction.updated_at;
    delete transaction.category_id;
    delete transaction.category.created_at;
    delete transaction.category.updated_at;
  });

  const balance = await transactionsRepository.getBalance();
  const transactionsAndBalance = {
    transactions,
    balance,
  };
  return response.json(transactionsAndBalance);
});

transactionsRouter.post('/', async (request, response) => {
  const { title, value, type, category } = request.body;

  const createTransaction = new CreateTransactionService();

  const transaction = await createTransaction.execute({
    title,
    value,
    type,
    category,
  });

  return response.json(transaction);
});

transactionsRouter.delete('/:id', async (request, response) => {
  const deleteTransaction = new DeleteTransactionService();

  await deleteTransaction.execute(request.params.id);

  return response.status(204).send();
});

transactionsRouter.post(
  '/import',
  upload.single('file'), // tem que ter o mesmo nome do campo lá no insomnia
  async (request, response) => {
    const importTransactions = new ImportTransactionsService();

    const transactions = await importTransactions.execute({
      filePath: request.file.path,
    });

    return response.json(transactions);
  },
);

export default transactionsRouter;
