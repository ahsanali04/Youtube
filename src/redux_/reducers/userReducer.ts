import * as Actions from '../types';

const initialState = {
  userData: null,
};

export const userReducer = (state = initialState, action) => {
  //   console.log('action', action.payload);
  switch (action.type) {
    case Actions.userRecords: {
      return {
        ...state,
        userData: action.payload,
      };
    }
    case Actions.LOGOUT: {
      return {
        ...state,
        userData: null,
      };
    }
    default:
      return state;
  }
};
