import {Platform, StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import Root from './src/navigation/Root';
// import {store} from './src/redux/store/store';
import {store, persistor} from './src/redux_/store';
import {Provider} from 'react-redux';
import SplashScreen from 'react-native-splash-screen';
import {LogBox} from 'react-native';
import {PersistGate} from 'redux-persist/integration/react';

const App = () => {
  useEffect(() => {
    if (Platform.OS === 'android') {
      setTimeout(() => {
        SplashScreen.hide();
      }, 1000);
    }
  }, []);

  useEffect(() => {
    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
  }, []);

  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <Root />
      </PersistGate>
    </Provider>
  );
};

export default App;

const styles = StyleSheet.create({});
