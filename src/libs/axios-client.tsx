import axios from "axios";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
});

console.log(import.meta.env.VITE_BASE_URL);
axiosClient.interceptors.request.use(
  function (config) {
    const tokenUser = JSON.parse(localStorage.getItem("token"));
    if (tokenUser) {
      config.headers.Authorization = `bearer ${tokenUser?.access_token.trim()}`;
    }
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Response interceptor for API calls
axiosClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  async function (error) {
    let { response } = error;

    if (response.status === 401 || response.status === 403) {
      localStorage.removeItem("token");
    }

    // if (response.data.message === "Forbidden") {
    //   localStorage.removeItem("token");
    // }

    return Promise.reject(error);
  }
);

export default axiosClient;
