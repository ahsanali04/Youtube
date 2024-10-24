import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Dimensions,
} from 'react-native';
import React, {FunctionComponent, useState, useEffect} from 'react';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import Foundation from 'react-native-vector-icons/Foundation';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useSelector} from 'react-redux';
import axios from 'axios';
import {BASE_URL} from '@env';

const Home: FunctionComponent = ({navigation}) => {
  const [isLandscape, setIsLandscape] = useState(false);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);

  // Function to check the orientation and update the state
  const checkOrientation = () => {
    const {width, height} = Dimensions.get('window');
    setIsLandscape(width > height);
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await axios.get(
        `${BASE_URL}/api/v1/videos/channel/detail`,
      );
      const res = result.data;
      console.log('res.data', res.data)
      setVideos(res.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };
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
    fetchData();
  }, []);

  useEffect(() => {
    // Set initial orientation
    checkOrientation();

    // Listen to orientation changes
    Dimensions.addEventListener('change', checkOrientation);
  }, []);
  const category = [
    {
      category: 'Dubbing',
      id: 1,
    },
    {
      category: 'News',
      id: 2,
    },
    {
      category: 'Music',
      id: 3,
    },
    {
      category: 'Cricket',
      id: 4,
    },
    {
      category: 'Drama',
      id: 5,
    },
    {
      category: 'Movies',
      id: 6,
    },
  ];

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

  const VideoItem = ({
    title,
    channelName,
    Views,
    uploadedDate,
    imageUrl,
    duration,
    description,
    videoLink,
    owner,
    avatar,
    username,
    videoId,
  }) => {
    const userData = useSelector(state => state.userReducer.userData);

    return (
      <View style={isLandscape ? styles.videoItem1 : styles.videoItem}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Watch', {
              item: {
                title,
                channelName,
                Views,
                uploadedDate,
                imageUrl,
                duration,
                description,
                videoLink,
                owner,
                avatar,
                username,
                videoId,
              },
            });
            // Hide the tab bar on this screen
            navigation.getParent()?.setOptions({
              tabBarStyle: {display: 'none'},
            });
          }}>
          <Image
            source={{uri: imageUrl}}
            style={isLandscape ? styles.thumbnail1 : styles.thumbnail}
          />
          <ScrollView
            style={styles.scroll}
            horizontal
            showsHorizontalScrollIndicator={false}>
            <View style={styles.duration1}>
              <Text style={styles.duration}>{convertVideoTime(duration)}</Text>
            </View>
          </ScrollView>
        </TouchableOpacity>
        <View style={styles.videoInfo}>
          <View style={styles.channelIconView}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('Channel', {
                  item: {userId: owner, username: username},
                })
              }
              style={styles.channelOpacity}>
              {avatar ? (
                <Image source={{uri: avatar}} style={styles.channelIcon} />
              ) : (
                <Ionicons name="person" style={styles.channelIcon} />
              )}
            </TouchableOpacity>
            <View style={styles.detailView}>
              <Text style={styles.title}>
                {title.length > 35 ? title.slice(0, 30) + '....' : title}
              </Text>
              <View style={styles.Views}>
                <Text style={styles.channelName}>{username}</Text>
                <Text style={styles.details}>
                  {Views} views · {timeAgo(uploadedDate)}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.subContainer}>
        <View style={styles.topBar}>
          <View style={styles.appView}>
            <Foundation name="video" style={styles.appIcon} />
            <Text style={styles.headingText}>Cinema</Text>
          </View>
          <TouchableOpacity>
            <AntDesign name="search1" style={styles.searchIcon} />
          </TouchableOpacity>
        </View>
        <ScrollView
          showsHorizontalScrollIndicator={false}
          style={styles.scrollView}
          horizontal>
          <TouchableOpacity style={styles.opacity}>
            <Text style={styles.scrollText}>All</Text>
          </TouchableOpacity>
          {category &&
            category.map(item => (
              <TouchableOpacity key={item?.id} style={styles.opacity}>
                <Text style={styles.scrollText}>{item?.category}</Text>
              </TouchableOpacity>
            ))}
        </ScrollView>
      </View>
      <View style={[isLandscape ? {flex: 1} : styles.flatlistView]}>
        {loading ? (
          <FlatList
            data={[1, 1]}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            style={styles.flatlist}
            contentContainerStyle={{
              paddingBottom: responsiveHeight(10),
            }}
            renderItem={({item}) => (
              <View style={isLandscape ? styles.videoItem1 : styles.videoItem}>
                <View>
                  <View
                    style={
                      isLandscape ? styles.loadingImage1 : styles.loadingImage
                    }></View>
                </View>
                <View style={styles.videoInfo}>
                  <View style={styles.channelIconView}>
                    <View style={styles.channelOpacity}>
                      <View style={styles.channelIcon}></View>
                    </View>
                    <View style={styles.detailView}>
                      <View style={styles.loadingText}></View>

                      <View style={styles.loadingText1}></View>
                    </View>
                  </View>
                </View>
              </View>
            )}
          />
        ) : (
          <FlatList
            data={videos}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            style={styles.flatlist}
            contentContainerStyle={{
              paddingBottom: responsiveHeight(10),
            }}
            renderItem={({item}) => (
              <VideoItem
                title={item?.title}
                channelName={item?.channelName}
                Views={item?.Views}
                uploadedDate={item?.createdAt}
                imageUrl={item?.thumbnail}
                duration={item?.duration}
                description={item?.description}
                videoLink={item?.videoFile}
                owner={item?.owner}
                avatar={item?.uploader?.avatar}
                username={item?.uploader?.username}
                videoId={item?._id}
              />
            )}
          />
        )}
      </View>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  subContainer: {
    // flex: 1,
    marginTop: responsiveHeight(2),
  },
  topBar: {
    marginHorizontal: responsiveWidth(5),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  appIcon: {
    color: '#FF2400',
    fontSize: responsiveFontSize(4),
    marginRight: responsiveWidth(2),
  },
  appView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headingText: {
    color: '#000',
    fontSize: responsiveFontSize(3),
    fontWeight: 'bold',
  },
  searchIcon: {
    color: '#000',
    fontSize: responsiveFontSize(2.5),
  },
  scrollView: {
    marginLeft: responsiveHeight(2.5),
  },
  opacity: {
    marginVertical: responsiveHeight(2),
    backgroundColor: '#e6e6e6',
    height: responsiveHeight(4),
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: responsiveWidth(2),
    borderRadius: responsiveWidth(2),
    marginRight: responsiveWidth(2),
  },
  scrollText: {
    color: '#000',
  },
  videoItem: {
    // flexDirection: 'row',
    flex: 1,
    borderBottomWidth: 1,
    borderColor: '#fff',
    paddingBottom: 10,
  },
  thumbnail: {
    width: responsiveWidth(100),
    height: responsiveHeight(30),
    marginRight: 10,
    marginHorizontal: responsiveWidth(0.1),
  },
  videoInfo: {
    flex: 1,
    // flexDirection:'row',
    marginHorizontal: responsiveWidth(3),
    paddingRight: responsiveWidth(8),
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    // marginBottom: 5,
    color: '#000',
    flexWrap: 'wrap',
    // marginLeft:responsiveWidth(2)
  },
  channelName: {
    fontSize: 12,
    color: '#555',
    marginRight: responsiveWidth(2),
  },
  details: {
    fontSize: 12,
    color: '#888',
    marginTop: 3,
  },
  duration: {
    fontSize: 12,
    color: '#fff',
    fontWeight: 'bold',
    marginTop: 3,
  },
  flatlistView: {
    flex: 1,
    marginTop: responsiveHeight(2),
  },
  channelIcon: {
    height: responsiveWidth(12),
    width: responsiveWidth(12),
    borderRadius: responsiveWidth(6),
  },
  channelIconView: {
    flexDirection: 'row',
    marginVertical: responsiveHeight(2),
    alignItems: 'center',
  },
  Views: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    // paddingLeft:responsiveWidth(13),
    // bottom:10
  },
  channelOpacity: {
    height: responsiveWidth(12),
    width: responsiveWidth(12),
    backgroundColor: '#e6e6e6',
    borderRadius: responsiveWidth(6),
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailView: {
    marginLeft: responsiveWidth(2),
  },
  flatlist: {
    flexGrow: 1,
  },
  duration1: {
    backgroundColor: '#333333',
    marginVertical: responsiveHeight(2),
    height: responsiveHeight(4),
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: responsiveWidth(2),
    borderRadius: responsiveWidth(2),
  },
  scroll: {
    bottom: 0,
    position: 'absolute',
    right: 14,
  },
  thumbnail1: {
    width: responsiveWidth(45),
    height: responsiveHeight(15),
    marginRight: 10,
    marginHorizontal: responsiveWidth(0.1),
  },
  videoItem1: {
    flex: 1,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#fff',
    paddingBottom: 10,
    marginHorizontal: responsiveWidth(4),
  },
  loadingImage: {
    width: responsiveWidth(100),
    height: responsiveHeight(30),
    marginRight: 10,
    marginHorizontal: responsiveWidth(0.1),
    backgroundColor: '#e6e6e6',
  },
  loadingImage1: {
    width: responsiveWidth(45),
    height: responsiveHeight(15),
    marginRight: 10,
    marginHorizontal: responsiveWidth(0.1),
    backgroundColor: '#e6e6e6',
  },
  loadingText: {
    height: responsiveHeight(2),
    backgroundColor: '#e6e6e6',
    width: responsiveWidth(40),
  },
  loadingText1: {
    height: responsiveHeight(2),
    backgroundColor: '#e6e6e6',
    width: responsiveWidth(60),
    marginTop: responsiveHeight(1),
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
