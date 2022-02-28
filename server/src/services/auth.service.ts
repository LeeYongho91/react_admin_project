import { CreateUserDto, LoginUserDto } from '@dtos/auth.dto';
import HttpException from '@exceptions/HttpException';
import { UserInput } from '@/interfaces/user/users.interface';
import User from '@/models/users.model';
import { isEmpty } from '@utils/util';

class AuthService {
  public User = User;

  /**
   *
   * @param userData
   * @returns
   */
  public async signup(data: CreateUserDto): Promise<boolean> {
    if (isEmpty(data)) throw new HttpException(400, "You're not userData");

    const findUser: UserInput = await this.User.findOne({ email: data.email });
    if (findUser) throw new HttpException(409, `You're email ${data.email} already exists`);
    const user = new this.User(data);
    const result = await user.save();
    if (!result) return false;

    return true;
  }

  /**
   *
   * @param userData
   * @returns
   */
  public async adminRegister(data: CreateUserDto): Promise<boolean> {
    if (isEmpty(data)) throw new HttpException(400, "You're not userData");

    const findUser: UserInput = await this.User.findOne({ email: data.email });
    if (findUser) throw new HttpException(409, `You're email ${data.email} already exists`);
    const newData = {
      ...data,
      role: 1,
    };
    const user = new this.User(newData);
    const result = await user.save();
    if (!result) return false;

    return true;
  }

  /**
   *
   * @param userData
   * @returns
   */
  public async login(loginData: LoginUserDto): Promise<object> {
    if (isEmpty(loginData)) throw new HttpException(400, "You're not userData");

    const user = await this.User.findOne({ email: loginData.email });
    if (!user) throw new HttpException(409, `You're email ${loginData.email} not found`);

    const isPasswordMatching = await user.comparePassword(loginData.password);
    if (!isPasswordMatching) throw new HttpException(409, "You're password not matching");

    const tokenData = await user.generateToken();

    return { _id: user._id, tokenExp: tokenData.tokenExp, token: tokenData.token };
  }

  /**
   *
   */

  public auth(user): object {
    return {
      _id: user._id,
      isAdmin: user.role === 0 ? false : true,
      isAuth: true,
      email: user.email,
      name: user.name,
      lastname: user.lastname,
      role: user.role,
      image: user.image,
      cart: user.cart,
      history: user.history,
      userType: user.userType,
    };
  }

  /**
   *
   * @param userId
   */

  public async logout(userId): Promise<boolean> {
    const result = await this.User.findOneAndUpdate({ _id: userId }, { token: '', tokenExp: '' });
    if (!result) throw new HttpException(409, "You're userId not found");

    return true;
  }

  /**
   *
   * @param userData
   * @param loginType
   * @returns
   */
  public async snsLogin(userData): Promise<object> {
    if (isEmpty(userData)) throw new HttpException(400, "You're not userData");
    let findUser = await this.User.findOne({ email: userData['email'], userType: userData['userType'] });
    let tokenData = {};
    if (!findUser) {
      const result = await this.signup(userData);
      if (result) {
        findUser = await this.User.findOne({ email: userData['email'], userType: userData['userType'] });
        tokenData = await findUser.generateToken();
      }
    } else {
      tokenData = await findUser.generateToken();
    }
    return { tokenExp: tokenData['tokenExp'], token: tokenData['token'] };
  }
}

export default AuthService;
