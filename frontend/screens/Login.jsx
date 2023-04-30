import React, { useEffect, useState } from 'react';
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { useIsFocused } from '@react-navigation/native';
import CustomButton from '../components/CustomButton';

const Login = ({ navigation }) => {
  // const { test } = useContext(AuthContext);
  const isFocused = useIsFocused();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('Welcome back!');
  const [userToken, setUserToken] = useState(null);

  function doLogin() {
    console.log('Send a login request');
    //TODO: Add form validation
    let user = { username, password };
    let endpoint = 'login';
    sendData(user, endpoint, loginSuccess);
  }

  function sendData(user, endpoint, callback) {
    let url = `http://localhost:3000/${endpoint}`;
    let h = new Headers();
    h.append('Content-Type', 'application/json');
    let req = new Request(url, {
      method: 'POST',
      headers: h,
      body: JSON.stringify(user),
    });
    fetch(req)
      // res.json() creates an object from the JSON string
      .then((res) => res.json())
      .then((content) => {
        //we have a response
        // 'error' is an intentional one setup in the server, line 119
        if ('error' in content) {
          //bad attempt
          failure(content.error);
        }
        // 'data' is an intentional one setup in the server, line 115
        if ('data' in content) {
          //it worked
          console.log('see data: ', content);
          // here content.data is the token
          callback(content.data);
        }
      })
      .catch(failure);
  }

  // const sendData = async (user, endpoint, callback) => {};

  function loginSuccess(data) {
    // data is the token here
    console.log('token: ', data);
    setUserToken(data);
    // passing variable to Game screen
    navigation.navigate('Game', {
      username: username,
      userToken: userToken,
      setUserToken: setUserToken,
    });
  }

  function failure(err) {
    console.warn(err.code, err.message);
    setErrorMsg(err.message);
  }

  const handleLogin = () => {
    console.log('let me login');
    // do input validation
    if (username.trim() == '' || password.trim() == '') {
      setErrorMsg('All fields must be completed.');
    } else {
      doLogin();
    }
  };

  useEffect(() => {
    setUsername('');
    setPassword('');
  }, [isFocused]);

  return (
    <SafeAreaView style={{ flex: 1, justifyContent: 'center' }}>
      <View style={{ paddingHorizontal: 25 }}>
        <View style={{ alignItems: 'center' }}>
          <Image
            source={require('../assets/math_game3.jpg')}
            style={styles.image}
          />
        </View>

        <Text
          style={{
            fontFamily: 'Georgia',
            fontSize: 28,
            fontWeight: '500',
            color: '#333',
            marginBottom: 30,
          }}
        >
          Login
        </Text>

        <View
          style={{
            flexDirection: 'row',
            borderBottomColor: '#ccc',
            borderBottomWidth: 1,
            paddingBottom: 8,
            marginBottom: 25,
          }}
        >
          <MaterialIcons
            name='person-outline'
            size={20}
            color='#666'
            style={{ marginRight: 5 }}
          />
          <TextInput
            placeholder='Username'
            value={username}
            autoCapitalize='none'
            autoCorrect='false'
            keyboardType='default'
            style={{ flex: 1, paddingVertical: 0 }}
            onChangeText={(inputText) => {
              setErrorMsg('Welcome back!');
              setUsername(inputText);
            }}
          />
        </View>

        <View
          style={{
            flexDirection: 'row',
            borderBottomColor: '#ccc',
            borderBottomWidth: 1,
            paddingBottom: 8,
            marginBottom: 25,
          }}
        >
          <Ionicons
            name='ios-lock-closed-outline'
            size={20}
            color='#666'
            style={{ marginRight: 5 }}
          />
          <TextInput
            placeholder='Password'
            value={password}
            style={{ flex: 1, paddingVertical: 0 }}
            // make password invisible
            secureTextEntry={true}
            onChangeText={(inputText) => {
              setErrorMsg('Welcome back!');
              setPassword(inputText);
            }}
          />
        </View>

        <CustomButton
          label={'Login'}
          // onPress={() => cons.log('submitting')}
          onPress={handleLogin}
        />

        <Text
          style={{ textAlign: 'center', color: '#B80F0A', marginBottom: 30 }}
        >
          {errorMsg}
        </Text>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginBottom: 30,
          }}
        >
          <Text style={{ fontSize: 18 }}>New to Math Game?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
            <Text style={{ color: '#AD40AF', fontWeight: '700', fontSize: 18 }}>
              {'   '}
              Sign-Up
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Login;

const styles = StyleSheet.create({
  image: {
    width: 250,
    height: 250,
    transform: [{ rotate: '11deg' }],
    marginBottom: 30,
  },
});
