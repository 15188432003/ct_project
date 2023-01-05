/**
 * 网络请求API接口
 * @param  {String} api    api 根地址
 * @param  {String} path   请求路径
 * @param  {Objece} params 参数
 * @return {Promise}       包含抓取任务的Promise
 */

module.exports = function (api, path, params, method) {
  return new Promise(async (resolve, reject) => {
    // 获取缓存中token
    const authorization = uni.getStorageSync("token");
    uni.showLoading({
      title: "loading",
    });
    const header = {
      // "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      "Content-Type": "application/json; charset=utf-8",
      Authorization: authorization ? "Bearer " + authorization : "",
    };

    // const newPath = path.replace(/%E2%80%8B/g, "")

    // const newApiUrl = api + newPath
    // console.log(newApiUrl)
    await uni
      .request({
        url: api + path,
        header,
        data: !params instanceof Array ? Object.assign({}, params) : params,
        method: method || "GET",
        sslVerify: false,
      })
      .then((data) => {
        const [error, res] = data;
        uni.hideLoading();
        if (res) {
          if (
            res.statusCode !== 200 ||
            (res.data.code && res.data.code !== 200)
          ) {
            uni.showToast({
              icon: "none",
              title: res.data.msg,
              duration: 3000,
            });
            if (res.statusCode === 401 || res.statusCode === 403) {
              uni.clearStorageSync();
              wx.reLaunch({
                url: "/pages/login/index",
              });
            }
            reject(res);
          } else {
            if (!res.data.Data) {
              resolve(res.data);
            } else {
              resolve(res.data.Data);
            }
          }
        } else {
          reject(error);
        }
      })
      .catch((err) => {
        uni.hideLoading();
        reject(err);
      });
  });
};
