import React, {useState} from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Platform,
  FlatList,
  Image,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import Loader from './Loader';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';

const CommentsModal = ({visible, setModal}) => {
  const [loader, setLoader] = useState(false);

  return (
    <Modal
      animationType="slideInUp"
      transparent={true}
      visible={visible}
      swipeDirection="down">
      <Loader showModal={loader} LoaderColor={'black'} LoaderSize={'large'} />

      <View
        style={{
          flex: 2,
          backgroundColor: '#fff',
        //   marginTop: responsiveHeight(10),
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
          <FlatList
            showsVerticalScrollIndicator={false}
            alwaysBounceVertical={false}
            data={[1, 1]}
            contentContainerStyle={{
              paddingBottom: responsiveHeight(8),
            }}
            renderItem={({item}) => (
              <View
                style={{
                  marginTop: responsiveHeight(2),
                  flexDirection: 'row',
                  marginBottom: responsiveHeight(4),
                  paddingHorizontal: responsiveWidth(2),
                }}>
                <Image
                  source={{
                    uri: 'https://randomuser.me/api/portraits/men/45.jpg',
                  }}
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
                    @ahsan • 1 week ago
                  </Text>
                  <Text
                    style={{
                      color: '#000',
                      flexWrap: 'wrap',
                      paddingRight: responsiveHeight(6),
                    }}>
                    Hello this video is one of the great video and one of my
                    personally favourite
                  </Text>
                </View>
              </View>
            )}
          />
        </View>

        {/* KeyboardAvoidingView only for the input field */}
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
              style={styles.input}
            />
          </View>
          <TouchableOpacity>
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
  },
});
