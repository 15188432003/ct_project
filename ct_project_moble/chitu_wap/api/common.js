import request from "@/utils/request/index.js";
const v1 = "/user/v1";
/**
 * @description: 获取基本款配置详情
 * @param {*} id 基本款id
 * @return {*}
 */
export function getBasicstyleConfiguration(id) {
  return request({
    path: `/me/chitu/v1/basicstyle/${id}/configuration`,
    method: "get",
  });
}
/**
 * @description: 获取默认样本信息
 * @param {*} id
 * @return {*}
 */
export function getDefaultSampleByid(id) {
  return request({
    path: `/me/chitu/v1/default/sample/${id}`,
    method: "get",
  });
}

/**
 * @description: 获取默认样本信息
 * @param {*} id
 * @return {*}
 */
export function getAdditionalGoodsList(id) {
  return request({
    path: `/me/chitu/v1/basicstyle/${id}/additional/goods/list`,
    method: "get",
  });
}
/**
 * @description: 获取默认样本信息
 * @param {*} pageIndex
 * @param {*} pageSize
 * @return {*}
 */
export function getBasicstylesList({ categoryId, pageIndex, pageSize }) {
  return request({
    path: `/me/chitu/v1/basicstyles/list`,
    method: "post",
    params: { categoryId, pageIndex, pageSize },
  });
}

/**
 * @description: 命中样本。（hitType=1:即时；hitType=2:定制；hitType=3:立即购买
 * @param {*} pageIndex
 * @param {*} pageSize
 * @return {*}
 */
export function hitSample(data) {
  return request({
    path: "/me/chitu/v1/sample/hit",
    method: "post",
    params: data,
  });
}

/**
 * @description: 获取基本款分类列表
 * @param {*} pageIndex
 * @param {*} pageSize
 * @return {*}
 */
export function getBasicstylesCategories() {
  return request({
    path: "/me/chitu/v1/basicstyles/catergories",
    method: "get",
  });
}

/**
 * 获取目录
 * @export
 * @param {*} parameter
 * @return {*}
 */
export function getCategory(parameter) {
  return request({
    path: `${v1}/category/list/get`,
    method: "post",
    params: parameter,
  });
}

/**
 * 获取产品列表
 * @export
 * @param {*} {category_id: "xxxx", }
 * @return {*}
 */
export function getProductList(parameter) {
  return request({
    path: `${v1}/product/list/get`,
    method: "post",
    params: parameter,
  });
}

/**
 * 获取产品信息
 * @export
 * @param {*} {  id: "xxxx"}
 * @return {*}
 */
export function getProductInfo(parameter) {
  return request({
    path: `${v1}/product/info/get`,
    method: "post",
    params: parameter,
  });
}

/**
 * 购买产品
 * @export
 * @param {*} [{vid: "xxx", // shopify 商品ID ecp_vid.shopifyquantity: 1 // 数量}]
 * @return {*}
 */
export function purchase(parameter) {
  return request({
    path: `${v1}/shopify/merchandises/purchase`,
    method: "post",
    params: parameter,
  });
}

/**
 * 获取币种列表
 */
export function getCurrency() {
  return request({
    path: `${v1}/currency/list/get`,
    method: "post",
  });
}
