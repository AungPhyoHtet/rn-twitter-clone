import { FlatList, Image, Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import EvilIcons from '@expo/vector-icons/EvilIcons';

export default function ProfileScreen() {
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

  const RenderItem = ({ item }: { item: ItemProps }) => (
    <View style={styles.itemContainer}>
      <TouchableOpacity>
        <Text>{item.title}</Text>
      </TouchableOpacity>
    </View>
  );

  const ProfileHeader = () => {
    return (
      <View style={styles.container}>
        <Image
          source={{
            uri: 'https://images.unsplash.com/photo-1557683316-973673baf926?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1080&q=80',
          }}
          style={styles.backgroundImage}
        />

        <View style={styles.avatarContainer}>
          <Image
            source={{ uri: 'https://reactnative.dev/img/tiny_logo.png' }}
            style={styles.avatar}
          />
          <TouchableOpacity style={styles.followButton}>
            <Text style={styles.followButtonText}>Follow</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.nameContainer}>
          <Text style={styles.nameText}>Aung Phyo</Text>
          <Text style={styles.handleText}>@aungphyo.tech</Text>
          <Text style={styles.descriptionText}>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Iste, quidem!
          </Text>
          <View style={styles.locationContainer}>
            <EvilIcons name="location" size={24} color="gray" />
            <Text style={styles.grayText}>Bangkok, Thailand</Text>
          </View>
          <View style={styles.linkContainer}>
            <TouchableOpacity
              style={styles.linkItem}
              onPress={() => Linking.openURL('https://example.com/')}
            >
              <EvilIcons name="link" size={24} color="gray" />
              <Text style={styles.linkText}>www.example.com</Text>
            </TouchableOpacity>
            <View style={styles.linkItem}>
              <EvilIcons name="calendar" size={24} color="gray" />
              <Text style={styles.grayText}>12 May 2026</Text>
            </View>
          </View>
        </View>

        <View style={styles.followContainer}>
          <View style={styles.followItem}>
            <Text style={styles.followItemNumber}>1024</Text>
            <Text style={styles.followItemText}>Following</Text>
          </View>
          <View style={styles.followItem}>
            <Text style={styles.followItemNumber}>2048</Text>
            <Text style={styles.followItemText}>Followers</Text>
          </View>
        </View>

        <View style={styles.itemSeparator}></View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={DATA}
        renderItem={RenderItem}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => {
          return <View style={styles.itemSeparator}></View>;
        }}
        ListHeaderComponent={ProfileHeader}
      />
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
    flexDirection: 'row',
    padding: 16,
  },
});
