import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, User, Tweet } from '../types';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import axiosConfig from '../helpers/axiosConfig';
import ProfileHeader from '../components/ProfileHeader';
import TweetItem from '../components/TweetItem';
import { AuthContext } from '../context/AuthProvider';

type Props = NativeStackScreenProps<RootStackParamList, 'Profile'>;

export default function ProfileScreen({ route }: Props) {
  const { user: authUser } = useContext(AuthContext);
  const isOwnProfile = authUser?.id === route.params.userId;
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isFollowLoading, setIsFollowLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const isFetchingRef = useRef(false);

  const getUser = useCallback(
    function () {
      axiosConfig
        .get(`/users/${route.params.userId}`)
        .then(function (response) {
          setUser(response.data);
          setIsFollowing(response.data.is_following ?? false);
        })
        .catch(function (error) {
          console.log(error.response?.data);
        });
    },
    [route.params.userId],
  );

  const getTweets = useCallback(
    function () {
      isFetchingRef.current = true;
      axiosConfig
        .get(`/users/${route.params.userId}/tweets`, { params: { page: currentPage } })
        .then(function (response) {
          const data = response.data.data;
          const lastPage = response.data.meta.last_page;
          setTweets((prev) => (currentPage === 1 ? data : [...prev, ...data]));
          setHasNextPage(currentPage < lastPage);
        })
        .catch(function (error) {
          console.log(error.response?.data);
        })
        .finally(function () {
          setIsLoading(false);
          setIsRefreshing(false);
          setIsLoadingMore(false);
          isFetchingRef.current = false;
        });
    },
    [route.params.userId, currentPage],
  );

  useEffect(() => {
    getUser();
  }, [getUser]);

  useEffect(() => {
    getTweets();
  }, [getTweets]);

  function handleRefresh() {
    setIsRefreshing(true);
    getUser();
    if (currentPage === 1) {
      getTweets();
    } else {
      setCurrentPage(1);
    }
  }

  function handleFollow() {
    setIsFollowLoading(true);
    axiosConfig
      .post(`/users/${route.params.userId}/follow`)
      .then(() => {
        setIsFollowing(true);
        setUser((prev) =>
          prev ? { ...prev, followers_count: (prev.followers_count ?? 0) + 1 } : prev,
        );
      })
      .catch((error) => {
        console.log(error.response?.data);
      })
      .finally(() => setIsFollowLoading(false));
  }

  function handleUnfollow() {
    setIsFollowLoading(true);
    axiosConfig
      .delete(`/users/${route.params.userId}/follow`)
      .then(() => {
        setIsFollowing(false);
        setUser((prev) =>
          prev ? { ...prev, followers_count: (prev.followers_count ?? 1) - 1 } : prev,
        );
      })
      .catch((error) => {
        console.log(error.response?.data);
      })
      .finally(() => setIsFollowLoading(false));
  }

  function handleLoadMore() {
    if (isFetchingRef.current || !hasNextPage) return;
    setIsLoadingMore(true);
    setCurrentPage((prev) => prev + 1);
  }

  function handleDelete(id: number) {
    setTweets((prev) => prev.filter((tweet) => tweet.id !== id));
  }

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator style={{ marginTop: 8 }} size="large" color="gray" />
      ) : (
        <FlatList
          data={tweets}
          renderItem={({ item }) => <TweetItem item={item} onDelete={handleDelete} />}
          keyExtractor={(item) => item.id.toString()}
          ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
          ListHeaderComponent={
            user
              ? () => (
                  <ProfileHeader
                    user={user}
                    isOwnProfile={isOwnProfile}
                    isFollowing={isFollowing}
                    isFollowLoading={isFollowLoading}
                    onFollow={handleFollow}
                    onUnfollow={handleUnfollow}
                  />
                )
              : null
          }
          refreshing={isRefreshing}
          onRefresh={handleRefresh}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.2}
          ListFooterComponent={
            isLoadingMore ? <ActivityIndicator style={{ padding: 16 }} color="gray" /> : null
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  itemSeparator: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 8,
  },
});
