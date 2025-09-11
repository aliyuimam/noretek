// src/models/TokenTransaction.js
import mongoose from 'mongoose';

const TokenTransactionSchema = new mongoose.Schema({
  reference: {
    type: String,
    required: true,
    unique: true
  },
  meterNumber: {
    type: String,
    required: true
  },
  customerEmail: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  token: {
    type: String,
    required: true
  },
  units: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'completed'
  },
  generatedAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.TokenTransaction || mongoose.model('TokenTransaction', TokenTransactionSchema);