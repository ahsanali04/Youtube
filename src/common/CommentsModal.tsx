import React, {useState, useEffect} from 'react';
import {
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,b
  StyleSheet
} from 'react-native';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import {BASE_URL} from '@env';
import {useSelector} from 'react-redux';
import Loader from './Loader';

const CommentsModal = ({visible, setModal, comments: initialComments, videoId}) => {
  const [loader, setLoader] = useState(false);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]); // Initialize comments state

  const userData = useSelector(state => state.userReducer.userData);

  // Set initial comments when modal opens
  useEffect(() => {
    if (initialComments) {
      setComments(initialComments);
    }
  }, [initialComments]);

  // Function to post comment
  const postComment = async () => {
    setLoader(true);

    const userRecord = {
      fullname: userData?.fullname,
      username: userData?.username,
      avatar: userData?.avatar
    };

    const userDetails = {
      avatar: userRecord.avatar,
      fullname: userRecord.fullname,
      username: userRecord.username
    };

    const data = {
      content: comment,
      videoId: videoId,
      owner: userData?._id,
    };


    try {
      const res = await axios.post(
        `${BASE_URL}/api/v1/comments/add/comment`,
        data,
      );
      const newComment = res.data.data; // Assuming the new comment is in res.data.data
      setLoader(false);
      setComment('');
      // const latestComment ={userDetails,...newComment}
      // console.log('first', [userDetails,...newComment])
      // setComments([userDetails,...newComment]);
    } catch (error) {
      setLoader(false);
      console.log('Error posting comment:', error);
    }
  };

  // Time-ago calculation (unchanged)
  function timeAgo(date) {
    const now = new Date();
    const past = new Date(date);
    const diffInSeconds = Math.floor((now - past) / 1000);

    const timeIntervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
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
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      swipeDirection="down">
      <Loader showModal={loader} LoaderColor={'black'} LoaderSize={'large'} />

      <View
        style={{
          flex: 2,
          backgroundColor: '#fff',
          marginTop: responsiveHeight(30),
          borderRadius: responsiveHeight(2),
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            top: responsiveHeight(2),
            paddingHorizontal: responsiveHeight(1),
          }}>
          <Text
            style={{
              color: 'black',
              fontWeight: 'bold',
              fontSize: responsiveFontSize(2.5),
            }}>
            Comments
          </Text>
          <TouchableOpacity onPress={() => setModal(false)}>
            <Entypo
              name="cross"
              color="red"
              style={{
                fontSize: responsiveFontSize(4),
              }}
            />
          </TouchableOpacity>
        </View>
        <View
          style={{
            marginTop: responsiveHeight(3),
            borderWidth: 0.5,
            borderColor: 'gray',
          }}
        />

        <View style={{flex: 1}}>
          {/* FlatList rendering comments */}
          <FlatList
            showsVerticalScrollIndicator={false}
            alwaysBounceVertical={false}
            data={comments}
            keyExtractor={item => item._id || Math.random().toString()} // Use _id or fallback to random
            contentContainerStyle={{
              paddingBottom: responsiveHeight(8),
            }}
            renderItem={({item}) => (
              <View
                style={{
                  marginTop: responsiveHeight(2),
                  flexDirection: 'row',
                  marginBottom: responsiveHeight(4),
                  paddingHorizontal: responsiveWidth(4),
                }}>
                {item ? (
                  <Image
                    source={{
                      uri: item?.userDetails?.avatar,
                    }}
                    style={{
                      height: responsiveHeight(5),
                      width: responsiveHeight(5),
                      borderRadius: responsiveHeight(2.5),
                      marginRight: responsiveHeight(2),
                    }}
                  />
                ) : null}
                <View>
                  <Text
                    style={{
                      color: 'gray',
                      flexWrap: 'wrap',
                      paddingRight: responsiveHeight(6),
                    }}>
                    {item?.userDetails?.username} • {timeAgo(item?.createdAt)}
                  </Text>
                  <Text
                    style={{
                      color: '#000',
                      flexWrap: 'wrap',
                      paddingRight: responsiveHeight(6),
                    }}>
                    {item?.content}
                  </Text>
                </View>
              </View>
            )}
          />
        </View>

        <KeyboardAvoidingView
          style={{
            flexDirection: 'row',
            position: 'absolute',
            bottom: responsiveHeight(1),
            paddingHorizontal: responsiveWidth(2),
            alignItems: 'center',
            backgroundColor: '#e6e6e6',
            width: '100%',
          }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <View style={styles.inputFieldView}>
            <TextInput
              placeholder="Add comments"
              placeholderTextColor={'#b3b3b3'}
              value={comment}
              onChangeText={e => setComment(e)}
              style={styles.input}
            />
          </View>
          <TouchableOpacity
            disabled={comment.length < 1}
            onPress={() => postComment()}>
            <Ionicons
              name="send"
              color="gray"
              style={{
                fontSize: responsiveFontSize(4),
                marginLeft: responsiveWidth(2),
              }}
            />
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

export default CommentsModal;

const styles = StyleSheet.create({
  inputFieldView: {
    borderWidth: 2,
    borderColor: '#e6e6e6',
    borderRadius: responsiveWidth(3),
    width: responsiveWidth(85),
    backgroundColor: '#fff',
  },
  input: {
    minHeight: responsiveHeight(7.5),
    marginLeft: responsiveWidth(3),
    color: 'black',
  },
});
