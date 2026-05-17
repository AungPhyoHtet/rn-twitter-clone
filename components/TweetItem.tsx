import EvilIcons from '@expo/vector-icons/EvilIcons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { formatDistanceToNow } from 'date-fns';
import { enUS as locale } from 'date-fns/locale';
import { Tweet } from '../types/Tweet';
import { RootStackParamList } from '../screens/types';
import formatDistance from '../helpers/formatDistanceCustom';

type Props = {
  item: Tweet;
};

export default function TweetItem({ item }: Props) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  function goToProfile() {
    navigation.navigate('Profile', { userId: item.user.id });
  }

  function goToTweet() {
    navigation.navigate('Tweet', { tweetId: item.id });
  }

  return (
    <View style={styles.itemContainer}>
      <TouchableOpacity onPress={goToProfile}>
        <Image source={{ uri: item.user.avatar }} style={styles.avatar} />
      </TouchableOpacity>
      <View style={{ flex: 1 }}>
        <TouchableOpacity style={styles.tweetUser} onPress={goToTweet}>
          <Text numberOfLines={1} style={styles.tweetText}>
            {item.user.name}
          </Text>
          <Text numberOfLines={1} style={styles.username}>
            @{item.user.username}
          </Text>
          <Text numberOfLines={1} style={styles.dot}>
            .
          </Text>
          <Text numberOfLines={1} style={styles.timestamp}>
            {formatDistanceToNow(new Date(item.created_at), {
              addSuffix: true,
              locale: { ...locale, formatDistance },
            })}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tweetContentContainer} onPress={goToTweet}>
          <Text numberOfLines={2} style={styles.tweetContent}>
            {item.body}
          </Text>
        </TouchableOpacity>
        <View style={styles.tweetEngagementContainer}>
          <TouchableOpacity style={styles.engagementButton} onPress={goToTweet}>
            <EvilIcons name="comment" size={24} color="gray" />
            <Text style={styles.engagementText}>12</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.engagementButton} onPress={goToTweet}>
            <EvilIcons name="retweet" size={24} color="gray" />
            <Text style={styles.engagementText}>12</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.engagementButton} onPress={goToTweet}>
            <EvilIcons name="heart" size={24} color="gray" />
            <Text style={styles.engagementText}>12</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.engagementButton} onPress={goToTweet}>
            <EvilIcons
              name={Platform.OS === 'ios' ? 'share-apple' : 'share-google'}
              size={24}
              color="gray"
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    padding: 16,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
    backgroundColor: '#e5e7eb',
  },
  tweetUser: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  tweetText: {
    fontSize: 16,
    fontWeight: 'bold',
    flexShrink: 1,
  },
  username: {
    fontSize: 14,
    color: '#666',
    flexShrink: 1,
  },
  dot: {
    fontSize: 14,
    color: '#666',
    marginHorizontal: 4,
  },
  timestamp: {
    fontSize: 14,
    color: '#666',
  },
  tweetContentContainer: {
    marginTop: 4,
  },
  tweetContent: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  tweetEngagementContainer: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 32,
  },
  engagementButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  engagementText: {
    fontSize: 12,
    color: 'gray',
  },
});
