import types from '../_actions/types';

export default function (state = {}, action) {
  switch (action.type) {
    case types.LOADING_TOGGLE_ACTION:
      return { ...state, showLoading: action.payload };

    case types.PRODUCT_IMAGES_ACTION:
      return { ...state, images: action.payload };

    case types.SHOW_CART_DIALOG:
      return {
        ...state,
        cartDialog: { show: true, ...action.payload },
      };
    case types.HIDE_CART_DIALOG:
      return {
        ...state,
        cartDialog: { show: false, ...action.payload },
      };
    case types.SHOW_ALERT_DIALOG:
      return {
        ...state,
        alertDialog: { show: true, ...action.payload },
      };
    case types.CLOSE_ALERT_DIALOG:
      return {
        ...state,
        alertDialog: { show: false, ...action.payload },
      };
    default:
      return state;
  }
}
