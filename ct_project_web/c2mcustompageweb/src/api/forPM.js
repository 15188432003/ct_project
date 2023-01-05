import request from "@/utils/request";
const me = "me/chitu/v1";
const v1 = "/user/v1";
// const me = "me/v1";
/**
 * 获取产品基本款总列表
 * @export
 * @param {*} parameter
 * @return {*}
 */
export function basicstylesList(parameter) {
  return request({
    url: `${me}/basicstyles/list?pageIndex=${parameter.pageIndex}&pageSize=${parameter.pageSize}`,
    method: "post",
    data: parameter,
  });
}
/**
 * 获取基本款分类列表
 * @export
 * @param {*} parameter
 * @return {*}
 */
export function getCatergories() {
  return request({
    url: `${me}/basicstyles/catergories`,
    method: "get",
  });
}
/**
 * 获取产品基本款配置详情
 * @export
 * @param {*} parameter
 * @return {*}
 */
export function getConfiguration(parameter) {
  return request({
    url: `${me}/basicstyle/${parameter.id}/configuration`,
    method: "get",
  });
}
/**
 * 获取默认样本信息
 * @export
 * @param {*} parameter
 * @return {*}
 */
export function getsample(parameter) {
  return request({
    url: `${me}/default/sample/${parameter.id}`,
    method: "get",
  });
}
/**
 * 获取加购商品列表
 * @export
 * @param {*} parameter
 * @return {*}
 */
export function additionalList(parameter) {
  return request({
    url: `${me}/basicstyle/${parameter.id}/additional/goods/list`,
    method: "get",
  });
}
/**
 * 命中样本 hitType=（1即可 2定制 3立即购买）
 * @export
 * @param {*} parameter
 * @return {*}
 */
export function sampleHit(parameter) {
  return request({
    url: `${me}/sample/hit`,
    method: "post",
    data: parameter,
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
    url: `${v1}/category/list/get`,
    method: "post",
    data: parameter,
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
    url: `${v1}/product/list/get`,
    method: "post",
    data: parameter,
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
    url: `${v1}/product/info/get`,
    method: "post",
    data: parameter,
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
    url: `${v1}/shopify/merchandises/purchase`,
    method: "post",
    data: parameter,
  });
}

/**
 * 获取币种列表
 */
export function getCurrency() {
  return request({
    url: `${v1}/currency/list/get`,
    method: "post",
  });
}
