import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactions = await this.find();

    const income = transactions.reduce((accumulator, transaction) => {
      if (transaction.type === 'income') {
        return accumulator + transaction.value;
      }
      return accumulator;
    }, 0); // o segundo argumento é o valor inical do accumulator, nesse caso 0

    const outcome = transactions.reduce((accumulator, transaction) => {
      if (transaction.type === 'outcome') {
        return accumulator + transaction.value;
      }
      return accumulator;
    }, 0);

    const total = income - outcome;

    return {
      income,
      outcome,
      total,
    };
  }
}

export default TransactionsRepository;
