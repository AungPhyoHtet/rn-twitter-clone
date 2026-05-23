import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://laravel-twitter-clone.test/api/v1',
  headers: {
    Accept: 'application/json',
  },
});

if (__DEV__) {
  instance.interceptors.request.use((config) => {
    console.log(`--> ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    console.log('Headers:', config.headers);
    if (config.data) console.log('Body:', config.data);
    return config;
  });

  instance.interceptors.response.use(
    (response) => {
      console.log(`<-- ${response.status} ${response.config.url}`);
      console.log('Response:', response.data);
      return response;
    },
    (error) => {
      console.log(`<-- ERROR ${error.response?.status} ${error.config?.url}`);
      console.log('Error Response:', error.response?.data);
      return Promise.reject(error);
    },
  );
}

export default instance;
