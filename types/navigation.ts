export type RootStackParamList = {
  Tabs: undefined;
  NewTweet: undefined;
  Tweet: { tweetId: number; onDelete?: (id: number) => void };
  Profile: { userId: number };
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

export type TabParamList = {
  Home: undefined;
  Search: undefined;
  Notifications: undefined;
};
