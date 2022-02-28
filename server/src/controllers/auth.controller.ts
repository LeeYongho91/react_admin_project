import { NextFunction, Request, Response } from 'express';
import { CreateUserDto, LoginUserDto } from '@dtos/auth.dto';
import AuthService from '@services/auth.service';
import config from 'config';

class AuthController {
  public authService = new AuthService();
  public cookieOptions = { maxAge: 1000 * 60 * 15 };
  public redirectUrl = config.get<string>('CLIENT_URL');

  /**
   *
   * @param req
   * @param res
   * @param next
   */
  public signUp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data: CreateUserDto = req.body;
      const result = await this.authService.signup(data);
      res.status(201).json({ success: result });
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
  public adminRegister = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      const result = await this.authService.adminRegister(data);
      res.status(201).json({ success: result });
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
  public login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const loginData: LoginUserDto = req.body;
      const User = await this.authService.login(loginData);
      res.cookie('w_authExp', User['tokenExp']);
      res.cookie('w_auth', User['token']).status(200).json({
        loginSuccess: true,
        userId: User['_id'],
      });
    } catch (error) {
      console.error(error);
      next(error);
    }
  };

  /**
   *
   * @param req
   * @param res
   * @param next
   */
  public auth = (req: Request, res: Response, next: NextFunction) => {
    try {
      const authData = this.authService.auth(req.user);
      res.status(200).json(authData);
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
  public logout = (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = this.authService.logout(req.user['_id']);
      res.clearCookie('w_authExp');
      res.clearCookie('w_auth').status(200).json({ success: result });
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
  public googleLogin = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const email = req.user['profile']['_json']['email'];
      const name = req.user['profile']['displayName'];
      const userType = req.user['profile']['provider'];
      console.log(email);

      const userData = { email, name, password: '', userType };
      const tokenData = await this.authService.snsLogin(userData);
      res.cookie('w_auth', tokenData['token']);
      res.cookie('w_authExp', tokenData['tokenExp']);

      res.redirect(this.redirectUrl);
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
  public kakaoLogin = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userJson = req.user['_json'];
      const email = userJson.kakao_account.email;
      const name = req.user['username'];
      const userType = req.user['provider'];

      const userData = { email, name, password: '', userType };

      const tokenData = await this.authService.snsLogin(userData);
      res.cookie('w_auth', tokenData['token']);
      res.cookie('w_authExp', tokenData['tokenExp']);

      res.redirect(this.redirectUrl);
    } catch (error) {
      next(error);
    }
  };

  // /**
  //  *
  //  * @param req
  //  * @param res
  //  * @param next
  //  */
  public naverLogin = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userJson = req.user['_json'];
      const email = userJson.email;
      const name = userJson.nickname;
      const userType = req.user['provider'];

      if (!email || !name) res.redirect(`${this.redirectUrl}/oauth/error`);

      const userData = { email, name, password: '', userType };

      const tokenData = await this.authService.snsLogin(userData);
      res.cookie('w_auth', tokenData['token']);
      res.cookie('w_authExp', tokenData['tokenExp']);

      res.redirect(this.redirectUrl);
    } catch (error) {
      next(error);
    }
  };

  // /**
  //  *
  //  * @param req
  //  * @param res
  //  * @param next
  //  */
  // public emailDoubleCheck = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  //   try {
  //     const email = req.body.email;
  //     const emailCount: Boolean = await this.authService.emailDoubleCheck(email);

  //     if (emailCount) {
  //       res.status(200).json({ result: 'SUCCESS' });
  //     } else {
  //       res.status(200).json({ result: 'FAIL' });
  //     }
  //   } catch (error) {
  //     next(error);
  //   }
  // };

  // public nicknameDoubleCheck = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  //   try {
  //     const nickname = req.body.nickname;
  //     const nicknameCount: Boolean = await this.authService.nicknameDoubleCheck(nickname);

  //     if (nicknameCount) {
  //       res.status(200).json({ result: 'SUCCESS' });
  //     } else {
  //       res.status(200).json({ result: 'FAIL' });
  //     }
  //   } catch (error) {
  //     next(error);
  //   }
  // };

  // /**
  //  *
  //  * @param req
  //  * @param res
  //  * @param next
  //  */
  // public accountUpdate = async (req: Request, res: Response, next: NextFunction) => {
  //   try {
  //     const userData: accountUpdateDto = req.body;
  //     const accountUpdate: boolean = await this.authService.accountUpdate(userData);
  //     let result = '';

  //     if (accountUpdate == true) {
  //       result = 'SUCCESS';
  //     } else {
  //       result = 'FAIL';
  //     }
  //     res.status(201).json({ result, message: 'accountUpdate' });
  //   } catch (error) {
  //     next(error);
  //   }
  // };

  // /**
  //  *
  //  * @param req
  //  * @param res
  //  * @param next
  //  */
  // public userWithdraw = async (req: Request, res: Response, next: NextFunction) => {
  //   try {
  //     const uuid: userWithdrawDto = req.body;
  //     const userWithdraw: boolean = await this.authService.userWithdraw(uuid);
  //     let result = '';

  //     if (userWithdraw == true) {
  //       result = 'SUCCESS';
  //     } else {
  //       result = 'FAIL';
  //     }

  //     res.status(201).json({ result, message: 'userWithdraw' });
  //   } catch (error) {
  //     next(error);
  //   }
  // };

  // public auth = (req: Request, res: Response, next: NextFunction) => {
  //   try {
  //     const user = req.user;

  //     if (user) {
  //       res.status(201).json({ isAuth: true, isAdmin: true });
  //     }
  //   } catch (error) {
  //     next(error);
  //   }
  // };
}

export default AuthController;
