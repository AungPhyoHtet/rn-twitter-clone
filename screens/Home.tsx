import AntDesign from '@expo/vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ActivityIndicator, FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { RootStackParamList, Tweet } from '../types';
import { useCallback, useEffect, useRef, useState } from 'react';
import axiosConfig from '../helpers/axiosConfig';
import TweetItem from '../components/TweetItem';

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
    axiosConfig
      .get('/tweets', { params: { page: currentPage } })
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

  function goToNewTweet() {
    navigation.navigate('NewTweet');
  }

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator style={{ marginTop: 8 }} size="large" color="gray" />
      ) : (
        <FlatList
          data={data}
          renderItem={({ item }) => <TweetItem item={item} />}
          keyExtractor={(item: Tweet) => item.id.toString()}
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
  itemSeparator: {
    height: 1,
    backgroundColor: '#eee',
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
