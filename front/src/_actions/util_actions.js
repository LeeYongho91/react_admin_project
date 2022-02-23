import types from './types';

export function loadingToggleAction(status) {
  return {
    type: types.LOADING_TOGGLE_ACTION,
    payload: status,
  };
}

export function productImagesAction(images) {
  return {
    type: types.PRODUCT_IMAGES_ACTION,
    payload: images,
  };
}

export function showCartDialogAction(data2) {
  return {
    type: types.SHOW_CART_DIALOG,
    payload: data2,
  };
}

export function hideCartDialogAction() {
  return {
    type: types.HIDE_CART_DIALOG,
  };
}

export function showAlertDialogAction(data) {
  return {
    type: types.SHOW_ALERT_DIALOG,
    payload: data,
  };
}

export function closeAlertDialogAction() {
  return {
    type: types.CLOSE_ALERT_DIALOG,
  };
}
