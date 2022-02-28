import { NextFunction, Request, Response } from 'express';
import userService from '@services/users.service';

class UsersController {
  public userService = new userService();

  /**
   *
   * @param req
   * @param res
   * @param next
   */
  public addCart = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.userService.addCart(req.user['_id'], req.body);
      if (result['success']) res.status(200).json({ success: true, cart: result['cart'] });
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
  public getCart = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const productIds: string = req.query.id as string;
      const result = await this.userService.getCart(productIds);
      if (result['success']) res.status(200).json({ success: true, products: result['products'] });
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
  public removeCart = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const productIds: string = req.query.id as string;
      const result = await this.userService.removeCart(req.user['_id'], productIds);
      if (result['success']) res.status(200).json({ success: true, ...result });
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
  public successBuy = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.userService.successBuy(req.user, req.body);
      if (result['success']) res.status(200).json({ success: true, ...result });
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
  public getList = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.userService.getList(req.body);
      if (result['success']) res.status(200).json({ success: true, ...result });
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
  public getAdminList = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.userService.getAdminList(req.body);
      if (result['success']) res.status(200).json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  };
}

export default UsersController;
