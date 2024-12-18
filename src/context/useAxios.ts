// useAxios.ts
import axios from "axios";
import { useContext } from "react";
import { AppContext } from "./AppContext";
import { BASE_URL } from "../constant";


const useAxios = () => {
  const appState: any = useContext(AppContext);
  const token = appState?.userDetails?.token;

  const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 1000000,
  });

  axiosInstance.interceptors.request.use(
    (config) => {
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
      if (config.data instanceof FormData) {
        config.headers["Content-Type"] = "multipart/form-data";
      } else {
        config.headers["Content-Type"] = "application/json";
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  return axiosInstance;
};

export default useAxios;
