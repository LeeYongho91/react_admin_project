import mongoose from 'mongoose';
import config from 'config';
import { logger } from '@utils/logger';

async function connect() {
  // const dbUri = config.get<string>('mongoURI');
  const dbUri = process.env.MONGO_URI;

  try {
    await mongoose.connect(dbUri);
    logger.info('✅ ====== MONGODB CONNECT ====== ✅');
  } catch (error) {
    console.log(error);
    logger.error('Could not connect to db');
    process.exit(1);
  }
}

export default connect;
