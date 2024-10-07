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
  ScrollView,
} from 'react-native';
import React, {FunctionComponent, useState} from 'react';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import Feather from 'react-native-vector-icons/Feather';
import {Formik} from 'formik';
import * as yup from 'yup';
import axios from 'axios';
import Loader from '../common/Loader';
import {useDispatch, useSelector} from 'react-redux';
import {logIn} from '../redux_/actions/userActions';

const Login: FunctionComponent = ({navigation}) => {
  const dispatch = useDispatch();
  const [visible, setVisible] = useState(false);
  const [loader, setLoader] = useState(false);
  const validateFields = (values, isValid) => {
    return (
      isValid &&
      values.email &&
      // values.username &&
      values.password
    );
  };

  const loginUser = async (values, isValid) => {
    console.log('values', values);
    console.log('isValid', isValid);
    if (validateFields(values, isValid)) {
      setLoader(true);

      const data = {
        email: values.email,
        password: values.password,
        // username: values.username,
      };

      axios
        .post('http://192.168.43.1:8000/api/v1/users/login', data)
        .then(res => {
          const result = res.data;
          setLoader(false);
          console.log('result', result.data.user._id);
          dispatch(logIn(result.data.user));
          // navigation.navigate('Home');
        })
        .catch(e => {
          setLoader(false);
          console.log('e.message', e.response);
          if (e.message === 'Request failed with status code 404') {
            Alert.alert('User does not exist');
          }
          if (e.message === 'Request failed with status code 401') {
            Alert.alert('Invalid user credentials');
          } else {
            Alert.alert('Something went wrong contact Cinema support');
          }
        });
    } else {
      alert('Enter data in correct formate');
    }
  };

  const LogInSchema = yup.object().shape({
    // username: yup.string().required('Name is required'),
    email: yup.string().email('Invalid formate').required('Email is required'),
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
        email: '',
        // username: '',
        password: '',
      }}
      validationSchema={LogInSchema}
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
            <Text style={styles.titleColor}>Sign in to you account</Text>
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
                {/* <View style={styles.inputView}>
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
                  </View> */}
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

                <View style={styles.textView}>
                  <Text style={styles.privacyText}>
                    <Text style={styles.subPrivacy} onPress={() => {}}>
                      Forgot my pasword
                    </Text>
                  </Text>
                  <Text
                    style={[styles.subPrivacy]}
                    onPress={() => navigation.navigate('Signup')}>
                    Create new account
                  </Text>
                </View>

                <TouchableOpacity
                  onPress={() => loginUser(values, isValid)}
                  style={styles.button}>
                  <Text style={styles.buttonText}>LogIn</Text>
                </TouchableOpacity>
              </ScrollView>
            </KeyboardAvoidingView>
          </SafeAreaView>
        </View>
      )}
    </Formik>
  );
};

export default Login;

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
});
