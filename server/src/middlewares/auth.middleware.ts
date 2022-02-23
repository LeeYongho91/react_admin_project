import User from '@/models/users.model';

const auth = async (req, res, next) => {
  const token = req.cookies.w_auth;
  if (!token) {
    return res.json({
      isAuth: false,
      error: true,
    });
  }
  try {
    const user = await User.findByToken(token);
    if (!user) {
      return res.json({
        isAuth: false,
        error: true,
      });
    }
    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

export default auth;
