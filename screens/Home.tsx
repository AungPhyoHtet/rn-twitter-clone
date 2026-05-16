import AntDesign from '@expo/vector-icons/AntDesign';
import EvilIcons from '@expo/vector-icons/EvilIcons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { RootStackParamList } from './types';
import { useCallback, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';
import formatDistance from '../helpers/formatDistanceCustom';
import locale from 'date-fns/locale/en-US';

export default function HomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const isFetchingRef = useRef(false);

  const getAllTweets = useCallback(() => {
    isFetchingRef.current = true;
    axios
      .get('http://laravel-twitter-clone.test/api/v1/tweets', { params: { page: currentPage } })
      .then(function (response) {
        const tweets = response.data.data;
        const lastPage = response.data.meta.last_page;
        setData((prev) => (currentPage === 1 ? tweets : [...prev, ...tweets]));
        setHasNextPage(currentPage < lastPage);
      })
      .catch(function (error) {
        console.log(error);
      })
      .finally(function () {
        setIsLoading(false);
        setIsRefreshing(false);
        setIsLoadingMore(false);
        isFetchingRef.current = false;
      });
  }, [currentPage]);

  function handleRefresh() {
    setIsRefreshing(true);
    setCurrentPage(1);
  }

  function handleLoadMore() {
    if (isFetchingRef.current || !hasNextPage) return;
    setIsLoadingMore(true);
    setCurrentPage((prev) => prev + 1);
  }

  useEffect(() => {
    getAllTweets();
  }, [getAllTweets]);

  type User = {
    id: number;
    name: string;
    username: string;
    avatar: string;
  };

  type Tweet = {
    id: number;
    body: string;
    user_id: number;
    user: User;
    created_at: string;
  };

  function goToProfile() {
    navigation.navigate('Profile');
  }

  function goToTweet() {
    navigation.navigate('Tweet');
  }

  function goToNewTweet() {
    navigation.navigate('NewTweet');
  }

  const RenderItem = ({ item }: { item: Tweet }) => (
    <View style={styles.itemContainer}>
      <TouchableOpacity onPress={() => goToProfile()}>
        <Image
          source={{
            uri: item.user.avatar,
          }}
          style={styles.avatar}
        />
      </TouchableOpacity>
      <View style={{ flex: 1 }}>
        <TouchableOpacity style={styles.tweetUser} onPress={() => goToTweet()}>
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
            {/* {formatDistanceToNow(new Date(item.created_at))} */}
            {formatDistanceToNow(new Date(item.created_at), {
              addSuffix: true,
              locale: {
                ...locale,
                formatDistance,
              },
            })}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tweetContentContainer} onPress={() => goToTweet()}>
          <Text numberOfLines={2} style={styles.tweetContent}>
            {item.body}
          </Text>
        </TouchableOpacity>
        <View style={styles.tweetEngagementContainer}>
          <TouchableOpacity style={styles.engagementButton} onPress={() => goToTweet()}>
            <EvilIcons name="comment" size={24} color="gray" />
            <Text style={styles.engagementText}>12</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.engagementButton} onPress={() => goToTweet()}>
            <EvilIcons name="retweet" size={24} color="gray" />
            <Text style={styles.engagementText}>12</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.engagementButton} onPress={() => goToTweet()}>
            <EvilIcons name="heart" size={24} color="gray" />
            <Text style={styles.engagementText}>12</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.engagementButton} onPress={() => goToTweet()}>
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

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator style={{ marginTop: 8 }} size="large" color="gray" />
      ) : (
        <FlatList
          data={data}
          renderItem={({ item }) => <RenderItem item={item} />}
          keyExtractor={(item: Tweet) => String(item.id)}
          ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
          refreshing={isRefreshing}
          onRefresh={handleRefresh}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.2}
          ListFooterComponent={
            isLoadingMore ? <ActivityIndicator style={{ padding: 16 }} color="gray" /> : null
          }
        />
      )}
      <TouchableOpacity style={styles.floatingButton} onPress={() => goToNewTweet()}>
        <AntDesign name="plus" size={24} color="white" />
      </TouchableOpacity>
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
    padding: 16,
  },
  itemSeparator: {
    height: 1,
    backgroundColor: '#eee',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
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
  floatingButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#1DA1F2',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
