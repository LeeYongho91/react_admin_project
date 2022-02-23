import types from '../_actions/types';

export default function (state = {}, action) {
  switch (action.type) {
    case types.REGISTER_USER:
      return { ...state, register: action.payload };
    case types.LOGIN_USER:
      return { ...state, loginSucces: action.payload };
    case types.AUTH_USER:
      return { ...state, userData: action.payload };
    case types.ADD_TO_CART:
      return {
        ...state,
        userData: {
          ...state.userData,
          cart: action.payload,
        },
      };
    case types.GET_CART_ITEMS:
      return { ...state, cartDetail: action.payload };
    case types.REMOVE_CART_ITEM:
      return {
        ...state,
        cartDetail: action.payload.productInfo,
        userData: {
          ...state.userData,
          cart: action.payload.cart,
        },
      };
    case types.ON_SUCCESS_BUY:
      return {
        ...state,
        cartDetail: action.payload.cartDetail,
        userData: {
          ...state.userData,
          cart: action.payload.cart,
        },
      };
    case types.CLEAR_CART_CLEAR:
      return {
        ...state,
        cartDetail: [],
      };
    default:
      return state;
  }
}
