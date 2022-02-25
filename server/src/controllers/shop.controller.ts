import { NextFunction, Request, Response } from 'express';
import shopService from '@services/shop.service';
import upload from '@utils/upload';
class ShopController {
  public shopService = new shopService();

  /**
   *
   * @param req
   * @param res
   * @param next
   */
  public getProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.shopService.getProducts(req.body);
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  };

  /**
   *
   * @param req
   * @param res
   * @param next
   */
  public imageSave = (req: Request, res: Response, next: NextFunction) => {
    try {
      upload(req, res, (err) => {
        if (err) {
          console.log(err);
          return res.json({ success: false, err });
        }
        console.log({ success: true, filePath: res.req['file'].path, filename: res.req['file'].filename });
        return res.json({ success: true, filePath: res.req['file'].path, filename: res.req['file'].filename });
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   *
   * @param req
   * @param res
   * @param next
   */
  public upload = (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = this.shopService.upload(req.body);
      if (result) res.json({ success: true });
    } catch (error) {
      next(error);
    }
  };

  /**
   *
   * @param req
   * @param res
   * @param next
   */
  public getProductById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const type = req.query.type;
      const skip = req.query.skip;
      const productIds = req.query.id;
      const data = await this.shopService.getProductById(type, skip, productIds);

      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  };

  /**
   *
   * @param req
   * @param res
   * @param next
   */
  public reviewAdd = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.shopService.reviewAdd(req);
      if (result['success']) res.json({ success: true, review: result['review'], reviewCount: result['reviewCount'] });
    } catch (error) {
      next(error);
    }
  };

  /**
   *
   * @param req
   * @param res
   * @param next
   */
  public history = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.shopService.history(req.body);
      if (result['success']) res.json({ success: true, payments: result['payments'], historyCount: result['historyCount'] });
    } catch (error) {
      next(error);
    }
  };

  /**
   *
   * @param req
   * @param res
   * @param next
   */
  public getProductList = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.shopService.getProductList(req.body);
      if (result['success']) res.json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  };
}

export default ShopController;
