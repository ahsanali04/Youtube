import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Platform,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  PermissionsAndroid,
  ImageBackground,
  ScrollView,
} from 'react-native';
import React, {FunctionComponent, useState} from 'react';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import Feather from 'react-native-vector-icons/Feather';
import Entypo from 'react-native-vector-icons/Entypo';
import {Formik} from 'formik';
import * as yup from 'yup';
import {launchImageLibrary, launchCamera} from 'react-native-image-picker';
import axios from 'axios';
import Loader from '../common/Loader';
import {useDispatch} from 'react-redux';
import {logIn} from '../redux_/actions/userActions';

const Signup: FunctionComponent = ({navigation}) => {
  const [visible, setVisible] = useState(false);
  const [imgUrl, setImgUrl] = useState(null);
  const [imgUrl1, setImgUrl1] = useState(null);

  const [showButtons, setShowButtons] = useState(false);
  const [showButtons1, setShowButtons1] = useState(false);
  const [asset, setAsset] = useState(null);
  const [asset1, setAsset1] = useState(null);
  const [loader, setLoader] = useState(false);
  const dispatch = useDispatch();

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
      mediaType: 'photo',
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
        if (whichImg === 'avatar') {
          setImgUrl(result.assets[0].uri);
          setAsset(result.assets[0]);
          setShowButtons(true);
        } else {
          setImgUrl1(result.assets[0].uri);
          setAsset1(result.assets[0]);
          setShowButtons1(true);
        }
      });
    }

    if (Platform.OS === 'android') {
      const status = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      );

      if (status === 'granted') {
        await launchCamera(options, result => {
          // if no image is captured
          if (!result.assets) {
            return;
          }
          if (whichImg === 'avatar') {
            setImgUrl(result.assets[0].uri);
            setAsset(result.assets[0]);
            setShowButtons(true);
            setFieldValue('avatar', result.assets[0]);
          } else {
            setImgUrl1(result.assets[0].uri);
            setAsset1(result.assets[0]);
            setShowButtons1(true);
            setFieldValue('coverimage', result.assets[0]);
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
  console.log('asset', asset);
  const openGallery = async (whichImg, setFieldValue) => {
    const options = {
      mediaType: 'photo',
      quality: 0.3,
      maxHeight: 500,
      maxWidth: 500,
    };
    await launchImageLibrary(options, result => {
      if (!result.assets) {
        return;
      }
      if (whichImg === 'avatar') {
        setImgUrl(result.assets[0].uri);
        setAsset(result.assets[0]);
        setShowButtons(true);
        setFieldValue('avatar', result.assets[0]);
      } else {
        console.log('first====', result.assets[0]);
        setImgUrl1(result.assets[0].uri);
        setAsset1(result.assets[0]);
        setShowButtons1(true);
        setFieldValue('coverimage', result.assets[0]);
      }
    });
  };

  const fetchResourceFromURI = async uri => {
    const response = await fetch(uri);
    const blob = await response.blob();
    return blob;
  };

  const uploadResource = async whichImg => {
    const img = await fetchResourceFromURI(
      whichImg === 'avatar' ? asset.uri : asset1.uri,
    );
    return img;
  };

  const validateFields = (values, isValid) => {
    return (
      isValid &&
      values.name &&
      values.email &&
      values.username &&
      values.password &&
      values.avatar &&
      values.coverimage
    );
  };

  const uploadImageToCloudinary = async (imageUri, fileName) => {
    console.log('imageUriimageUri', imageUri);
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

  const registerUser = async (values, isValid) => {
    if (validateFields(values, isValid)) {
      setLoader(true);
      // const imgAvatar = await uploadResource(imgUrl)
      // const imgCover =  await uploadResource(imgUrl1)

      const newAvatar = await uploadImageToCloudinary(imgUrl, asset.fileName);
      const newCoverImg = await uploadImageToCloudinary(
        imgUrl1,
        asset1.fileName,
      );

      const data = {
        fullname: values.name,
        avatar: newAvatar,
        coverImage: newCoverImg,
        email: values.email,
        password: values.password,
        username: values.username,
      };
      console.log('data', data);

      axios
        .post('http://192.168.43.1:8000/api/v1/users/register', data)
        .then(res => {
          const result = res.data;
          console.log('result', result);
          setLoader(false);
          dispatch(logIn(result.data));
          // navigation.navigate('Home');
        })
        .catch(e => {
          setLoader(false);
          console.log('e.message', e.response);
          if (e.message === 'Request failed with status code 409') {
            Alert.alert('User with email or username already exists');
          } else {
            Alert.alert('Something went wrong contact Cinema support');
          }
          console.log('e', e);
        });
    } else {
      alert('Enter data in correct formate');
    }
  };

  const SignUpSchema = yup.object().shape({
    name: yup.string().required('Name is required'),
    email: yup.string().email('Invalid formate').required('Email is required'),
    username: yup.string().required('UserName is required'),
    avatar: yup.mixed().required('Avatar is required'),
    coverimage: yup.mixed().required('CoverImage is required'),
    password: yup
      .string()
      .matches(/\w*[a-z]\w*/, 'Password must have a small letter')
      .matches(/\w*[A-Z]\w*/, 'Password must have a capital letter')
      .matches(/\d/, 'Password must have a number')
      .min(8, ({min}) => `Password must be at least 8 characters`)
      .required('Password is required'),
  });

  return (
    <Formik
      initialValues={{
        name: '',
        email: '',
        username: '',
        password: '',
        avatar: null,
        coverimage: null,
      }}
      validationSchema={SignUpSchema}
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
          <SafeAreaView style={styles.subContainer}>
            <Text style={styles.titleColor}>Create an account</Text>
            <KeyboardAvoidingView
              //   style={{flex:1}}
              //   style={{flex:1}}
              keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 80}
              behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
              <ScrollView
                contentContainerStyle={{flexGrow: 1}}
                alwaysBounceVertical={false}
                keyboardShouldPersistTaps={'always'}
                showsVerticalScrollIndicator={false}>
                <View style={styles.mainView}>
                  <TouchableOpacity
                    onPress={() => pickImage('avatar', setFieldValue)}
                    style={styles.avatar}>
                    <Entypo name="user" style={styles.avatarIcon} />
                  </TouchableOpacity>
                  {errors.avatar && (
                    <Text style={styles.errorText}>{errors.avatar}</Text>
                  )}
                  {/* {showButtons && (
                    <TouchableOpacity onPress={() => uploadResource('avatar')}>
                      <Text style={styles.upload}>Upload</Text>
                    </TouchableOpacity>
                  )} */}
                </View>
                <View style={styles.inputView}>
                  <Text style={styles.inputTitle}>Name</Text>
                  <View style={styles.inputFieldView}>
                    <TextInput
                      placeholder="Enter Name"
                      placeholderTextColor={'#b3b3b3'}
                      style={styles.input}
                      value={values.name}
                      onChangeText={handleChange('name')}
                      onBlur={handleBlur('name')}
                    />
                  </View>
                  {errors.name && (
                    <Text style={styles.errorText}>{errors.name}</Text>
                  )}
                </View>
                <View style={styles.inputView}>
                  <Text style={styles.inputTitle}>Email</Text>
                  <View style={styles.inputFieldView}>
                    <TextInput
                      placeholder="Enter Email"
                      placeholderTextColor={'#b3b3b3'}
                      style={styles.input}
                      value={values.email}
                      onChangeText={handleChange('email')}
                      onBlur={handleBlur('email')}
                    />
                  </View>
                  {errors.email && (
                    <Text style={styles.errorText}>{errors.email}</Text>
                  )}
                </View>
                <View style={styles.inputView}>
                  <Text style={styles.inputTitle}>UserName</Text>
                  <View style={styles.inputFieldView}>
                    <TextInput
                      placeholder="Enter UserName"
                      placeholderTextColor={'#b3b3b3'}
                      style={styles.input}
                      value={values.username}
                      onChangeText={handleChange('username')}
                      onBlur={handleBlur('username')}
                    />
                  </View>
                  {errors.username && (
                    <Text style={styles.errorText}>{errors.username}</Text>
                  )}
                </View>
                <View style={styles.inputView}>
                  <Text style={styles.inputTitle}>Password</Text>
                  <View style={styles.inputFieldView1}>
                    <TouchableOpacity
                      onPress={() => setVisible(!visible)}
                      style={styles.icon}>
                      <Feather
                        name={visible ? 'eye' : 'eye-off'}
                        color="#b3b3b3"
                        style={styles.iconStyle}
                      />
                    </TouchableOpacity>
                    <TextInput
                      placeholder="•••••••••••••"
                      secureTextEntry={!visible}
                      placeholderTextColor={'#b3b3b3'}
                      style={styles.input1}
                      value={values.password}
                      onChangeText={handleChange('password')}
                      onBlur={handleBlur('password')}
                    />
                  </View>
                  {errors.password && (
                    <Text style={styles.errorText}>{errors.password}</Text>
                  )}
                </View>
                <View style={styles.inputView}>
                  <View style={styles.inputView1}>
                    <Entypo name="image" style={styles.imageColor} />
                    <Text style={styles.inputTitle}> Upload cover photo</Text>
                  </View>
                  <View style={styles.inputFieldView2}>
                    <View style={styles.opacity}>
                      <TouchableOpacity
                        onPress={() => pickImage('coverImage', setFieldValue)}>
                        <Entypo name="upload" style={styles.uploadImage} />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View style={styles.uploadWarning}>
                    {errors.coverimage && (
                      <Text style={styles.errorText}>{errors.coverimage}</Text>
                    )}
                    {/* {showButtons1 && (
                      <TouchableOpacity
                        onPress={() => uploadResource('coverImage')}>
                        <Text style={styles.upload}>Upload</Text>
                      </TouchableOpacity>
                    )} */}
                  </View>
                </View>
                <Text style={styles.privacyText}>
                  By Continuing, you agree to our
                  <Text style={styles.subPrivacy} onPress={() => {}}>
                    {' '}
                    terms of service.
                  </Text>
                </Text>

                <TouchableOpacity
                  onPress={() => registerUser(values, isValid)}
                  style={styles.button}>
                  <Text style={styles.buttonText}>Sign up</Text>
                </TouchableOpacity>
              </ScrollView>
            </KeyboardAvoidingView>
          </SafeAreaView>
        </View>
      )}
    </Formik>
  );
};

export default Signup;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  titleColor: {
    color: '#000',
    fontSize: responsiveFontSize(3),
    fontWeight: 'bold',
    marginBottom: responsiveHeight(2),
  },
  subContainer: {
    marginHorizontal: responsiveWidth(4),
    marginVertical: responsiveHeight(4),
    marginBottom: responsiveHeight(10),
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
    marginTop: responsiveHeight(2),
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
    marginVertical: responsiveHeight(3),
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
});
