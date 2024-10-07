import * as Actions from '../types';

export const logIn = data => {
  return dispatch => {
    dispatch({type: Actions.userRecords, payload: data});
  };
};

export const logOut = () => {
  return dispatch => {
    dispatch({type: Actions.LOGOUT});
  };
};
