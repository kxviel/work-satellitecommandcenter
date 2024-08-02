import axios from "axios";
import { store } from "../Redux/store";
import { toastMessage } from "./toast";
import { resetState } from "../Redux/actions/resetAction";

const http = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
});

http.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("sm-access-token");
    if (config.headers)
      config.headers.Authorization = token ? `Bearer ${token}` : "";
    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);

function refresh_token() {
  console.log("Refreshing access token");
  const token = localStorage.getItem("sm-refresh-token");
  return axios.get(`${process.env.REACT_APP_BASE_URL}/user/auth/refresh`, {
    headers: {
      Authorization: "Bearer " + token,
    },
  });
}

let refreshing_token: any = null;

http.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const config = error.config;
    if (error.response && error?.response?.status === 498 && !config._retry) {
      config._retry = true;
      try {
        refreshing_token = refreshing_token
          ? refreshing_token
          : refresh_token();
        let res = await refreshing_token;
        refreshing_token = null;
        if (res.data.data) {
          localStorage.setItem("sm-access-token", res.data.data.accessToken);
          localStorage.setItem("sm-refresh-token", res.data.data.refreshToken);
        }
        return http(config);
      } catch (err) {
        localStorage.clear();
        toastMessage("error", "Session Expired");
        store.dispatch(resetState());
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);

export default http;
