import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const Main = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text style={styles.appTitle}>MATH GAME</Text>
      </View>
      <Image
        source={require('../assets/math_game1.png')}
        style={styles.image}
      />
      <TouchableOpacity
        style={styles.touchableButton}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.textInButton}>Let's crunch the numbers</Text>
        <MaterialIcons
          name='arrow-forward-ios'
          size={22}
          color='#fff'
        ></MaterialIcons>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  appTitle: {
    fontFamily: 'Georgia',
    color: '#282c34',
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 30,
    letterSpacing: 1.5,
  },
  touchableButton: {
    backgroundColor: '#AD40AF',
    padding: 20,
    width: '85%',
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 70,
  },
  textInButton: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#fff',
    fontFamily: 'Georgia',
    fontStyle: 'italic',
  },
  image: {
    width: 320,
    height: 320,
    transform: [{ rotate: '-25deg' }],
  },
});

export default Main;
