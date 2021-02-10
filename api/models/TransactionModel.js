import mongoose from 'mongoose';

// Implementa um modelo (schema) para essa coleção
let schema = mongoose.Schema({
  description: {type: String, required: true },
  value: { type: Number, required: true, min: 0 },
  category: {type: String, required: true },
  year: { type: Number, required: true, min: 0, max: 2200 },
  month:{ type: Number, required: true, min: 0, max: 12 },
  day: { type: Number, required: true, min: 0, max: 31 },
  yearMonth: {type: String, required: true },
  yearMonthDay: {type: String, required: true },
  type: {type: String, required: true },
}, {versionKey: false});

const TransactionModel = mongoose.model('transaction', schema);

export { TransactionModel };