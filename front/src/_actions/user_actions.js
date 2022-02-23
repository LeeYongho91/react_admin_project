import axios from 'axios';
import types from './types';
import { AUTH_SERVER, USER_SERVER } from '../components/Config';

/**
 *
 * @param {*} dataToSubmit
 * @returns
 */
export function registerUser(dataToSubmit) {
  const request = axios
    .post(`${AUTH_SERVER}/signup`, dataToSubmit)
    .then(response => response.data);

  return {
    type: types.REGISTER_USER,
    payload: request,
  };
}

/**
 *
 * @param {*} dataToSubmit
 * @returns
 */
export function loginUser(dataToSubmit) {
  const request = axios
    .post(`${AUTH_SERVER}/login`, dataToSubmit)
    .then(response => response.data);

  return {
    type: types.LOGIN_USER,
    payload: request,
  };
}

/**
 *
 * @returns
 */
export async function auth() {
  const response = await axios.get(`${AUTH_SERVER}`);
  return {
    type: types.AUTH_USER,
    payload: response.data,
  };
}

/**
 *
 * @param {*} body
 * @returns
 */
export async function addToCart(body) {
  const { data } = await axios.post(`${USER_SERVER}/cart/add`, body);

  return {
    type: types.ADD_TO_CART,
    payload: data.cart,
  };
}

/**
 *
 * @param {*} cartItems
 * @param {*} userCart
 * @returns
 */
export async function getCartItems(cartItems, userCart) {
  const { data } = await axios.get(`${USER_SERVER}/cart/get?id=${cartItems}`);

  userCart.forEach(cartItem => {
    data.products.forEach((productDetail, index) => {
      if (cartItem.id === productDetail._id) {
        data.products[index].quantity = cartItem.quantity;
      }
    });
  });

  return {
    type: types.GET_CART_ITEMS,
    payload: data.products,
  };
}

/**
 *
 * @param {*} productId
 * @returns
 */
export async function removeCartItem(productId) {
  const { data } = await axios.get(
    `${USER_SERVER}/cart/remove?id=${productId}`,
  );

  data.cart.forEach(item => {
    data.productInfo.forEach((product, index) => {
      if (item.id === product._id) {
        data.productInfo[index].quantity = item.quantity;
      }
    });
  });
  return {
    type: types.REMOVE_CART_ITEM,
    payload: data,
  };
}

/**
 *
 * @param {*} paymentData
 * @returns
 */
export async function onSuccessBuy(paymentData) {
  console.log(paymentData);

  const { data } = await axios.post(`${USER_SERVER}/successBuy`, paymentData);

  console.log(data);

  return {
    type: types.ON_SUCCESS_BUY,
    payload: data,
  };
}
