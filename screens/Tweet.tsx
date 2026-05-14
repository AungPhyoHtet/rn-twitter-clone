import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Entypo from '@expo/vector-icons/Entypo';
import EvilIcons from '@expo/vector-icons/EvilIcons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from './types';

export default function TweetScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  function goToProfile() {
    navigation.navigate('Profile');
  }
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => goToProfile()}>
        <View style={styles.itemContainer}>
          <Image
            source={{ uri: 'https://reactnative.dev/img/tiny_logo.png' }}
            style={styles.avatar}
          />
          <View style={styles.tweetUser}>
            <Text numberOfLines={1} style={styles.tweetText}>
              Aung Phyo Htet
            </Text>
            <Text numberOfLines={1} style={styles.username}>
              @aungphyo.tech
            </Text>
          </View>
          <Entypo name="dots-three-vertical" size={16} color="gray" />
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.tweetContentContainer}>
        <Text style={styles.tweetContent}>
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Totam quo alias soluta,
          perferendis commodi, necessitatibus labore qui consequatur sapiente libero similique
          adipisci, atque eaque optio! Quas vero optio temporibus quisquam modi atque nam earum nemo
          iste? Officia eveniet harum exercitationem natus in aut illo quae ipsa pariatur.
          Dignissimos quod error, sequi nihil, quasi optio ex temporibus sunt, commodi accusamus id.
        </Text>
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
});
