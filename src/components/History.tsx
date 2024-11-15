import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  Image,
  ImageBackground,
  ScrollView,
} from 'react-native';
import React, {FunctionComponent, useState, useEffect} from 'react';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import axios from 'axios';
import {BASE_URL} from '@env';
import Loader from '../common/Loader';
import {useSelector} from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';

const History: FunctionComponent = ({route, navigation}) => {
  const [records, setRecords] = useState(route?.params?.item);
  const [data, setData] = useState();
  const [subscriber, setSubscriber] = useState();
  const [loader, setLoader] = useState(false);
  const userData = useSelector(state => state.userReducer.userData);

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
    // navigation.addListener('focus', () => {
    //   navigation.getParent()?.setOptions({
    //     tabBarStyle: [
    //       {
    //         position: 'absolute',
    //         bottom: 4,
    //         // left: 20,
    //         // right: 20,
    //         elevation: 0,
    //         backgroundColor: '#fff',
    //         height: 60,
    //         borderRadius: 10,
    //         ...styles.shadow,
    //       },
    //     ],
    //   });
    // });

    fetchUserHistory();
  }, []);

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
      <Loader showModal={loader} LoaderColor={'black'} LoaderSize={'large'} />
      {loader ? (
        <View style={{flex: 1, backgroundColor: '#fff'}}></View>
      ) : (
        <ScrollView
          style={styles.scroll}
          alwaysBounceVertical={false}
          showsVerticalScrollIndicator={false}>
          <View style={styles.subView}>
            <View
              style={{
                width: responsiveWidth(100),
                height:
                  Platform.OS === 'ios'
                    ? responsiveHeight(8)
                    : responsiveHeight(10),
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontSize: responsiveFontSize(3.3),
                  color: 'black',
                  fontWeight: 'bold',
                }}>
                History
              </Text>
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={{
                  width: responsiveWidth(10),
                  height: responsiveHeight(5),
                  position: 'absolute',
                  left: responsiveWidth(0.5),
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Ionicons
                  name={'arrow-back'}
                  color={'black'}
                  size={responsiveFontSize(3.2)}
                />
              </TouchableOpacity>
            </View>
            {/* <Text style={styles.heading}>History</Text> */}
            <FlatList
              data={data}
              contentContainerStyle={{
                paddingBottom: responsiveHeight(2),
              }}
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
                      {item?.title?.length > 40
                        ? `${item.title.slice(0, 40)}....`
                        : item.title}
                    </Text>
                    <Text style={styles.nameText}>{item?.owner?.username}</Text>
                    <Text style={styles.videoViews}>{`${
                      item.Views
                    } views • ${timeAgo(item.createdAt)}`}</Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          </View>
        </ScrollView>
      )}
    </View>
  );
};

export default History;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scroll: {
    paddingHorizontal: responsiveWidth(4),
  },
  coverImgae: {
    height: responsiveHeight(14),
    backgroundColor: '#e6e6e6',
    borderRadius: responsiveWidth(2),
  },
  title: {
    marginTop: responsiveHeight(2),
    flexDirection: 'row',
  },
  mainIcon: {
    height: responsiveHeight(11),
    width: responsiveHeight(11),
    borderRadius: responsiveHeight(5.5),
  },
  iconOpacity: {
    height: responsiveHeight(11),
    width: responsiveHeight(11),
    borderRadius: responsiveHeight(5.5),
    backgroundColor: '#e6e6e6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleView: {
    marginLeft: responsiveWidth(2),
    flex: 1,
  },
  titleText: {
    fontSize: responsiveFontSize(3),
    color: '#000',
    fontWeight: 'bold',
    flexWrap: 'wrap',
  },
  titleText1: {
    fontSize: responsiveFontSize(1.8),
    color: '#000',
    flexWrap: 'wrap',
    marginTop: responsiveHeight(0.5),
  },
  subscriberText: {
    fontSize: responsiveFontSize(1.8),
    color: 'gray',
    flexWrap: 'wrap',
    marginTop: responsiveHeight(0.5),
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
    marginTop: responsiveHeight(2),
    flexDirection: 'row',
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
  backgroundImage: {
    height: responsiveHeight(14),
    // width: responsiveWidth(100),
    borderRadius: responsiveWidth(2),
  },
  nameText: {
    fontSize: responsiveFontSize(1.6),
    marginTop: responsiveHeight(0.5),
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
