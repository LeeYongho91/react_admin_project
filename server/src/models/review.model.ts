import mongoose from 'mongoose';
const Schema = mongoose.Schema;

import { Review } from '@/interfaces/shop/review.interface';

export interface ReviewDocument extends Review, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
}

const reviewtSchema = new mongoose.Schema(
  {
    writer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    description: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Review = mongoose.model('Review', reviewtSchema);

export default Review;
