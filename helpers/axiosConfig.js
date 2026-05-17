import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://laravel-twitter-clone.test/api/v1',
  headers: {
    Accept: 'application/json',
  },
});

export default instance;
