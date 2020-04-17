import csv from 'csvtojson';

import CreateTransactionService from './CreateTransactionService';
import Transaction from '../models/Transaction';

interface Request {
  filePath: string;
}

class ImportTransactionsService {
  async execute({ filePath }: Request): Promise<Transaction[]> {
    const csvFilePath = filePath;
    const jsonArray = await csv().fromFile(csvFilePath);

    const createTransaction = new CreateTransactionService();
    // const transactions: Transaction[] = [];

    /* for (let i = 0; i < jsonArray.length; i += 1) {
      transactions.push(
        await createTransaction.execute({
          title: jsonArray[i].title,
          value: jsonArray[i].value,
          type: jsonArray[i].type,
          category: jsonArray[i].category,
        }),
      );
    } */

    /** Since map always return promises (if you use await), you have to wait for the array of promises to get resolved. You can do this with await Promise.all(arrayOfPromises).
     * Quando se usa await dentro do map, ele retorna um array de promises
     */
    const promises = jsonArray.map(async transaction => {
      const transactionCreated = await createTransaction.execute({
        title: transaction.title,
        value: transaction.value,
        type: transaction.type,
        category: transaction.category,
      });
      return transactionCreated;
    });

    /** Quando se usa await dentro do map, ele retorna um array de promises,por isso essa linha é necessária */
    const transactions = await Promise.all(promises);

    return transactions;
  }
}

export default ImportTransactionsService;
