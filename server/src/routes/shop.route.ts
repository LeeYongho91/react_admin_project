import { Router } from 'express';
import ShopController from '@controllers/shop.controller';
import validationMiddleware from '@middlewares/validation.middleware';
import { uploadDto, getProductDto, reviewDto } from '@/dtos/shop.dto';
import Route from '@/interfaces/route/routes.interface';
import authMiddleware from '@/middlewares/auth.middleware';

class ShopRoute implements Route {
  public path = '/api/shop';
  public router = Router();
  public ShopController = new ShopController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/products`, /* validationMiddleware(getProductDto, 'body'), */ this.ShopController.getProducts);
    this.router.post(`${this.path}/image`, this.ShopController.imageSave);
    this.router.post(`${this.path}/upload`, validationMiddleware(uploadDto, 'body'), this.ShopController.upload);
    this.router.get(`${this.path}/product/product_by_id`, this.ShopController.getProductById);
    this.router.post(`${this.path}/review/add`, validationMiddleware(reviewDto, 'body'), authMiddleware, this.ShopController.reviewAdd);
    this.router.post(`${this.path}/history`, this.ShopController.history);
    this.router.post(`${this.path}/list`, this.ShopController.getProductList);
    this.router.get(`${this.path}/history/week`, this.ShopController.getWeekHistory);
  }
}

export default ShopRoute;
