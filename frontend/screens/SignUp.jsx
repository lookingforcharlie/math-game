import React, { useState } from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import CustomButton from '../components/CustomButton';

import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const SignUp = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isError, setIsError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('Welcome!');

  // S
  function doSignup() {
    console.log('Send a Register request');
    // let username = document.querySelector('#regForm .email').value;
    // let pass = document.querySelector('#regForm .pass').value;
    //TODO: Add form validation
    let user = { username, password };
    let endpoint = 'signup';
    sendData(user, endpoint, registerSuccess);
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
        // 'error' is an intentional one setup in the server, line 42
        if ('error' in content) {
          //bad attempt
          failure(content.error);
        }
        // 'data' is an intentional one setup in the server, line 38
        if ('data' in content) {
          //it worked
          callback(content.data);
        }
      })
      .catch(failure);
  }

  function registerSuccess(data) {
    //user has been registered
    console.log('success ? ');
    console.log('new user created', data);
    navigation.navigate('Login');
  }

  function failure(err) {
    alert(err.message);
    console.warn(err.code, err.message);
  }

  const handleSubmit = () => {
    // do input validation first
    if (
      username.trim() == '' ||
      password.trim() == '' ||
      confirmPassword.trim() == ''
    ) {
      setErrorMsg('All fields must be completed.');
    } else if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
    } else doSignup();
  };

  return (
    <SafeAreaView style={{ flex: 1, justifyContent: 'center' }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ paddingHorizontal: 25 }}
      >
        <View style={{ alignItems: 'center' }}>
          <Image
            source={require('../assets/math_game2.png')}
            style={styles.image}
          />
        </View>

        <Text style={styles.largeText}>Sign-up</Text>

        <View style={styles.inputSpace}>
          <MaterialIcons
            name='person-outline'
            size={20}
            color='#666'
            style={{ marginRight: 5 }}
          />
          <TextInput
            placeholder='Username'
            autoCapitalize='none'
            autoCorrect='false'
            keyboardType='default'
            style={{ flex: 1, paddingVertical: 0 }}
            onChangeText={(inputText) => {
              setErrorMsg('Welcome!');
              setUsername(inputText);
            }}
          />
        </View>

        <View style={styles.inputSpace}>
          <Ionicons
            name='ios-lock-closed-outline'
            size={20}
            color='#666'
            style={{ marginRight: 5 }}
          />
          <TextInput
            placeholder='Password'
            style={{ flex: 1, paddingVertical: 0 }}
            // make password invisible
            secureTextEntry={true}
            onChangeText={(inputText) => {
              setErrorMsg('Welcome!');
              setPassword(inputText);
            }}
          />
        </View>

        <View style={styles.inputSpace}>
          <Ionicons
            name='ios-lock-closed-outline'
            size={20}
            color='#666'
            style={{ marginRight: 5 }}
          />
          <TextInput
            placeholder='Confirm Password'
            style={{ flex: 1, paddingVertical: 0 }}
            secureTextEntry={true}
            onChangeText={(inputText) => {
              setErrorMsg('Welcome!');
              setConfirmPassword(inputText);
            }}
          />
        </View>

        <CustomButton label={'Sign me up'} onPress={handleSubmit} />

        <Text
          style={{ textAlign: 'center', color: '#B80F0A', marginBottom: 30 }}
        >
          {errorMsg}
        </Text>

        <View style={styles.bottomContainer}>
          <Text style={{ fontSize: 18 }}>Already registered?</Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.bottomText}>
              {'   '}
              Login
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  image: {
    width: 300,
    height: 300,
    // transform: [{ rotate: '-25deg' }],
  },
  inputSpace: {
    flexDirection: 'row',
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    paddingBottom: 8,
    marginBottom: 25,
  },
  largeText: {
    fontFamily: 'Georgia',
    fontSize: 28,
    fontWeight: '500',
    color: '#333',
    marginBottom: 30,
    marginTop: 30,
  },
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 30,
  },
  bottomText: {
    color: '#AD40AF',
    fontWeight: '700',
    fontSize: 18,
  },
});

export default SignUp;
