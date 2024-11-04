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
import Loader from '../common/Loader';
import axios from 'axios';
import {BASE_URL} from '@env';
import {useSelector} from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';

const ChangePassword: FunctionComponent = ({navigation}) => {
  const userData = useSelector(state => state.userReducer.userData);
  const [loader, setLoader] = useState(false);

  const validateFields = (values, isValid) => {
    return isValid && values.currentPassword && values.NewPassword;
  };

  const updatePassword = async (values, isValid) => {
    if (validateFields(values, isValid)) {
      setLoader(true);

      const data = {
        oldPassword: values.currentPassword,
        newPassword: values.NewPassword,
      };
      console.log('data', data);

      axios
        .post(`${BASE_URL}/api/v1/users/change-password`, data)
        .then(res => {
          const result = res.data;
          console.log('result', result);
          Alert.alert('Updated Successfully');
          setLoader(false);
        })
        .catch(e => {
          setLoader(false);
          console.log('e.message', e.response.data.message);
          if (e.response.data.message === 'Invalid old password') {
            Alert.alert('Invalid Current Password');
          }
        });
    } else {
      alert('Enter data in correct formate');
    }
  };

  const uploadSchema = yup.object().shape({
    currentPassword: yup
      .string()
      .matches(/\w*[a-z]\w*/, 'Password must have a small letter')
      .matches(/\w*[A-Z]\w*/, 'Password must have a capital letter')
      .matches(/\d/, 'Password must have a number')
      .min(8, ({min}) => `Password must be at least 8 characters`)
      .required('Password is required'),
    NewPassword: yup
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
        currentPassword: '',
        NewPassword: '',
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
                  fontSize: responsiveFontSize(2.7),
                  color: 'black',
                  fontWeight: 'bold',
                }}>
                Update Password
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

            <SafeAreaView style={styles.subContainer1}>
              <KeyboardAvoidingView
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
                    <View style={styles.inputView}>
                      <Text style={styles.inputTitle}>Current Password</Text>
                      <View style={styles.inputFieldView}>
                        <TextInput
                          placeholder="Enter Current Password"
                          placeholderTextColor={'#b3b3b3'}
                          style={styles.input}
                          value={values.currentPassword}
                          onChangeText={handleChange('currentPassword')}
                          onBlur={handleBlur('currentPassword')}
                        />
                      </View>
                      {errors.currentPassword && (
                        <Text style={styles.errorText}>
                          {errors.currentPassword}
                        </Text>
                      )}
                    </View>

                    <View style={styles.inputView}>
                      <Text style={styles.inputTitle}>New Password</Text>
                      <View style={styles.inputFieldView1}>
                        <TextInput
                          placeholder="Enter New Password"
                          placeholderTextColor={'#b3b3b3'}
                          style={styles.input1}
                          value={values.NewPassword}
                          onChangeText={handleChange('NewPassword')}
                          onBlur={handleBlur('NewPassword')}
                        />
                      </View>
                      {errors.NewPassword && (
                        <Text style={styles.errorText}>
                          {errors.NewPassword}
                        </Text>
                      )}
                    </View>

                    <TouchableOpacity
                      onPress={() => updatePassword(values, isValid)}
                      style={styles.button}>
                      <Text style={styles.buttonText}>Update</Text>
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

export default ChangePassword;

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
    height: responsiveHeight(16),
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
    //   marginBottom: responsiveHeight(2),
    justifyContent: 'center',
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
