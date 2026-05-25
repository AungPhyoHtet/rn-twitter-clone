import {
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Entypo from '@expo/vector-icons/Entypo';
import EvilIcons from '@expo/vector-icons/EvilIcons';
import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList, Tweet } from '../types';
import { useCallback, useEffect, useRef, useState } from 'react';
import axiosConfig from '../helpers/axiosConfig';
import { format } from 'date-fns';
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { useAuth } from '../context/AuthProvider';

type Props = NativeStackScreenProps<RootStackParamList, 'Tweet'>;

export default function TweetScreen({ route }: Props) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { user } = useAuth();
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [tweet, setTweet] = useState<Tweet | null>();
  const [isPinned, setIsPinned] = useState(false);

  const getTweet = useCallback(
    function () {
      axiosConfig
        .get(`/tweets/${route.params.tweetId}`)
        .then(function (response) {
          setTweet(response.data.data);
          setIsPinned(response.data.data.pinned ?? false);
          console.log(response.data.data);
        })
        .catch(function (error) {
          console.log(error.response?.data);
        })
        .finally(function () {
          setIsLoading(false);
        });
    },
    [route.params.tweetId],
  );

  useEffect(() => {
    getTweet();
  }, [getTweet]);

  function goToProfile(userId: number) {
    navigation.navigate('Profile', { userId });
  }

  function handleMorePress() {
    bottomSheetRef.current?.present();
  }

  function handlePin() {
    if (!tweet) return;
    bottomSheetRef.current?.dismiss();
    const request = isPinned
      ? axiosConfig.delete(`/tweets/${tweet.id}/pin`)
      : axiosConfig.post(`/tweets/${tweet.id}/pin`);
    request.then(() => setIsPinned((prev) => !prev)).catch(console.error);
  }

  function handleDelete() {
    if (!tweet) return;
    bottomSheetRef.current?.dismiss();
    Alert.alert('Delete Tweet', 'Are you sure you want to delete this tweet?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          axiosConfig
            .delete(`/tweets/${tweet.id}`)
            .then(() => {
              route.params.onDelete?.(tweet.id);
              navigation.goBack();
            })
            .catch(console.error);
        },
      },
    ]);
  }

  const isOwnTweet = tweet ? user?.id === tweet.user_id : false;

  return (
    <View style={styles.container}>
      {isLoading || !tweet ? (
        <ActivityIndicator style={{ marginTop: 8 }} size="large" color="gray" />
      ) : (
        <>
          <View style={styles.itemContainer}>
            <TouchableOpacity onPress={() => goToProfile(tweet.user.id)}>
              <Image source={{ uri: tweet.user.avatar }} style={styles.avatar} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.tweetUser} onPress={() => goToProfile(tweet.user.id)}>
              <Text numberOfLines={1} style={styles.tweetText}>
                {tweet.user.name}
              </Text>
              <Text numberOfLines={1} style={styles.username}>
                @{tweet.user.username}
              </Text>
            </TouchableOpacity>
            {isOwnTweet && (
              <TouchableOpacity onPress={handleMorePress} style={styles.moreButton}>
                <Entypo name="dots-three-vertical" size={16} color="gray" />
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity style={styles.tweetContentContainer}>
            <Text style={styles.tweetContent}>{tweet.body}</Text>
            <View style={styles.tweetTimestampContainer}>
              <Text style={styles.tweetTimestampText}>
                {format(new Date(tweet.created_at), 'h:mm a')}
              </Text>
              <Text style={styles.tweetTimestampText}>&middot;</Text>
              <Text style={styles.tweetTimestampText}>
                {format(new Date(tweet.created_at), 'd MMM.yy')}
              </Text>
              <Text style={styles.tweetTimestampText}>&middot;</Text>
              <Text style={[styles.tweetTimestampText, styles.linkColor]}>Twitter for iPhone</Text>
            </View>
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
        </>
      )}

      <BottomSheetModal
        ref={bottomSheetRef}
        backdropComponent={(props) => (
          <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />
        )}
      >
        <BottomSheetView style={styles.sheetContent}>
          <TouchableOpacity onPress={handlePin} style={styles.sheetOption}>
            <Entypo name="pin" size={22} color="#333" />
            <Text style={styles.sheetOptionTextDefault}>
              {isPinned ? 'Unpin Tweet' : 'Pin Tweet'}
            </Text>
          </TouchableOpacity>
          <View style={styles.sheetSeparator} />
          <TouchableOpacity onPress={handleDelete} style={styles.sheetOption}>
            <EvilIcons name="trash" size={26} color="#e0245e" />
            <Text style={styles.sheetOptionTextDanger}>Delete Tweet</Text>
          </TouchableOpacity>
        </BottomSheetView>
      </BottomSheetModal>
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
    alignItems: 'center',
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
  moreButton: {
    padding: 4,
    marginLeft: 4,
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
  tweetTimestampContainer: {
    flexDirection: 'row',
    marginTop: 12,
  },
  tweetTimestampText: {
    color: 'gray',
    marginRight: 6,
  },
  linkColor: {
    color: '#1d9bf1',
  },
  sheetContent: {
    padding: 16,
    paddingBottom: 32,
  },
  sheetOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  sheetSeparator: {
    height: 1,
    backgroundColor: '#e5e7eb',
  },
  sheetOptionTextDefault: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  sheetOptionTextDanger: {
    fontSize: 16,
    color: '#e0245e',
    fontWeight: '500',
  },
});
