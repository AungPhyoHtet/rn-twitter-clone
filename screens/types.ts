export type RootStackParamList = {
  Tabs: undefined;
  NewTweet: undefined;
  Tweet: { tweetId: number };
  Profile: { userId: number };
  Login: undefined;
  Register: undefined;
};

export type TabParamList = {
  Home: undefined;
  Search: undefined;
  Notifications: undefined;
};
