import EvilIcons from '@expo/vector-icons/EvilIcons';
import { ActivityIndicator, FlatList, StyleSheet, TextInput, View } from 'react-native';
import { Tweet } from '../types';
import { useState } from 'react';
import axiosConfig from '../helpers/axiosConfig';
import TweetItem from '../components/TweetItem';

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  function handleSearch(text: string) {
    setQuery(text);
    if (!text.trim()) {
      setData([]);
      return;
    }
    setIsLoading(true);
    axiosConfig
      .get('/tweets/search', { params: { search: text } })
      .then((response) => {
        setData(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <EvilIcons name="search" size={24} color="gray" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search tweets..."
          placeholderTextColor="gray"
          value={query}
          onChangeText={handleSearch}
          autoCapitalize="none"
          returnKeyType="search"
        />
      </View>
      {isLoading ? (
        <ActivityIndicator style={{ marginTop: 8 }} size="large" color="gray" />
      ) : (
        <FlatList
          data={data}
          renderItem={({ item }) => <TweetItem item={item} />}
          keyExtractor={(item: Tweet) => item.id.toString()}
          ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    margin: 12,
    paddingHorizontal: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 6,
    fontSize: 16,
    color: '#111',
  },
  itemSeparator: {
    height: 1,
    backgroundColor: '#eee',
  },
});
