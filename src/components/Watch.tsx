import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import React, {FunctionComponent, useState, useRef} from 'react';
import {RootStackParam} from './navigation/AppNavigation';
import {NavigationContainerProps, RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
// import YouTube from 'react-native-youtube';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import Video, {VideoRef} from 'react-native-video';
import {getDate} from '../common/Date';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Slider from '@react-native-community/slider';
import CommentsModal from '../common/CommentsModal';

interface WatchScreenProp {
  navigation: StackNavigationProp<RootStackParam, 'Watch'>;
  route: RouteProp<RootStackParam, 'Watch'>;
}

interface Root {
  title: string;
  channelName: string;
  views: string;
  uploadedDate: string;
  imageUrl: string;
  duration: string;
  publishedDate: string; // ISO 8601 format
}

function calculatePublishedDate(uploadedDate) {
  const now = new Date();

  if (uploadedDate.includes('days ago')) {
    const daysAgo = parseInt(uploadedDate.split(' ')[0]);
    now.setDate(now.getDate() - daysAgo);
  } else if (uploadedDate.includes('week ago')) {
    now.setDate(now.getDate() - 7);
  } else if (uploadedDate.includes('weeks ago')) {
    const weeksAgo = parseInt(uploadedDate.split(' ')[0]);
    now.setDate(now.getDate() - weeksAgo * 7);
  } else if (uploadedDate.includes('month ago')) {
    now.setMonth(now.getMonth() - 1);
  } else if (uploadedDate.includes('months ago')) {
    const monthsAgo = parseInt(uploadedDate.split(' ')[0]);
    now.setMonth(now.getMonth() - monthsAgo);
  } else if (uploadedDate.includes('year ago')) {
    now.setFullYear(now.getFullYear() - 1);
  } else if (uploadedDate.includes('years ago')) {
    const yearsAgo = parseInt(uploadedDate.split(' ')[0]);
    now.setFullYear(now.getFullYear() - yearsAgo);
  }

  return now.toISOString(); // Returns the ISO 8601 date format
}

const Watch: FunctionComponent<WatchScreenProp> = ({
  route,
}: WatchScreenProp) => {
  const [Data] = useState<Root>(route?.params?.item);
  const videoRef = useRef<VideoRef>(null);

  const [modal, setModal] = useState(false);
  const [paused, setPaused] = useState(false);
  const [pauseButton, setPauseButton] = useState(false);
  const [currentTime, setCurrentTime] = useState(0); // Current play time

  const togglePause = () => {
    setPaused(!paused);
  };

  // Called during video playback to track progress
  const onVideoProgress = data => {
    setCurrentTime(data.currentTime);
  };

  // Seek the video position when user drags the slider
  const onSeek = time => {
    videoRef.current.seek(time);
    setCurrentTime(time); // Manually update the currentTime
  };

  const convertVideoTime = time => {
    const durationInSeconds = Math.floor(time);
    const minutes = Math.floor(durationInSeconds / 60); // Get the whole minutes
    const seconds = durationInSeconds % 60;
    return `${minutes}:${seconds}`;
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={{flex: 1}}
        contentContainerStyle={{
          paddingBottom: responsiveHeight(10),
        }}>
        <View>
          {/* <YouTube
          videoId={Data.youtube_video_id}
          play
          fullscreen
          loop
          style={styles.video}
          /> */}
          <TouchableOpacity onPress={() => setPauseButton(!pauseButton)}>
            <Video
              ref={videoRef}
              source={{uri: Data?.videoLink}}
              paused={paused}
              style={styles.video}
              resizeMode="cover"
              onProgress={onVideoProgress} // Track progress
            />
          </TouchableOpacity>

          {/* Overlay UI */}
          {pauseButton ? (
            <View style={styles.overlay}>
              <View style={styles.bottomBar}>
                <TouchableOpacity onPress={togglePause}>
                  <AntDesign
                    name={paused ? 'play' : 'pause'}
                    style={styles.icon}
                  />
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <></>
          )}
          {pauseButton ? (
            <View style={styles.time}>
              <Text style={{color: '#fff', fontWeight: 'bold'}}>
                {convertVideoTime(currentTime)}
              </Text>
            </View>
          ) : (
            <></>
          )}

          <Slider
            style={styles.progressBar}
            minimumValue={0}
            maximumValue={Data?.duration} // Max value is video duration
            value={currentTime} // Current value is playback time
            onSlidingComplete={onSeek} // Seek video when user releases slider
            minimumTrackTintColor="red" // Played portion of the video
            maximumTrackTintColor="black" // Remaining portion of the video
            thumbTintColor="red" // Color of the slider thumb
          />

          {/* <Image source={{uri: Data.imageUrl}} style={styles.video} /> */}
        </View>
        <View style={styles.subContianer}>
          <Text style={styles.textColor}>Description</Text>
        </View>
        <View
          style={{
            borderBottomColor: '#e6e6e6',
            marginTop: responsiveScreenHeight(2),
            borderBottomWidth: StyleSheet.hairlineWidth,
          }}
        />
        <View style={styles.subContianer}>
          <Text style={styles.title}>{Data.title}</Text>
          <View style={styles.descriptionView}>
            <Text style={styles.description}>{Data.description}</Text>
          </View>
        </View>
        <View style={styles.desView}>
          <View>
            <Text style={styles.headText}>{Data.language}</Text>
            <Text style={styles.desText}>language</Text>
          </View>
          <View>
            <Text style={styles.headText}>{Data.Views}</Text>
            <Text style={styles.desText}>Views</Text>
          </View>
          <View>
            <Text style={styles.headText}>
              {getDate(calculatePublishedDate(Data.uploadedDate))}
            </Text>
            <Text style={styles.desText}>Published</Text>
          </View>
        </View>
        <View style={styles.subContianer}>
          {/* <Text style={styles.textColor}>Keywords</Text> */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.contentContainer}>
            {/* {Data.genres.map((item, index) => (
            <View
              key={index}
              style={[styles.listView]}>
              <Text style={[styles.textClr]}>{item}</Text>
            </View>
          ))} */}
          </ScrollView>
        

        <TouchableOpacity
          style={{
            marginTop: responsiveHeight(1),
            backgroundColor: '#e6e6e6',
            padding: responsiveHeight(2),
            borderRadius: responsiveHeight(2),
          }}
          onPress={() => setModal(true)}>
          <Text
            style={{
              color: 'gray',
              fontSize: responsiveFontSize(2),
              fontWeight: 'bold',
            }}>
            Comments 3
          </Text>
          <View style={{marginTop: responsiveHeight(2), flexDirection: 'row'}}>
            <Image
              source={{uri: 'https://randomuser.me/api/portraits/men/45.jpg'}}
              style={{
                height: responsiveHeight(5),
                width: responsiveHeight(5),
                borderRadius: responsiveHeight(2.5),
                marginRight: responsiveHeight(2),
              }}
            />
            <View>
              <Text
                style={{
                  color: 'gray',
                  flexWrap: 'wrap',
                  paddingRight: responsiveHeight(6),
                }}>
                Hello this video is one of the great video and one of my
                personally favourite
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
      </ScrollView>
      <CommentsModal visible={modal} setModal={setModal} />
    </View>
  );
};

export default Watch;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  video: {
    alignSelf: 'stretch',
    height: responsiveHeight(28),
    backgroundColor: '#fff',
  },
  subContianer: {
    // flex: 1,
    marginTop: responsiveHeight(2),
    marginHorizontal: responsiveScreenWidth(4),
  },
  textColor: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: responsiveScreenFontSize(2.5),
  },
  desView: {
    // flex: 1,
    marginTop: responsiveHeight(3),
    marginHorizontal: responsiveScreenWidth(10),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  desText: {
    color: 'gray',
    fontSize: responsiveScreenFontSize(1.5),
    textAlign: 'center',
  },
  headText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: responsiveScreenFontSize(2),
    textAlign: 'center',
  },
  title: {
    fontSize: responsiveScreenFontSize(2),
    color: '#000',
    fontWeight: 'bold',
  },
  textClr: {
    color: '#000',
  },
  listView: {
    marginTop: 10,
    height: 40,
    backgroundColor: 'gray',
    marginHorizontal: 4,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 17,
    marginBottom: responsiveHeight(3),
  },
  contentContainer: {
    flexGrow: 1,
  },
  descriptionView: {
    marginTop: responsiveHeight(2),
    paddingHorizontal: responsiveScreenWidth(4),
    paddingVertical: responsiveHeight(2),
    backgroundColor: '#e6e6e6',
    borderRadius: responsiveWidth(3),
  },
  description: {
    color: 'gray',
  },
  overlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 110,
    justifyContent: 'space-between',
  },
  topBar: {
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  videoTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 15,
    alignSelf: 'center',
    borderRadius: responsiveWidth(50),
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  icon: {
    color: 'white',
    fontSize: responsiveFontSize(5),
  },
  liked: {
    color: 'red',
  },
  progressBar: {
    marginHorizontal: 10,
    // height: 40,
  },
  time: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Semi-transparent background
    paddingHorizontal: 8, // Padding for flexible growth
    borderRadius: 5, // Rounded corners
    bottom: 30,
    alignItems: 'center',
    left: 4,
  },
});
