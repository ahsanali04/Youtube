import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  FlatList,
  ScrollView,
} from 'react-native';
import React, {FunctionComponent, useState, useEffect} from 'react';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Loader from '../../common/Loader';
import axios from 'axios';
import {useDispatch, useSelector} from 'react-redux';
import {logOut} from '../../redux_/actions/userActions';
import {BASE_URL} from '@env';

const Profile: FunctionComponent = ({navigation}) => {
  const [loader, setLoader] = useState(false);
  const userData = useSelector(state => state.userReducer.userData);
  const dispatch = useDispatch();
  const [data, setData] = useState();

  const fetchUserHistory = async () => {
    setLoader(true);
    const HistoryData = {
      _id: userData._id,
    };
    try {
      const res = await axios.post(
        `${BASE_URL}/api/v1/users/watch-history`,
        HistoryData,
      );
      const result = res.data;
      console.log('res.data', res.data.data[0]);
      setData(result?.data[0]?.watchHistory);
      setLoader(false);
    } catch (error) {
      setLoader(false);
      console.log(error);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchUserHistory();
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    navigation.addListener('focus', () => {
      navigation.getParent()?.setOptions({
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
      });
    });
  }, []);

  const logOutUser = () => {
    setLoader(true);
    console.log(' userData._id', userData._id);
    axios
      .post(`${BASE_URL}/api/v1/users/logout`, {
        _id: '6704100747caed00633fdecc',
      })
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

  const convertVideoTime = time => {
    const durationInSeconds = Math.floor(time);
    const minutes = Math.floor(durationInSeconds / 60); // Get the whole minutes
    const seconds = durationInSeconds % 60;
    return `${minutes}:${seconds}`;
  };

  function timeAgo(date) {
    const now = new Date();
    const past = new Date(date);
    const diffInSeconds = Math.floor((now - past) / 1000);

    const timeIntervals = {
      year: 31536000, // 60 * 60 * 24 * 365
      month: 2592000, // 60 * 60 * 24 * 30
      week: 604800, // 60 * 60 * 24 * 7
      day: 86400, // 60 * 60 * 24
      hour: 3600, // 60 * 60
      minute: 60,
      second: 1,
    };

    for (const [unit, secondsInUnit] of Object.entries(timeIntervals)) {
      const elapsed = Math.floor(diffInSeconds / secondsInUnit);

      if (elapsed >= 1) {
        return `${elapsed} ${unit}${elapsed > 1 ? 's' : ''} ago`;
      }
    }

    return 'just now';
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.subContainer}>
        <Loader showModal={loader} LoaderColor={'black'} LoaderSize={'large'} />
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Channel', {
              item: {userId: userData._id, username: userData?.username},
            });
            navigation.getParent()?.setOptions({
              tabBarStyle: {display: 'none'},
            });
          }}
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
          <View style={styles.infoOpacity1}>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <View style={{flexDirection: 'row'}}>
                <FontAwesome
                  name="history"
                  color="#000"
                  style={styles.infoIcon}
                />
                <Text style={styles.infoText}>History</Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('History');
                  // Hide the tab bar on this screen
                  navigation.getParent()?.setOptions({
                    tabBarStyle: {display: 'none'},
                  });
                }}
                style={{
                  borderColor: 'black',
                  borderWidth: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 4,
                  borderRadius: responsiveWidth(5),
                }}>
                <Text
                  style={{
                    color: 'black',
                    fontSize: responsiveFontSize(1.8),
                    fontWeight: '400',
                  }}>
                  View all
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.subView}>
              <FlatList
                data={data}
                horizontal
                contentContainerStyle={
                  {
                    // paddingBottom: responsiveHeight(10),
                  }
                }
                keyExtractor={item => item._id}
                renderItem={({item}) => (
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate('Watch', {
                        item: {
                          title: item?.title,
                          channelName: item?.channelName,
                          Views: item?.Views,
                          uploadedDate: item?.createdAt,
                          imageUrl: item?.imageUrl,
                          duration: item?.duration,
                          description: item?.description,
                          videoLink: item?.videoFile,
                          owner: item?.owner,
                          avatar: item?.owner?.avatar,
                          username: item?.owner?.username,
                          videoId: item?._id,
                        },
                      });

                      navigation.getParent()?.setOptions({
                        tabBarStyle: {display: 'none'},
                      });
                    }}
                    style={styles.flatListView}>
                    <View style={styles.imageView}>
                      <Image
                        source={{uri: item.thumbnail}}
                        style={styles.image}
                      />
                      <ScrollView horizontal style={styles.durationMain}>
                        <View style={styles.duration}>
                          <Text style={styles.durationText}>
                            {convertVideoTime(item.duration)}
                          </Text>
                        </View>
                      </ScrollView>
                    </View>
                    <View style={styles.videoTitle}>
                      <Text style={styles.videTitleText}>
                        {item?.title?.length > 18
                          ? `${item.title.slice(0, 18)}....`
                          : item.title}
                      </Text>
                      <Text style={styles.nameText}>
                        {item?.owner?.username}
                      </Text>
                      <Text style={styles.videoViews}>{`${
                        item.Views
                      } views • ${timeAgo(item.createdAt)}`}</Text>
                    </View>
                  </TouchableOpacity>
                )}
              />
            </View>
          </View>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Channel', {
                item: {userId: userData._id, username: userData?.username},
              });
              navigation.getParent()?.setOptions({
                tabBarStyle: {display: 'none'},
              });
            }}
            style={styles.infoOpacity}>
            <MaterialIcons
              name="video-library"
              color="#000"
              style={styles.infoIcon}
            />
            <Text style={styles.infoText}>Your Videos</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('ChangePassword'),
                // Hide the tab bar on this screen
                navigation.getParent()?.setOptions({
                  tabBarStyle: {display: 'none'},
                });
            }}
            style={styles.infoOpacity}>
            <MaterialCommunityIcons
              name="update"
              color="#000"
              style={styles.infoIcon}
            />
            <Text style={styles.infoText}>Update Password</Text>
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
      </ScrollView>
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
    marginBottom: responsiveHeight(8),
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
    marginTop: responsiveHeight(1),
  },
  infoText: {
    color: '#000',
    fontSize: responsiveFontSize(2.5),
    fontWeight: 'bold',
  },
  infoOpacity: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: responsiveHeight(3),
    backgroundColor: '#fff',
    elevation: 2,
    marginBottom: responsiveHeight(1),
    paddingVertical: responsiveWidth(5),
    paddingHorizontal: responsiveWidth(2),
    borderRadius: responsiveHeight(1),
  },
  infoOpacity1: {
    // flexDirection: 'row',
    // alignItems: 'center',
    marginTop: responsiveHeight(4),
    backgroundColor: '#fff',
    elevation: 2,
    paddingVertical: responsiveWidth(5),
    paddingHorizontal: responsiveWidth(2),
    borderRadius: responsiveHeight(1),
  },
  infoIcon: {
    fontSize: responsiveFontSize(2.4),
    alignSelf: 'center',
    marginRight: responsiveWidth(6),
  },
  subView: {
    marginTop: responsiveHeight(2),
  },
  button: {
    height: responsiveHeight(7),
    backgroundColor: '#000',
    borderRadius: responsiveHeight(4),
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: responsiveFontSize(2),
    fontWeight: '600',
  },
  heading: {
    fontSize: responsiveFontSize(3.3),
    color: '#000',
    marginTop: responsiveHeight(2),
    fontWeight: 'bold',
  },
  flatListView: {
    flex: 1,
    marginHorizontal: responsiveWidth(2),
  },
  nameText: {
    fontSize: responsiveFontSize(1.6),
    marginTop: responsiveHeight(0.5),
    color: 'gray',
    flexWrap: 'wrap',
  },
  image: {
    height: responsiveHeight(14),
    width: responsiveWidth(45),
    borderRadius: responsiveWidth(1),
  },
  duration: {
    backgroundColor: '#000',
    padding: responsiveHeight(0.5),
    borderRadius: responsiveHeight(1),
  },
  durationText: {
    color: '#fff',
  },
  durationMain: {
    bottom: responsiveHeight(1),
    right: responsiveWidth(2),
    position: 'absolute',
  },
  imageView: {
    height: responsiveHeight(14),
    width: responsiveWidth(45),
  },
  videoTitle: {
    marginLeft: responsiveWidth(2),
    flex: 1,
  },
  videTitleText: {
    fontSize: responsiveFontSize(2),
    fontWeight: '500',
    flexWrap: 'wrap',
    color: '#000',
  },
  videoViews: {
    fontSize: responsiveFontSize(1.6),
    marginTop: responsiveHeight(1),
    color: 'gray',
    flexWrap: 'wrap',
  },
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
