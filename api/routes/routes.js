import express from 'express';
import service from './transactionsService.js';

const transactionRouter = express.Router();

transactionRouter.get('/', service.findByPeriod);
transactionRouter.get('/description', service.findByDescription);
transactionRouter.post('/', service.create);
transactionRouter.patch('/:id', service.update);
transactionRouter.delete('/:id', service.remove);

export { transactionRouter as routes };