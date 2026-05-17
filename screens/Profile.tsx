import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import { User, UserTweet } from '../types/User';
import { useCallback, useEffect, useState } from 'react';
import axiosConfig from '../helpers/axiosConfig';
import ProfileHeader from '../components/ProfileHeader';

type Props = NativeStackScreenProps<RootStackParamList, 'Profile'>;

export default function ProfileScreen({ route }: Props) {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  const getUser = useCallback(
    function () {
      axiosConfig
        .get(`/users/${route.params.userId}`)
        .then(function (response) {
          setUser(response.data);
          console.log(response.data);
        })
        .catch(function (error) {
          console.log(error.response?.data);
        })
        .finally(function () {
          setIsLoading(false);
        });
    },
    [route.params.userId],
  );

  useEffect(() => {
    getUser();
  }, [getUser]);

  const RenderItem = ({ item }: { item: UserTweet }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.tweetContent}>{item.body}</Text>
    </View>
  );


  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator style={{ marginTop: 8 }} size="large" color="gray" />
      ) : (
        <FlatList
          data={user?.tweets ?? []}
          renderItem={RenderItem}
          keyExtractor={(item) => item.id.toString()}
          ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
          ListHeaderComponent={user ? () => <ProfileHeader user={user} /> : null}
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
  itemContainer: {
    padding: 16,
  },
  tweetContent: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
});
