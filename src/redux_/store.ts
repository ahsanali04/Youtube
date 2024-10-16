import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import {rootReducer} from './combineReducer';
import {composeWithDevTools} from 'redux-devtools-extension';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {persistStore, persistReducer} from 'redux-persist';


const persistConfig = {
    // Root
    key: 'root',
    // Storage Method (React Native)
    storage: AsyncStorage,
    // Whitelist (Save Specific Reducers)
    whitelist: ['userReducer'],
    // Blacklist (Don't Save Specific Reducers)
    blacklist: [
      //'orderReducer',
      //  'authReducer'
    ],
  };
// Middleware: redux Persist Persisted Reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);
// redux: Store
const store = createStore(
  persistedReducer,
  composeWithDevTools(applyMiddleware(thunk)),
);
// Middleware: redux Persist Persister
let persistor = persistStore(store);
// Exports
export {store, persistor};