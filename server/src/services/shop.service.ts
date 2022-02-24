import ProductModel from '@/models/product.model';
import ReviewModel from '@/models/review.model';
import PaymentModel from '@/models/payment.model';
import { uploadDto } from '@/dtos/shop.dto';
import HttpException from '@/exceptions/HttpException';
import { isEmpty } from '@/utils/util';

class ShopService {
  public Product = ProductModel;
  public Review = ReviewModel;
  public Payment = PaymentModel;

  /**
   *
   * @param productData
   * @returns
   */
  public async upload(productData: uploadDto): Promise<boolean> {
    if (isEmpty(productData)) throw new HttpException(400, "You're not productData");

    const product = new this.Product(productData);
    await product.save();

    return true;
  }

  /**
   *
   * @param filterData
   * @returns
   */
  public async getProducts(filterData): Promise<object> {
    if (isEmpty(filterData)) throw new HttpException(400, "You're not filterData");

    const limit = filterData.limit ? parseInt(filterData.limit) : 100;
    const skip = filterData.skip ? parseInt(filterData.skip) : 0;
    const term = filterData.searchTerm;

    const findArgs = {};

    for (const key in filterData.filters) {
      if (filterData.filters[key].length > 0) {
        if (key === 'price') {
          findArgs[key] = {
            // grater than or equivalent 크거나 같은
            $gte: filterData.filters[key][0],
            // less than or equivalent 작거나 같은
            $lte: filterData.filters[key][1],
          };
        }
      }
    }

    console.log(findArgs);

    if (term) {
      const productInfo = await this.Product.find(findArgs)
        .find({ $text: { $search: term } })
        .populate('writer')
        .skip(skip)
        .limit(limit);
      const next = await this.Product.find(findArgs)
        .skip(skip + limit)
        .limit(limit);
      return { success: true, productInfo, postSize: productInfo.length, next: next.length !== 0 };
    } else {
      const productInfo = await this.Product.find(findArgs).populate('writer').skip(skip).limit(limit);
      const next = await this.Product.find(findArgs)
        .skip(skip + limit)
        .limit(limit);
      return { success: true, productInfo, postSize: productInfo.length, next: next.length !== 0 };
    }
  }

  /**
   *
   * @param type
   * @param productIds
   * @returns
   */
  public async getProductById(type, skip, productIds): Promise<object> {
    if (isEmpty(type)) throw new HttpException(400, "You're not type");
    if (isEmpty(productIds)) throw new HttpException(400, "You're not productIds");

    if (type === 'array') {
      const ids = productIds.split(',');
      productIds = ids.map((item) => {
        return item;
      });
    }

    const product = await this.Product.find({
      _id: {
        $in: productIds,
      },
    })
      .populate('writer')
      .populate({
        path: 'review',
        populate: {
          path: 'writer',
        },
        options: {
          skip: skip,
          limit: 5,
          sort: {
            createdAt: -1,
          },
        },
      });

    const reviewCount = await this.reviewCount(productIds);
    const productsCount = await this.Product.count({});
    const randValues: number[] = this.getRandomValues(productsCount);

    const relatedProducts = [];
    for (const n of randValues) {
      const product = await this.Product.findOne().skip(n);
      relatedProducts.push(product);
    }

    return { success: true, product, reviewCount, relatedProducts };
  }

  /**
   *
   * @param req
   * @returns
   */
  public async reviewAdd(req): Promise<object> {
    if (isEmpty(req.body)) throw new HttpException(400, "You're not reviewData");

    const reviewData = {
      writer: req.user['_id'],
      description: req.body.description,
    };

    const { _id } = await this.Review.create(reviewData);
    const { review } = await this.Product.findOneAndUpdate({ _id: req.body.productId }, { $push: { review: _id } }, { new: true }).populate({
      path: 'review',
      populate: {
        path: 'writer',
      },
      options: {
        skip: 0,
        limit: 5,
        sort: {
          createdAt: -1,
        },
      },
    });

    console.log(review);

    const reviewCount = await this.reviewCount(req.body.productId);
    return { success: true, review, reviewCount };
  }

  /**
   *
   * @param productId
   */
  public async reviewCount(productIds: string): Promise<number> {
    const reviewCount = await this.Product.find({
      _id: {
        $in: productIds,
      },
    }).populate('review');

    return reviewCount[0].review.length;
  }

  /**
   *
   * @param count
   * @returns
   */
  public getRandomValues(count: number): Array<number> {
    const randArr = [];
    while (randArr.length < 4) {
      const rand = Math.floor(Math.random() * count);
      if (randArr.indexOf(rand) === -1) {
        randArr.push(rand);
      }
    }
    return randArr;
  }

  /**
   *
   * @param searchData
   * @returns
   */
  public async history(searchData): Promise<object> {
    if (isEmpty(searchData)) throw new HttpException(400, "You're not searchData");

    const type = searchData.type;
    const searchTerm = searchData.searchTerm;
    const startDate = searchData.startDate;
    const endDate = searchData.endDate;
    const findDateArgs = {};
    findDateArgs['createdAt'] = {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    };

    if (searchTerm) {
      let payments = [];
      if (type === 'total') {
        payments = await this.Payment.find({ $or: [{ 'data.paymentID': searchTerm }, { 'user.name': searchTerm }], ...findDateArgs });
      } else if (type === 'paymentId') {
        payments = await this.Payment.find({ 'data.paymentID': searchTerm, ...findDateArgs });
      } else if (type === 'name') {
        payments = await this.Payment.find(findDateArgs);
      }
      return { success: true, payments };
    } else {
      const payments = await this.Payment.find(findDateArgs);
      console.log(payments);
      return { success: true, payments };
    }
  }
}

export default ShopService;
