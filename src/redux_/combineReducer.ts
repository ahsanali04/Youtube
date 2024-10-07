import {combineReducers} from 'redux';
import { userReducer } from './reducers/userReducer';

export const rootReducer = combineReducers({
  userReducer: userReducer,
});

// export default rootReducer;