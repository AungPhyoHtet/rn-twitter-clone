import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { RootStackParamList } from './types';
import { useNavigation } from '@react-navigation/native';

export default function NewTweetScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [tweet, setTweet] = useState('');

  function sendTweet() {
    navigation.navigate('Tabs');
  }

  return (
    <View style={styles.container}>
      <View style={styles.tweetButtonContainer}>
        <Text style={tweet.length > 250 ? styles.tweetText : styles.alertText}>
          Characters left: {280 - tweet.length}
        </Text>
        <TouchableOpacity style={styles.tweetButton} onPress={() => sendTweet()}>
          <Text style={styles.tweetButtonText}>Tweet</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.itemContainer}>
        <Image
          source={{ uri: 'https://reactnative.dev/img/tiny_logo.png' }}
          style={styles.avatar}
        />
        <TextInput
          editable
          multiline
          maxLength={280}
          onChangeText={setTweet}
          placeholder="What's happening?"
          placeholderTextColor="gray"
          value={tweet}
          style={styles.tweetInput}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  tweetButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 16,
  },
  tweetText: {
    color: 'gray',
  },
  alertText: {
    color: 'red',
  },
  tweetButton: {
    backgroundColor: '#1d9bf1',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 24,
  },
  tweetButtonText: {
    fontWeight: 'bold',
    color: 'white',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  itemContainer: {
    flexDirection: 'row',
    padding: 16,
  },
  tweetInput: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
    padding: 4,
  },
});
