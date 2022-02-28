import { Router } from 'express';
import UsersController from '@controllers/users.controller';
import Route from '@/interfaces/route/routes.interface';
import authMiddleware from '@middlewares/auth.middleware';

class UsersRoute implements Route {
  public path = '/api/users';
  public router = Router();
  public usersController = new UsersController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/cart/add`, authMiddleware, this.usersController.addCart);
    this.router.get(`${this.path}/cart/get`, this.usersController.getCart);
    this.router.get(`${this.path}/cart/remove`, authMiddleware, this.usersController.removeCart);
    this.router.post(`${this.path}/successBuy`, authMiddleware, this.usersController.successBuy);
    this.router.post(`${this.path}/list`, this.usersController.getList);
    this.router.post(`${this.path}/admin/list`, this.usersController.getAdminList);
  }
}

export default UsersRoute;
