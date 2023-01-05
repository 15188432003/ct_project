import request from "./request.js";

const URL = "/api";
// const URL = 'http://13.56.178.192:10888'
//const URL = "http://design-your-own.rokitlife.com/api";
// const URL = 'http://192.168.1.231:10008/api' // api 前缀地址
/**
 * 数据获取公共封装
 */
export default function fetchApi({ API_URL = URL, path, params, method }) {
  return request(API_URL, path, params, method);
}

export { URL };
