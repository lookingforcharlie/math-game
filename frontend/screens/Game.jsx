import { useIsFocused } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import CustomButton from '../components/CustomButton';

const Game = ({ navigation, route }) => {
  const isFocused = useIsFocused();

  const [num1, setNum1] = useState(1);
  const [num2, setNum2] = useState(2);
  const [gameAnswer, setGameAnswer] = useState('');

  // const userName = route.params.username;
  // const setUserToken = route.params.setUserToken;

  const { username, userToken, setUserToken } = route.params;

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  const userNameGame = capitalizeFirstLetter(username);

  useEffect(() => {
    setNum1(() => Math.floor(Math.random() * 100));
    setNum2(() => Math.floor(Math.random() * 100));
    setGameAnswer('');
  }, [isFocused]);

  const handleSubmit = () => {
    navigation.navigate('Result', {
      userNameGame: userNameGame,
      num1,
      num2,
      gameAnswer,
    });
  };

  return (
    <SafeAreaView style={styles.outerContainer}>
      <ScrollView style={{ padding: 20 }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 20,
          }}
        >
          <Text
            style={{
              fontSize: 22,
              fontFamily: 'Georgia',
              color: '#294685',
              fontWeight: '500',
            }}
          >
            Hello {userNameGame}
          </Text>
          <ImageBackground
            source={require('../assets/user-profile.jpg')}
            style={{ width: 45, height: 45, marginTop: -10 }}
            imageStyle={{ borderRadius: 25 }}
          />
        </View>

        <View style={styles.innerContainer}>
          <Text
            style={{ textAlign: 'center', fontSize: 100, color: '#084482' }}
          >
            {num1}
          </Text>
          <Text
            style={{ textAlign: 'center', fontSize: 100, color: '#084482' }}
          >
            +
          </Text>
          <Text
            style={{ textAlign: 'center', fontSize: 100, color: '#084482' }}
          >
            {num2}
          </Text>
        </View>

        <TextInput
          style={styles.textInput}
          placeholder='Your answer...'
          autoFocus='true'
          clearTextOnFocus='true'
          value={gameAnswer}
          keyboardType='number-pad'
          onChangeText={(inputText) => {
            console.log(inputText);
            setGameAnswer(inputText);
          }}
        />

        <View style={{ paddingHorizontal: 25, marginTop: 50, width: '98%' }}>
          <TouchableOpacity
            disabled={gameAnswer == '' ? true : false}
            onPress={handleSubmit}
            style={{
              backgroundColor: '#AD40AF',
              padding: 20,
              borderRadius: 10,
              marginBottom: 30,
            }}
          >
            <Text
              style={{
                textAlign: 'center',
                fontWeight: '700',
                fontSize: 16,
                color: '#fff',
              }}
            >
              Submit
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ paddingHorizontal: 25, width: '98%' }}>
          <CustomButton
            label={'Sign-out'}
            onPress={() => {
              setUserToken(null);
              navigation.navigate('Login');
            }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Game;

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: 'lightyellow',
    justifyContent: 'space-between',
    // alignItems: 'center',
  },
  innerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 25,
    marginBottom: 20,
    marginTop: 30,
  },
  textInput: {
    paddingHorizontal: 25,
    marginLeft: 20,
    borderWidth: 1,
    borderColor: '#e4d0ff',
    borderRadius: 6,
    backgroundColor: '#e4d0ff',
    width: '88%',
    padding: 16,
    color: '#120438',
  },
});
