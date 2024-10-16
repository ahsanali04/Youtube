import * as React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Home from '../components/Home';
import Profile from '../components/Profile';
import Notifications from '../components/Notifications';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Details from '../components/Details';
import History from '../components/History';
import {responsiveFontSize} from 'react-native-responsive-dimensions';
import Login from '../components/Login';
import Signup from '../components/Signup';
import {useSelector} from 'react-redux';
import {selectUser} from '../redux/slices/userSlice';
import Watch from '../components/Watch';
import Channel from '../components/Channel';
import Upload from '../components/Upload';

export type RootStackParam = {
  Details: undefined;
  History: undefined;
  Home: undefined;
  home: undefined;
  Notifications: undefined;
  Profile: undefined;
  App: undefined;
  Login: undefined;
  Signup: undefined;
  Auth: undefined;
  Watch:undefined;
  Channel:undefined;
  Upload:undefined;
};

const Stack = createNativeStackNavigator<RootStackParam>();

const Tab = createBottomTabNavigator();

const Root = () => {
  // const User = useSelector(selectUser);
  const userData = useSelector((state)=>state.userReducer.userData)
  const AppTab = () => {
    return (
      <Tab.Navigator
        initialRouteName="Home"
        screenOptions={{
          tabBarActiveTintColor: '#FF2400',
          tabBarHideOnKeyboard: true,
          // tabBarShowLabel:false,
          alignContent: 'center',

          tabBarAllowFontScaling: true,
          tabBarStyle: [
            {
              position: 'absolute',
              bottom: 4,
              // left: 20,
              // right: 20,
              elevation: 0,
              backgroundColor: '#fff',
              height: 60,
              borderRadius: 10,
              ...styles.shadow,
            },
          ],
          tabBarLabelStyle: {
            marginBottom: 15, // Adjust this value to control the label's position relative to the icon
            fontSize: 12, // You can also adjust the font size if needed
          },
        }}>
        <Tab.Screen
          name="Home"
          children={Main}
          options={{
            title: 'Home',
            headerShown: false,
            tabBarIcon: ({color, size}) => (
              <MaterialCommunityIcons name="home" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Notification"
          component={Notify}
          options={{
            tabBarLabel: 'Upload',
            headerShown: false,
            tabBarIcon: ({color, size}) => (
              <Ionicons name="add-circle-outline" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="You"
          component={Settings}
          options={{
            headerShown: false,
            tabBarLabel: 'You',
            tabBarIcon: ({color, size}) => (
              <MaterialCommunityIcons
                name="account"
                color={color}
                size={size}
              />
            ),
          }}
        />
      </Tab.Navigator>
    );
  };

  const Main = () => (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name={'home'} component={Home} />
      <Stack.Screen name={'Watch'} component={Watch} />
      <Stack.Screen name={'Details'} component={Details} />
      <Stack.Screen name={'Channel'} component={Channel} />
    </Stack.Navigator>
  );

  const Settings = () => (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name={'Profile'} component={Profile} />
      <Stack.Screen name={'History'} component={History} />
    </Stack.Navigator>
  );

  const Notify = () => (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name={'Upload'} component={Upload} />
    </Stack.Navigator>
  );

  const AuthStack = () => {
    const forFade = ({current}) => ({
      cardStyle: {
        opacity: current.progress,
      },
    });
    return (
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name={'Login'} component={Login} />
        <Stack.Screen name={'Signup'} component={Signup} />
      </Stack.Navigator>
    );
  };

  return (
    <NavigationContainer
      fallback={
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#fff',
          }}>
          <Text
            style={{
              fontSize: responsiveFontSize(3),
              fontFamily: 'SFProText-Bold',
              color: '#FF2400',
            }}>
            Cinema
          </Text>
        </View>
      }>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        {userData ? (
          <Stack.Screen name={'App'} children={AppTab} />
        ) : (
          <Stack.Screen name={'Auth'} children={AuthStack} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
export default Root;

const styles = StyleSheet.create({
  shadow: {
    shadowColor: '#FF2400',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  },
});
