import { User } from './User';

export type Tweet = {
  id: number;
  body: string;
  user_id: number;
  user: User;
  created_at: string;
  pinned?: boolean;
};
