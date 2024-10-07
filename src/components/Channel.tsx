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
// import Ionicons from 'react-native-vector-icons/Ionicons';

const Channel: FunctionComponent = ({route, navigation}) => {
  const [records, setRecords] = useState(route?.params?.item);
  const [data, setData] = useState();

  const fetchUserVideos = async () => {
    const res = await axios.get(
      `http://192.168.43.1:8000/api/v1/videos/user-profile/${records?.userId}`,
    );
    const result = res.data;
    setData(result?.data);
  };

  useEffect(() => {
    fetchUserVideos();
  }, [records?.userId]);

  const videos = [
    {
      id: 1,
      image: 'https://picsum.photos/200/300?random=1',
      title: 'Exploring the Universe',
      views: '150k',
      uploaded: '2 hours ago',
      duration: '10:05',
    },
    {
      id: 2,
      image: 'https://picsum.photos/200/300?random=2',
      title: 'Top 10 Coding Tips',
      views: '250k',
      uploaded: '1 day ago',
      duration: '15:30',
    },
    {
      id: 3,
      image: 'https://picsum.photos/200/300?random=3',
      title:
        'React Native Tutorial React Native Tutorial React Native Tutorial',
      views: '300k',
      uploaded: '3 days ago',
      duration: '20:45',
    },
    {
      id: 4,
      image: 'https://picsum.photos/200/300?random=4',
      title: 'Travel Vlog in Japan',
      views: '180k',
      uploaded: '5 hours ago',
      duration: '12:20',
    },
    {
      id: 5,
      image: 'https://picsum.photos/200/300?random=5',
      title: 'Gaming Highlights',
      views: '500k',
      uploaded: '2 weeks ago',
      duration: '9:50',
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

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scroll}
        alwaysBounceVertical={false}
        showsVerticalScrollIndicator={false}>
        {data ? (
          <ImageBackground
            source={{uri: data[0]?.userProfile?.coverImage}}
            style={styles.backgroundImage}
            resizeMode="cover"
          />
        ) : (
          <ImageBackground
            source={{
              uri: 'https://picsum.photos/200/300?random=1',
            }}
            style={styles.backgroundImage}
            resizeMode="cover"
          />
        )}

        <View style={styles.title}>
          <TouchableOpacity style={styles.iconOpacity}>
            {data ? (
              <Image
                source={{
                  uri: data[0]?.userProfile?.avatar,
                }}
                style={styles.mainIcon}
              />
            ) : (
              <Image
                source={{
                  uri: 'https://picsum.photos/200/300?random=1',
                }}
                style={styles.mainIcon}
              />
            )}
          </TouchableOpacity>
          <View style={styles.titleView}>
            <Text style={styles.titleText}>
              {data && data[0]?.userProfile?.fullname}
            </Text>
            <Text style={styles.titleText1}>
              {data && data[0]?.userProfile?.username}
            </Text>
            <Text
              style={
                styles.subscriberText
              }>{`1.01M subscribers •  ${data?.length} videos`}</Text>
          </View>
        </View>

        <View style={styles.subView}>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Subscribe</Text>
          </TouchableOpacity>
          <Text style={styles.heading}>Videos</Text>
          <FlatList
            data={data}
            contentContainerStyle={{
              paddingBottom: responsiveHeight(10),
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
                      avatar: item?.avatar,
                      username: item?.username,
                    },
                  });
                  // navigation.dangerouslyGetParent().setOptions({
                  //   tabBarVisible: false
                  // });
                }}
                style={styles.flatListView}>
                <View style={styles.imageView}>
                  <Image source={{uri: item.thumbnail}} style={styles.image} />
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
                    {item.title.length > 40
                      ? `${item.title.slice(0, 40)}....`
                      : item.title}
                  </Text>
                  <Text style={styles.nameText}>
                    {item?.userProfile?.username}
                  </Text>
                  <Text style={styles.videoViews}>{`${
                    item.Views
                  } views • ${timeAgo(item.createdAt)}`}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default Channel;

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
    fontSize: responsiveFontSize(2.5),
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
});
