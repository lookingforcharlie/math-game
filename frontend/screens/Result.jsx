import React, { useEffect, useState } from 'react';
import {
  FlatList,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import CustomButton from '../components/CustomButton';

// This screen includes result: Corrent or Incorrect, and Leaderboard
// And a button to go back to game
const Result = ({ navigation, route }) => {
  // const userNameResult = route.params.userNameGame;
  // const flag = route.params.isCorrect;

  const { userNameGame, num1, num2, gameAnswer } = route.params;
  const [flag, setFlag] = useState(true);
  const [finalResult, setFinalResult] = useState('');
  const [leaderBoard, setLeaderBoard] = useState({});

  const goRedis = async () => {
    const response = await fetch(
      `http://localhost:3000/update?username=${userNameGame}&result=${finalResult}`,
      {
        method: 'POST',
      }
    );
    const data = await response.json();
    // data is object, turn data into array of object, then I can make a table
    showResult(data);
  };

  const showResult = (data) => {
    const dataObj = Object.entries(data);
    console.log('Redis From backend', dataObj);
    // if object back from Redis longer than 10, only show 10 result, less than 10, show all
    if (dataObj.length >= 10) {
      const dataObjTen = dataObj.slice(-10);
      setLeaderBoard(dataObjTen);
    } else {
      setLeaderBoard(dataObj);
    }
  };

  const onlyGetLeaderBoard = async () => {
    const response = await fetch(`http://localhost:3000/getresult`, {
      method: 'POST',
    });
    const data = await response.json();
    // data is object, turn data into array of object, then I can make a table
    showResult(data);
  };

  useEffect(() => {
    if (gameAnswer == num1 + num2) {
      console.log('right');
      setFlag(true);
      setFinalResult('Correct');
      console.log(flag);
      goRedis();
      // console.log(data);
    } else {
      console.log('wrong');
      setFlag(false);
      setFinalResult('Incorrect');
      console.log(flag);
      onlyGetLeaderBoard();
    }
  }, []);

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: flag ? '#76f483' : '#f79ccb' }}
    >
      <View style={{ padding: 20 }}>
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
        <View style={{ marginBottom: 30, marginTop: 20 }}>
          <Text
            style={{ textAlign: 'center', fontSize: 100, color: '#084482' }}
          >
            {/* {flag === true ? 'Correct' : 'Wrong'} */}
            {finalResult}
          </Text>
        </View>

        <CustomButton
          label={'Play again'}
          // onPress={() => cons.log('submitting')}
          onPress={() => navigation.goBack()}
        />
        <View style={{ marginLeft: 10, marginBottom: 10 }}>
          <Text
            style={{
              fontSize: 22,
              fontFamily: 'Georgia',
              color: '#115a20',
              fontWeight: '500',
            }}
          >
            LeaderBoard
          </Text>
        </View>

        {leaderBoard.length > 0 ? (
          <View style={{ marginLeft: 20 }}>
            <FlatList
              data={leaderBoard}
              // keyExtractor={() => Date.now()}
              renderItem={({ item }) => (
                <Text
                  style={{ color: '#115a20', padding: 7, fontWeight: '500' }}
                >
                  {item[0]} : {item[1]}
                </Text>
              )}
            />
          </View>
        ) : (
          <View>
            <Text style={{ color: '#115a20', padding: 7, fontWeight: '500' }}>
              No Records Yet
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default Result;

const styles = StyleSheet.create({});
