import AntDesign from '@expo/vector-icons/AntDesign';
import EvilIcons from '@expo/vector-icons/EvilIcons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { FlatList, Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RootStackParamList } from './types';

export default function HomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const DATA = [
    {
      id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
      title: 'First Item',
    },
    {
      id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
      title: 'Second Item',
    },
    {
      id: '58694a0f-3da1-471f-bd96-145571e29d72',
      title: 'Third Item',
    },
  ];
  type ItemProps = { title: string };

  function goToProfile() {
    navigation.navigate('Profile');
  }

  function goToTweet() {
    navigation.navigate('Tweet');
  }

  function goToNewTweet() {
    navigation.navigate('NewTweet');
  }

  const RenderItem = ({ item }: { item: ItemProps }) => (
    <View style={styles.itemContainer}>
      <TouchableOpacity onPress={() => goToProfile()}>
        <Image
          source={{ uri: 'https://reactnative.dev/img/tiny_logo.png' }}
          style={styles.avatar}
        />
      </TouchableOpacity>
      <View style={{ flex: 1 }}>
        <TouchableOpacity style={styles.tweetUser} onPress={() => goToTweet()}>
          <Text numberOfLines={1} style={styles.tweetText}>
            {item.title}
          </Text>
          <Text numberOfLines={1} style={styles.username}>
            @aungphyo.tech
          </Text>
          <Text numberOfLines={1} style={styles.dot}>
            .
          </Text>
          <Text numberOfLines={1} style={styles.timestamp}>
            9m
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tweetContentContainer} onPress={() => goToTweet()}>
          <Text numberOfLines={2} style={styles.tweetContent}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec venenatis vulputate
            lorem. Maecenas vestibulum mollis diam.
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
      <FlatList
        data={DATA}
        renderItem={({ item }) => <RenderItem item={item} />}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => {
          return <View style={styles.itemSeparator}></View>;
        }}
      />
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  tweetText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  username: {
    fontSize: 14,
    color: '#666',
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
