export interface UserInput {
  name: string;
  email: string;
  password: string;
  lastname: string;
  role: number;
  cart: Array<object>;
  history: Array<object>;
  image: string;
  token: string;
  tokenExp: number;
  userType: string;
}
