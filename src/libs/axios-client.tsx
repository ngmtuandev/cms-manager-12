import axios from "axios";

const axiosClient = axios.create({
  baseURL: "https://lab-manager-backend-production.up.railway.app",
});

axiosClient.interceptors.request.use(
  function (config) {
    const tokenString = localStorage.getItem("token");
    if (tokenString !== null) {
      const tokenUser = JSON.parse(tokenString);
      config.headers.Authorization = `bearer ${tokenUser.access_token.trim()}`;
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

    if (response && (response.status === 401 || response.status === 403)) {
      localStorage.removeItem("token");
    }

    // if (response?.data.message === "Forbidden") {
    //   localStorage.removeItem("token");
    // }

    return Promise.reject(error);
  }
);

export default axiosClient;
