import mongoose from 'mongoose';
const Schema = mongoose.Schema;
import { Payment } from '@/interfaces/user/payment.interface';

export interface PaymentDocument extends Payment, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
}

const paymentSchema = new mongoose.Schema(
  {
    user: {
      type: Array,
      default: [],
    },
    data: {
      type: Array,
      default: [],
    },
    product: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Payment = mongoose.model<PaymentDocument>('Payment', paymentSchema);

export default Payment;
