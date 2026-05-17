import {
  ActivityIndicator,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Entypo from '@expo/vector-icons/Entypo';
import EvilIcons from '@expo/vector-icons/EvilIcons';
import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from './types';
import { Tweet } from '../types/Tweet';
import { useCallback, useEffect, useState } from 'react';
import axiosConfig from '../helpers/axiosConfig';
import { format } from 'date-fns';

type Props = NativeStackScreenProps<RootStackParamList, 'Tweet'>;

export default function TweetScreen({ route }: Props) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [isLoading, setIsLoading] = useState(true);
  const [tweet, setTweet] = useState<Tweet | null>();

  const getTweet = useCallback(
    function () {
      axiosConfig
        .get(`/tweets/${route.params.tweetId}`)
        .then(function (response) {
          setTweet(response.data.data);
          console.log(response.data.data);
        })
        .catch(function (error) {
          console.log(error);
        })
        .finally(function () {
          setIsLoading(false);
        });
    },
    [route.params.tweetId],
  );

  useEffect(() => {
    getTweet();
  }, [getTweet]);

  function goToProfile() {
    navigation.navigate('Profile');
  }
  return (
    <View style={styles.container}>
      {isLoading || !tweet ? (
        <ActivityIndicator style={{ marginTop: 8 }} size="large" color="gray" />
      ) : (
        <>
          <TouchableOpacity onPress={() => goToProfile()}>
            <View style={styles.itemContainer}>
              <Image source={{ uri: tweet.user.avatar }} style={styles.avatar} />
              <View style={styles.tweetUser}>
                <Text numberOfLines={1} style={styles.tweetText}>
                  {tweet.user.name}
                </Text>
                <Text numberOfLines={1} style={styles.username}>
                  @{tweet.user.username}
                </Text>
              </View>
              <Entypo name="dots-three-vertical" size={16} color="gray" />
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tweetContentContainer}>
            <Text style={styles.tweetContent}>{tweet.body}</Text>
            <View style={styles.tweetTimestampContainer}>
              <Text style={styles.tweetTimestampText}>
                {format(new Date(tweet.created_at), 'h:mm a')}
              </Text>
              <Text style={styles.tweetTimestampText}>&middot;</Text>
              <Text style={styles.tweetTimestampText}>
                {format(new Date(tweet.created_at), 'd MMM.yy')}
              </Text>
              <Text style={styles.tweetTimestampText}>&middot;</Text>
              <Text style={[styles.tweetTimestampText, styles.linkColor]}>Twitter for iPhone</Text>
            </View>
          </TouchableOpacity>
          <View style={styles.separator}></View>
          <View style={styles.tweetEngagementContainer}>
            <View style={styles.engagementButton}>
              <Text style={styles.tweetEngagementNumber}>12</Text>
              <Text style={styles.tweetEngagementText}>Retweets</Text>
            </View>
            <View style={styles.engagementButton}>
              <Text style={styles.tweetEngagementNumber}>38</Text>
              <Text style={styles.tweetEngagementText}>Quote Tweets</Text>
            </View>
            <View style={styles.engagementButton}>
              <Text style={styles.tweetEngagementNumber}>2934</Text>
              <Text style={styles.tweetEngagementText}>Likes</Text>
            </View>
          </View>

          <View style={styles.separator}></View>
          <View style={styles.tweetEngagementContainer}>
            <TouchableOpacity style={styles.engagementButton}>
              <EvilIcons name="comment" size={32} color="gray" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.engagementButton}>
              <EvilIcons name="retweet" size={32} color="gray" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.engagementButton}>
              <EvilIcons name="heart" size={32} color="gray" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.engagementButton}>
              <EvilIcons
                name={Platform.OS === 'ios' ? 'share-apple' : 'share-google'}
                size={32}
                color="gray"
              />
            </TouchableOpacity>
          </View>
          <View style={styles.separator}></View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  itemContainer: {
    flexDirection: 'row',
    padding: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  tweetUser: {
    flex: 1,
  },
  tweetText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  username: {
    fontSize: 14,
    color: '#666',
  },
  tweetContentContainer: {
    paddingLeft: 16,
    paddingRight: 16,
  },
  tweetContent: {
    fontSize: 16,
    lineHeight: 24,
  },
  separator: {
    marginVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tweetEngagementContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 24,
    marginHorizontal: 16,
    paddingVertical: 8,
  },
  engagementButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  tweetEngagementNumber: {
    fontWeight: 'bold',
    color: 'black',
  },
  tweetEngagementText: {
    color: 'gray',
    marginLeft: 2,
  },
  flexRow: {
    flexDirection: 'row',
  },
  tweetEngagement: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  ml4: {
    marginLeft: 16,
  },
  tweetTimestampContainer: {
    flexDirection: 'row',
    marginTop: 12,
  },
  tweetTimestampText: {
    color: 'gray',
    marginRight: 6,
  },
  linkColor: {
    color: '#1d9bf1',
  },
});
