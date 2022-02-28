import { Router } from 'express';
import AuthController from '@controllers/auth.controller';
import { LoginUserDto, CreateUserDto } from '@dtos/auth.dto';
import Route from '@/interfaces/route/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';
import authMiddleware from '@/middlewares/auth.middleware';
import passport from 'passport';

class AuthRoute implements Route {
  public path = '/api/auth';
  public router = Router();
  public authController = new AuthController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // 회원가입
    this.router.post(`${this.path}/signup`, validationMiddleware(CreateUserDto, 'body'), this.authController.signUp);

    // 운영자 등록
    this.router.post(`${this.path}/admin/register`, validationMiddleware(CreateUserDto, 'body'), this.authController.adminRegister);

    // 일반 로그인
    this.router.post(`${this.path}/login`, validationMiddleware(LoginUserDto, 'body'), this.authController.login);

    // auth
    this.router.get(`${this.path}`, authMiddleware, this.authController.auth);

    // 로그아웃
    this.router.get(`${this.path}/logout`, authMiddleware, this.authController.logout);

    // 구글 로그인
    this.router.get(`${this.path}/google`, passport.authenticate('google', { scope: ['email', 'profile'] }));
    this.router.get(`${this.path}/google/callback`, passport.authenticate('google', { failureRedirect: '/login' }), this.authController.googleLogin);

    // // 카카오 로그인
    this.router.get(`${this.path}/kakao`, passport.authenticate('kakao'));
    this.router.get(`${this.path}/kakao/callback`, passport.authenticate('kakao', { failureRedirect: '/login' }), this.authController.kakaoLogin);

    // // 네이버 로그인
    this.router.get(`${this.path}/naver`, passport.authenticate('naver'));
    this.router.get(`${this.path}/naver/callback`, passport.authenticate('naver', { failureRedirect: '/login' }), this.authController.naverLogin);

    // // 이메일 중복확인
    // this.router.post(`${this.path}emailDoubleCheck`, validationMiddleware(EmailDoubleCheckDto, 'body'), this.authController.emailDoubleCheck);

    // // 닉네임 중복확인
    // this.router.post(`${this.path}nicknameDoubleCheck`, validationMiddleware(nicknameDoubleCheckDto, 'body'), this.authController.nicknameDoubleCheck);

    // // 회원정보 수정
    // this.router.post(`${this.path}accountUpdate`, validationMiddleware(accountUpdateDto, 'body'), this.authController.accountUpdate);

    // // 회원탈퇴
    // this.router.post(`${this.path}userWithdraw`, validationMiddleware(userWithdrawDto, 'body'), this.authController.userWithdraw);

    // // 회원 인증
    // this.router.get(`${this.path}auth`, authMiddleware, this.authController.auth);
  }
}

export default AuthRoute;
