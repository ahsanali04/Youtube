import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TextInput,
  PermissionsAndroid,
  Image,
  TouchableOpacity,
} from 'react-native';
import React, {FunctionComponent, useState} from 'react';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveScreenWidth,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {Formik} from 'formik';
import * as yup from 'yup';
import Feather from 'react-native-vector-icons/Feather';
import {launchImageLibrary, launchCamera} from 'react-native-image-picker';
import Loader from '../common/Loader';
import axios from 'axios';


interface asset {
  fileName: string;
  fileSize: number;
  height: number;
  type: string;
  uri: string;
  width: number;
}

const Upload: FunctionComponent = ({navigation}) => {
  const [visible, setVisible] = useState(false);
  const [imgUrl, setImgUrl] = useState<string | undefined>();
  const [imgUrl1, setImgUrl1] = useState<string | undefined>();

  const [asset, setAsset] = useState<asset | undefined>();
  const [asset1, setAsset1] = useState<asset | undefined>();
  const [loader, setLoader] = useState(false);


  const pickImage = (whichImg, setFieldValue) => {
    Alert.alert(
      'Choose an action',
      'Pick from Gallery/Camera',
      [
        {text: 'Gallery', onPress: () => openGallery(whichImg, setFieldValue)},
        {text: 'Camera', onPress: () => openCamera(whichImg, setFieldValue)},
      ],
      {
        cancelable: true,
      },
    );
  };

  const openCamera = async (whichImg, setFieldValue) => {
    const options = {
      mediaType: whichImg === 'video' ? 'video' : 'photo',
      quality: 0.3,
      maxHeight: 500,
      maxWidth: 500,
    };

    if (Platform.OS === 'ios') {
      await launchCamera(options, result => {
        // if no image is captured
        console.log('result', result);
        if (!result.assets) {
          return;
        }
        if (whichImg === 'video') {
          console.log('....=====');
          setImgUrl(result.assets[0].uri);
          setAsset(result.assets[0]);
          setFieldValue('video', result.assets[0]);
        } else {
          console.log('....');
          setImgUrl1(result.assets[0].uri);
          setAsset1(result.assets[0]);
          setFieldValue('thumbnail', result.assets[0]);
        }
      });
    }
    if (Platform.OS === 'android') {
      const status = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
      );

      if (status === 'granted') {
        await launchCamera(options, result => {
          // if no image is captured
          if (!result.assets) {
            return;
          }
          if (whichImg === 'video') {
            setImgUrl(result.assets[0].uri);
            setAsset(result.assets[0]);
            setFieldValue('video', result.assets[0]);
          } else {
            setImgUrl1(result.assets[0].uri);
            setAsset1(result.assets[0]);
            setFieldValue('thumbnail', result.assets[0]);
          }
        });
      } else if (status === 'denied') {
      } else if (status === 'never_ask_again') {
        Platform.OS === 'android' &&
          Alert.alert(
            'Permissions required!',

            'Go to Settings > Apps > Cinema > Permissions > Enable access to device camera.',
          );
      }
    }
  };

  const openGallery = async (whichImg, setFieldValue) => {
    const options = {
      mediaType: whichImg === 'video' ? 'video' : 'photo',
      quality: 0.3,
      maxHeight: 500,
      maxWidth: 500,
    };
    await launchImageLibrary(options, result => {
      if (!result.assets) {
        return;
      }
      if (whichImg === 'video') {
        setImgUrl(result.assets[0].uri);
        setAsset(result.assets[0]);
        setFieldValue('video', result.assets[0].uri);
      } else {
        console.log('first====', result.assets[0]);
        setImgUrl1(result.assets[0].uri);
        setAsset1(result.assets[0]);
        setFieldValue('thumbnail', result.assets[0].uri);
      }
    });
  };

  const validateFields = (values, isValid) => {
    return (
      isValid &&
      values.title &&
      values.description &&
      values.video &&
      values.thumbnail
    );
  };


  const uploadImageToCloudinary = async (imageUri, fileName) => {

    const data = new FormData();
    data.append('file', {
      uri: imageUri,
      type: 'image/jpeg', // or your image type
      name: fileName, // image file name
    });
    data.append('upload_preset', 'new_lib'); // Cloudinary upload preset
    data.append('cloud_name', '');
    data.append('api_key', '');

    try {
      const response = await fetch(
        'https://api.cloudinary.com/v1_1//image/upload',
        {
          method: 'POST',
          body: data,
        },
      );
      const result = await response.json();
      console.log('Uploaded successfully:', result.url);
      return result.secure_url; // The URL of the uploaded image
    } catch (error) {
      console.log('Error while uploading:', error);
    }
  };



  const uploadVide = async (values, isValid) => {
    if (validateFields(values, isValid)) {
      setLoader(true);

      const newAvatar = await uploadImageToCloudinary(imgUrl, asset.fileName);
      const newCoverImg = await uploadImageToCloudinary(
        imgUrl1,
        asset1.fileName,
      );

      const data = {
        video: newAvatar,
        thumbnail: newCoverImg,
        title: values.title,
        description: values.description,
      };
      console.log('data', data);

      axios
        .post('http://192.168.43.1:8000/api/v1/videos/', data)
        .then(res => {
          const result = res.data;
          console.log('result', result);
          setLoader(false);
          Alert.alert('Successfully Upload')
          navigation.navigate('Home');
        })
        .catch(e => {
          setLoader(false);
          Alert.alert('something went wrong',e)
          console.log('e', e);
        });
    } else {
      alert('Enter data in correct formate');
    }
  };


  const uploadSchema = yup.object().shape({
    title: yup.string().required('Title is required'),
    description: yup.string().required('Description is required'),
    video: yup.mixed().required('Video is required'),
    thumbnail: yup.mixed().required('Thumbnail is required'),
  });

  return (
    <Formik
      initialValues={{
        title: '',
        description: '',
        video: null,
        thumbnail: null,
      }}
      validationSchema={uploadSchema}
      onSubmit={value => {
        console.log('value', value);
      }}>
      {({handleBlur, handleChange, setFieldValue, values, errors, isValid}) => (
        <View style={styles.container}>
          <Loader
            showModal={loader}
            LoaderColor={'black'}
            LoaderSize={'large'}
          />
          <View style={styles.subContainer}>
            <Text style={styles.titleColor}>Upload video details</Text>

            <SafeAreaView style={styles.subContainer1}>
              <KeyboardAvoidingView
                //   style={{flex:1}}
                //   style={{flex:1}}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 80}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                <ScrollView
                  contentContainerStyle={{
                    flexGrow: 1,
                    paddingBottom: responsiveHeight(6),
                  }}
                  alwaysBounceVertical={false}
                  keyboardShouldPersistTaps={'always'}
                  showsVerticalScrollIndicator={false}>
                  <View style={styles.flex}>
                    {imgUrl ? (
                      <TouchableOpacity
                        onPress={() => pickImage('video', setFieldValue)}
                        style={styles.uploadContainer}>
                        <Image source={{uri: imgUrl}} style={styles.image} />
                      </TouchableOpacity>
                    ) : (
                      <View>
                        <TouchableOpacity
                          onPress={() => pickImage('video', setFieldValue)}
                          style={styles.uploadContainer}>
                          <Text style={styles.uploadText}>Upload video</Text>
                        </TouchableOpacity>
                        {errors.video && (
                          <Text style={styles.errorText}>{errors.video}</Text>
                        )}
                      </View>
                    )}
                    {imgUrl1 ? (
                      <TouchableOpacity
                        onPress={() => pickImage('thumbnail', setFieldValue)}
                        style={styles.uploadContainer}>
                        <Image source={{uri: imgUrl1}} style={styles.image} />
                      </TouchableOpacity>
                    ) : (
                      <View>
                        <TouchableOpacity
                          onPress={() => pickImage('thumbnail', setFieldValue)}
                          style={styles.uploadContainer}>
                          <Text style={styles.uploadText}>
                            Upload thumbnail
                          </Text>
                        </TouchableOpacity>
                        {errors.thumbnail && (
                          <Text style={styles.errorText}>
                            {errors.thumbnail}
                          </Text>
                        )}
                      </View>
                    )}
                    <View style={styles.inputView}>
                      <Text style={styles.inputTitle}>Title</Text>
                      <View style={styles.inputFieldView}>
                        <TextInput
                          placeholder="Enter Title"
                          placeholderTextColor={'#b3b3b3'}
                          style={styles.input}
                          value={values.title}
                          onChangeText={handleChange('title')}
                          onBlur={handleBlur('title')}
                        />
                      </View>
                      {errors.title && (
                        <Text style={styles.errorText}>{errors.title}</Text>
                      )}
                    </View>

                    <View style={styles.inputView}>
                      <Text style={styles.inputTitle}>Description</Text>
                      <View style={styles.inputFieldView1}>
                        <TextInput
                          placeholder="Enter Video Description"
                          placeholderTextColor={'#b3b3b3'}
                          style={styles.input1}
                          value={values.description}
                          onChangeText={handleChange('description')}
                          onBlur={handleBlur('description')}
                        />
                      </View>
                      {errors.description && (
                        <Text style={styles.errorText}>
                          {errors.description}
                        </Text>
                      )}
                    </View>

                    <TouchableOpacity onPress={() => uploadVide(values, isValid)} style={styles.button}>
                      <Text style={styles.buttonText}>Publish</Text>
                    </TouchableOpacity>
                  </View>
                </ScrollView>
              </KeyboardAvoidingView>
            </SafeAreaView>
          </View>
        </View>
      )}
    </Formik>
  );
};

