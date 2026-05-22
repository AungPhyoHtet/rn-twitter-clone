import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { RootStackParamList } from '../types';
import { useNavigation } from '@react-navigation/native';
import axiosConfig from '../helpers/axiosConfig';

export default function NewTweetScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [isLoading, setIsLoading] = useState(false);
  const [tweet, setTweet] = useState('');
  const [error, setError] = useState('');

  function sendTweet() {
    if (!tweet.trim()) {
      setError('Body is required.');
      return;
    }
    setError('');
    setIsLoading(true);
    axiosConfig
      .post('/tweets', { body: tweet })
      .then(function (response) {
        response.data.data;
        console.log(response.data);
        navigation.navigate('Tabs');
      })
      .catch(function (error) {
        console.log(error.response?.data);
      })
      .finally(function () {
        setIsLoading(false);
      });
  }

  return (
    <View style={styles.container}>
      <View style={styles.tweetButtonContainer}>
        <Text style={tweet.length > 250 ? styles.tweetText : styles.alertText}>
          Characters left: {280 - tweet.length}
        </Text>
        <TouchableOpacity
          style={styles.tweetButton}
          onPress={() => sendTweet()}
          disabled={isLoading}
        >
          {isLoading && <ActivityIndicator size="small" color="white" />}
          <Text style={styles.tweetButtonText}>Tweet</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.itemContainer}>
        <Image
          source={{ uri: 'https://reactnative.dev/img/tiny_logo.png' }}
          style={styles.avatar}
        />
        <View style={styles.inputContainer}>
          <TextInput
            editable
            multiline
            maxLength={280}
            onChangeText={(text) => {
              setTweet(text);
              if (error) setError('');
            }}
            placeholder="What's happening?"
            placeholderTextColor="gray"
            value={tweet}
            style={styles.tweetInput}
          />
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </View>
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
    flexDirection: 'row',
    gap: 8,
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
  inputContainer: {
    flex: 1,
  },
  tweetInput: {
    fontSize: 16,
    lineHeight: 24,
    padding: 4,
  },
  errorText: {
    color: 'red',
    marginTop: 4,
  },
});
