import EvilIcons from '@expo/vector-icons/EvilIcons';
import { ActivityIndicator, FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import { Tweet } from '../types';
import { useRef, useState } from 'react';
import axiosConfig from '../helpers/axiosConfig';
import TweetItem from '../components/TweetItem';

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleDelete(id: number) {
    setData((prev) => prev.filter((tweet: Tweet) => tweet.id !== id));
  }

  function handleSearch(text: string) {
    setQuery(text);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!text.trim()) {
      setData([]);
      return;
    }
    debounceRef.current = setTimeout(() => {
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
    }, 500);
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
          renderItem={({ item }) => <TweetItem item={item} onDelete={handleDelete} />}
          keyExtractor={(item: Tweet) => item.id.toString()}
          ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
          ListEmptyComponent={
            query.trim() ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No results for "{query}"</Text>
              </View>
            ) : null
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
  emptyContainer: {
    alignItems: 'center',
    marginTop: 48,
  },
  emptyText: {
    color: 'gray',
    fontSize: 16,
  },
});
