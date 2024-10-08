import {StyleSheet, Text, TouchableOpacity, View, Image} from 'react-native';
import React, {FunctionComponent, useState} from 'react';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Loader from '../common/Loader';
import axios from 'axios';
import {useDispatch, useSelector} from 'react-redux';
import {logOut} from '../redux_/actions/userActions';

const Profile: FunctionComponent = ({navigation}) => {
  const [loader, setLoader] = useState(false);
  const userData = useSelector(state => state.userReducer.userData);
  const dispatch = useDispatch();

  const logOutUser = () => {
    setLoader(true);
    axios
      .post('http://192.168.43.1:8000/api/v1/users/logout', {_id: userData._id})
      .then(res => {
        const result = res.data;
        setLoader(false);
        dispatch(logOut());
        // navigation.navigate('Home');
      })
      .catch(e => {
        setLoader(false);
        console.log('e', e);
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.subContainer}>
        <Loader showModal={loader} LoaderColor={'black'} LoaderSize={'large'} />
        <TouchableOpacity
          onPress={() => navigation.navigate('Channel',{item:{userId:userData._id}})}
          style={styles.mainOpacity}>
          <View style={styles.iconView}>
            {/* <Ionicons name="person-outline" style={styles.icon} /> */}
            <Image source={{uri: userData?.avatar}} style={styles.icon} />
          </View>
          <View style={styles.iconMainText}>
            <Text style={styles.iconText}>{userData?.fullname}</Text>
            <Text style={styles.channelId}>{userData?.username}</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.infoView}>
          <TouchableOpacity style={styles.infoOpacity}>
            <FontAwesome name="history" color="#000" style={styles.infoIcon} />
            <Text style={styles.infoText}>History</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.infoOpacity}>
            <MaterialIcons
              name="video-library"
              color="#000"
              style={styles.infoIcon}
            />
            <Text style={styles.infoText}>Your Videos</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => logOutUser()}
            style={styles.infoOpacity}>
            <MaterialCommunityIcons
              name="logout"
              color="#000"
              style={styles.infoIcon}
            />
            <Text style={styles.infoText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  subContainer: {
    marginTop: responsiveHeight(4),
    marginHorizontal: responsiveWidth(6),
  },
  icon: {
    height: responsiveHeight(10),
    width: responsiveHeight(10),
    borderRadius: responsiveHeight(5),
  },
  mainOpacity: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconView: {
    height: responsiveHeight(10),
    width: responsiveHeight(10),
    borderRadius: responsiveHeight(5),
    backgroundColor: '#FF6F6F',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    color: '#000',
    fontSize: responsiveFontSize(3),
    fontWeight: 'bold',
  },
  iconMainText: {
    marginLeft: responsiveWidth(2),
  },
  channelId: {
    color: '#000',
  },
  infoView: {
    marginTop: responsiveHeight(4),
  },
  infoText: {
    color: '#000',
    fontSize: responsiveFontSize(2.5),
    fontWeight: 'bold',
  },
  infoOpacity: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: responsiveHeight(4),
    backgroundColor: '#fff',
    elevation: 2,
    padding: responsiveWidth(5),
    borderRadius: responsiveHeight(1),
  },
  infoIcon: {
    fontSize: responsiveFontSize(2.5),
    marginRight: responsiveWidth(6),
  },
});
