import UserModel from '@/models/users.model';
import ProductModel from '@/models/product.model';
import PaymentModel from '@/models/payment.model';
import { isEmpty } from '@/utils/util';
import HttpException from '@/exceptions/HttpException';

// import async from 'async';

class UserService {
  public User = UserModel;
  public Product = ProductModel;
  public Payment = PaymentModel;

  /**
   *
   * @param userId
   * @param data
   * @returns
   */
  public async addCart(userId: string, data: object): Promise<object> {
    // 먼저 User Collection에 해당 유저의 정보를 가져오기.

    const userInfo = await this.User.findOne({ _id: userId });

    let duplicate = false;

    userInfo.cart.forEach((item) => {
      if (item['id'] === data['productId']) {
        duplicate = true;
      }
    });

    //상품이 있을때

    if (duplicate) {
      const userInfo = await this.User.findOneAndUpdate(
        { '_id': userId, 'cart.id': data['productId'] },
        // increment 증가시킨다
        { $inc: { 'cart.$.quantity': parseInt(data['qty']) } },
        // update된 정보를 얻으려면 new: true를 해야함
        { new: true }
      );
      if (userInfo) {
        return { success: true, cart: userInfo.cart };
      }
    } else {
      // 상품이 있지 않을때
      const userInfo = await this.User.findOneAndUpdate(
        { _id: userId },
        {
          $push: {
            cart: {
              id: data['productId'],
              quantity: parseInt(data['qty']),
              date: Date.now(),
            },
          },
        },
        { new: true }
      );
      return { success: true, cart: userInfo.cart };
    }
  }

  /**
   *
   * @param productIds
   */
  public async getCart(productIds: string): Promise<object> {
    const ids = productIds.split(',');
    const newProductIds = ids.map((item) => {
      return item;
    });

    const products = await this.Product.find({
      _id: {
        $in: newProductIds,
      },
    }).populate('writer');

    return { success: true, products };
  }

  /**
   *
   * @param userId
   * @param productIds
   */
  public async removeCart(userId: string, productIds: string): Promise<object> {
    const userInfo = await this.User.findOneAndUpdate({ _id: userId }, { $pull: { cart: { id: productIds } } }, { new: true });
    const cart = userInfo.cart;
    const array = cart.map((item) => {
      return item['id'];
    });

    const productInfo = await this.Product.find({ _id: { $in: array } }).populate('writer');

    return { success: true, productInfo, cart };
  }

  /**
   *
   * @param user
   * @param body
   * @returns
   */
  public async successBuy(user, body): Promise<object> {
    // 1. User Collection 안에 History 필드 안에 간단한 정보 넣어주기

    // 2. Payment Collection 안에 자세한 결제 정보를 넣어준다.

    // 3. Product Collection 안에 있는 sold 필드 정보 업데이트 시켜주기

    const history = [];
    const transactionData = {};

    body.cartDetail.forEach((item) => {
      history.push({
        dateOfPurchase: Date.now(),
        name: item.title,
        id: item._id,
        price: item.price,
        quantity: item.quantity,
        paymentId: body.paymentData.paymentID,
      });
    });

    transactionData['user'] = {
      id: user._id,
      name: user.name,
      email: user.email,
    };

    transactionData['data'] = body.paymentData;

    transactionData['product'] = history;

    console.log(transactionData);

    // history 정보 저장
    const userInfo = await this.User.findOneAndUpdate({ _id: user._id }, { $push: { history: history }, $set: { cart: [] } }, { new: true });

    // payment에다가 transactionData정보 저장
    const payment = new this.Payment(transactionData);
    const paymentDoc = await payment.save();

    const products = [];

    paymentDoc.product.forEach((item) => {
      products.push({
        id: item['id'],
        quantity: item['quantity'],
      });
    });

    for (const item of products) {
      await this.Product.updateOne(
        { _id: item.id },
        {
          $inc: {
            sold: item.quantity,
          },
        },
        { new: false }
      );
    }

    return { success: true, cart: userInfo.cart, cartDetail: [] };
  }

  /**
   *
   * @param searchData
   * @returns
   */
  public async getList(searchData): Promise<object> {
    if (isEmpty(searchData)) throw new HttpException(400, "You're not searchData");

    const type = searchData.type;
    const searchTerm = searchData.searchTerm;
    const startDate = searchData.startDate;
    const endDate = searchData.endDate;
    const skip = searchData.skip;
    const limit = searchData.limit;
    const findDateArgs = {};
    findDateArgs['createdAt'] = {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    };

    if (searchTerm) {
      let users = [];
      let userCount = 0;
      if (type === 'total') {
        userCount = await this.User.count({ $or: [{ email: searchTerm }, { name: searchTerm }], ...findDateArgs });
        users = await this.User.find({ $or: [{ email: searchTerm }, { name: searchTerm }], ...findDateArgs })
          .skip(skip)
          .limit(limit);
      } else if (type === 'email') {
        userCount = await this.User.count({ email: searchTerm, ...findDateArgs });
        users = await this.User.find({ email: searchTerm, ...findDateArgs })
          .skip(skip)
          .limit(limit);
      } else if (type === 'name') {
        userCount = await this.User.count({ name: searchTerm, ...findDateArgs });
        users = await this.User.find({ name: searchTerm, ...findDateArgs })
          .skip(skip)
          .limit(limit);
      }
      console.log(users);
      return { success: true, users, userCount };
    } else {
      const userCount = await this.User.count(findDateArgs);
      const users = await this.User.find(findDateArgs).skip(skip).limit(limit);
      return { success: true, users, userCount };
    }
  }
}

export default UserService;
