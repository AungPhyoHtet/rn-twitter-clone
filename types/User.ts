export type UserTweet = {
  id: number;
  body: string;
  created_at: string;
};

export type User = {
  id: number;
  name: string;
  username: string;
  avatar: string;
  profile?: string;
  location?: string;
  link?: string;
  link_text?: string;
  created_at?: string;
  followers_count?: number;
  following_count?: number;
  is_following?: boolean;
  tweets?: UserTweet[];
};