export default Upload;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  subContainer: {
    flex: 1,
    paddingHorizontal: responsiveScreenWidth(4),
    marginTop: responsiveHeight(2),
  },
  uploadContainer: {
    height: responsiveHeight(18),
    // width:responsiveWidth(8),
    backgroundColor: '#e6e6e6',
    borderRadius: responsiveWidth(2),
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: responsiveHeight(2),
  },
  uploadText: {
    color: '#000',
    fontSize: responsiveFontSize(2),
    fontWeight: '600',
  },

  subContainer1: {
    flex: 1,
  },
  titleColor: {
    color: '#000',
    fontSize: responsiveFontSize(3),
    fontWeight: 'bold',
    marginBottom: responsiveHeight(2),
  },

  inputView: {
    marginTop: responsiveHeight(3.5),
  },
  inputTitle: {
    fontSize: responsiveFontSize(2),
    fontWeight: '600',
    color: '#000',
  },
  inputFieldView: {
    marginTop: responsiveHeight(1),
    borderWidth: 2,
    borderColor: '#e6e6e6',
    borderRadius: responsiveWidth(3),
  },
  input: {
    minHeight: responsiveHeight(7.5),
    marginLeft: responsiveWidth(3),
    color: '#000',
  },
  privacyText: {
    color: '#000',
  },
  subPrivacy: {
    color: '#FF2400',
  },
  button: {
    height: responsiveHeight(8),
    backgroundColor: '#FF2400',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: responsiveHeight(5),
    borderRadius: responsiveWidth(3),
  },
  buttonText: {
    color: '#fff',
    fontSize: responsiveFontSize(2.5),
    fontWeight: 'bold',
  },
  inputFieldView1: {
    marginTop: responsiveHeight(1),
    borderWidth: 2,
    borderColor: '#e6e6e6',
    borderRadius: responsiveWidth(3),
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    justifyContent: 'center',
    alignContent: 'center',
    right: 5,
    position: 'absolute',
  },
  mainView: {
    alignItems: 'center',
  },
  iconStyle: {
    fontSize: responsiveFontSize(2.5),
  },
  avatar: {
    alignItems: 'center',
    backgroundColor: '#FF6F6F',
    height: responsiveHeight(11),
    width: responsiveHeight(11),
    borderRadius: responsiveHeight(5.5),
    justifyContent: 'center',
  },
  avatarIcon: {
    fontSize: responsiveFontSize(9.5),
    color: '#fff',
  },
  input1: {
    minHeight: responsiveHeight(7.5),
    marginLeft: responsiveWidth(3),
    width: responsiveWidth(80),
    color: '#000',
  },
  errorText: {
    color: '#FF6F6F',
  },
  imageColor: {
    color: '#000',
    fontSize: responsiveFontSize(2.5),
  },
  inputView1: {
    flexDirection: 'row',
  },
  uploadImage: {
    color: '#FF2400',
    fontSize: responsiveFontSize(3),
    textAlign: 'center',
  },
  inputFieldView2: {
    marginTop: responsiveHeight(1),
    borderWidth: 2,
    borderColor: '#e6e6e6',
    borderRadius: responsiveWidth(3),
  },
  opacity: {
    minHeight: responsiveHeight(7.5),
    marginLeft: responsiveWidth(3),
    alignContent: 'center',
    justifyContent: 'center',
  },
  upload: {
    color: '#000',
  },
  uploadWarning: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  textView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: responsiveHeight(4),
  },
  flex: {
    flex: 1,
  },
  image: {
    height: responsiveHeight(18),
    width: responsiveWidth(100),
    borderRadius: responsiveHeight(1),
  },
});
