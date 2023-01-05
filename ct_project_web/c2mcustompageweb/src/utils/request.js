import axios from "axios";
import store from "@/store";
import storage from "store";
import notification from "ant-design-vue/es/notification";
import { VueAxios } from "./axios";
import { ACCESS_TOKEN } from "@/store/mutation-types";

let baseURL = "";

baseURL = process.env.VUE_APP_API_BASE_URL;

// 创建 axios 实例
const request = axios.create({
  // API 请求的默认前缀
  // baseURL: "http://36.156.138.127:10888/api", //测试
  // baseURL: "http://192.168.1.231:10008/api", //本地
  // baseURL: "http://13.56.178.192:10888/api",
  // baseURL: "http://design-your-own.rokitlife.com/api", //正式,
  // timeout: 8000 // 请求超时时间
  // headers: { 'Content-Type': 'application/json;charset=utf-8', 'X-Bucket': 'doc' }
  baseURL: baseURL,
});

// 异常拦截处理器
const errorHandler = (error) => {
  // console.log(error);
  if (error.response) {
    const data = error.response.data;
    // 从 localstorage 获取 token
    const token = storage.get(ACCESS_TOKEN);
    if (error.response.status === 500 || error.response.status === 400) {
      notification.error({
        message: data.Message,
        description: "",
      });
    }

    if (error.response.status === 403) {
      notification.error({
        message: "Forbidden",
        description: data.message,
      });
    }
    if (
      error.response.status === 401 &&
      !(data.result && data.result.isLogin)
    ) {
      notification.error({
        message: "Unauthorized",
        description: "Authorization verification failed",
      });
      if (token) {
        store.dispatch("Logout").then(() => {
          setTimeout(() => {
            window.location.reload();
          }, 1500);
        });
      }
    }
  }
  return Promise.reject(error);
};

// request interceptor
request.interceptors.request.use((config) => {
  const token = storage.get(ACCESS_TOKEN);
  // console.log(config, 'config')
  config.timeout = config.timeout || 30000;
  // 如果 token 存在
  // 让每个请求携带自定义 token 请根据实际情况自行修改
  if (token) {
    // config.headers['Access-Token'] = token
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
}, errorHandler);

// response interceptor
request.interceptors.response.use((response) => {
  if (response.config.responseType === "arraybuffer") {
    return response;
  } else {
    return response.data;
  }

  // Promise.reject(error)
}, errorHandler);

const installer = {
  vm: {},
  install(Vue) {
    Vue.use(VueAxios, request);
  },
};

export default request;

export { installer as VueAxios, request as axios };
