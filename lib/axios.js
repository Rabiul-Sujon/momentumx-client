// import axios from 'axios';

// const axiosInstance = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_API_URL,
//   withCredentials: true,
// });

// export default axiosInstance;

import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

// Add response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;