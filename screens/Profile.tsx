import {
  ActivityIndicator,
  FlatList,
  Image,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import EvilIcons from '@expo/vector-icons/EvilIcons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import { User, UserTweet } from '../types/User';
import { useCallback, useEffect, useState } from 'react';
import axiosConfig from '../helpers/axiosConfig';
import { format } from 'date-fns';

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

  const ProfileHeader = () => {
    if (!user) return null;
    return (
      <View>
        <Image
          source={{
            uri: 'https://images.unsplash.com/photo-1557683316-973673baf926?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1080&q=80',
          }}
          style={styles.backgroundImage}
        />
        <View style={styles.avatarContainer}>
          <Image source={{ uri: user.avatar }} style={styles.avatar} />
          <TouchableOpacity style={styles.followButton}>
            <Text style={styles.followButtonText}>Follow</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.nameContainer}>
          <Text style={styles.nameText}>{user.name}</Text>
          <Text style={styles.handleText}>@{user.username}</Text>
          {user.profile ? <Text style={styles.descriptionText}>{user.profile}</Text> : null}
          {user.location ? (
            <View style={styles.locationContainer}>
              <EvilIcons name="location" size={24} color="gray" />
              <Text style={styles.grayText}>{user.location}</Text>
            </View>
          ) : null}
          <View style={styles.linkContainer}>
            {user.link ? (
              <TouchableOpacity style={styles.linkItem} onPress={() => Linking.openURL(user.link!)}>
                <EvilIcons name="link" size={24} color="gray" />
                <Text style={styles.linkText}>{user.link_text ?? user.link}</Text>
              </TouchableOpacity>
            ) : null}
            {user.created_at ? (
              <View style={styles.linkItem}>
                <EvilIcons name="calendar" size={24} color="gray" />
                <Text style={styles.grayText}>
                  Joined {format(new Date(user.created_at), 'MMMM yyyy')}
                </Text>
              </View>
            ) : null}
          </View>
        </View>
        <View style={styles.followContainer}>
          <View style={styles.followItem}>
            <Text style={styles.followItemNumber}>0</Text>
            <Text style={styles.followItemText}>Following</Text>
          </View>
          <View style={styles.followItem}>
            <Text style={styles.followItemNumber}>0</Text>
            <Text style={styles.followItemText}>Followers</Text>
          </View>
        </View>
        <View style={styles.itemSeparator} />
      </View>
    );
  };

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
          ListHeaderComponent={ProfileHeader}
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
  backgroundImage: {
    height: 120,
  },
  avatarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: 'white',
    marginRight: 16,
    marginTop: -32,
    backgroundColor: '#e5e7eb',
  },
  followButton: {
    backgroundColor: 'black',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 24,
  },
  followButtonText: {
    fontWeight: 'bold',
    color: 'white',
  },
  nameContainer: {
    marginHorizontal: 16,
    marginVertical: 4,
  },
  nameText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  handleText: {
    fontSize: 14,
    color: '#666',
  },
  descriptionText: {
    marginVertical: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    marginTop: 4,
  },
  grayText: {
    color: 'gray',
  },
  linkContainer: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 16,
  },
  linkItem: {
    flexDirection: 'row',
    gap: 4,
  },
  linkText: {
    color: '#1d9bf1',
  },
  followContainer: {
    flexDirection: 'row',
    gap: 16,
    marginHorizontal: 16,
  },
  followItem: {
    flexDirection: 'row',
    marginVertical: 8,
  },
  followItemNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 4,
  },
  followItemText: {
    color: 'gray',
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
