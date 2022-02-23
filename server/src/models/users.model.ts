import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import config from 'config';
import { UserInput } from '@/interfaces/user/users.interface';
import jwt from 'jsonwebtoken';
import moment from 'moment';

export interface UserDocument extends UserInput, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<Boolean>;
  generateToken(): Promise<UserDocument>;
  findByToken(token): Promise<UserDocument>;
  snsLogin(token): Promise<UserDocument>;
}

export interface UserModel extends mongoose.Model<UserDocument> {
  findByToken: (token) => Promise<UserDocument>;
}

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      maxlength: 50,
    },
    email: {
      type: String,
      trim: true,
      unique: 1,
    },
    password: {
      type: String,
      minglength: 5,
    },
    role: {
      type: Number,
      default: 0,
    },
    cart: {
      type: Array,
      default: [],
    },
    history: {
      type: Array,
      default: [],
    },
    image: String,
    token: {
      type: String,
    },
    tokenExp: {
      type: Number,
    },
    userType: {
      type: String,
      default: 'normal',
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save', async function (next) {
  const user = this as UserDocument;

  if (!user.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);

  const hash = bcrypt.hashSync(user.password, salt);

  user.password = hash;

  return next();
});

userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  const user = this as UserDocument;

  return bcrypt.compare(candidatePassword, user.password).catch((e) => {
    console.log(e);
    return false;
  });
};

userSchema.methods.generateToken = async function (): Promise<object> {
  const user = this as UserDocument;
  const secretKey = config.get<string>('secretKey');
  const token = jwt.sign({ _id: user._id.toHexString() }, secretKey, {
    expiresIn: 60 * 60 * 24,
  });
  const oneHour = moment().add(1, 'hour').valueOf();
  user.tokenExp = oneHour;
  user.token = token;
  await user.save();
  return { tokenExp: user.tokenExp, token: user.token };
};

userSchema.statics.findByToken = async function (token) {
  const user = this as UserModel;
  const secretKey = config.get<string>('secretKey');

  const decode = await Promise.resolve(jwt.verify(token, secretKey));
  const userData = await user.findOne({ _id: decode, token: token });

  return userData;
};

userSchema.methods.snsLogin = async function (token) {
  const user = this as UserDocument;
  user.token = token;
  await user.save();
};

const User = mongoose.model<UserDocument, UserModel>('User', userSchema);

export default User;
