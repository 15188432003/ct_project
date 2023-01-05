<script>
export default {
  onPageNotFound: [
    function (res) {
      // // 跳转到 404 页面：
      console.log("res", res);
      if (res.path.indexOf("/products/") <= -1) {
        sessionStorage.setItem("mode", 1);
        window.location.href = "./#/pages/NotFound/NotFound";
      }
    },
  ],
  onLaunch: function () {
    console.log("App Launch");
  },
  onShow: function () {
    console.log("App Show");
  },
  onHide: function () {
    console.log("App Hide");
  },
};
</script>

<style lang="scss">
/*每个页面公共css */
@import "uview-ui/index.scss";

@font-face {
  font-family: "PoppinsBold";
  src: url("~@/static/font/Poppins-Bold.ttf");
}

@font-face {
  font-family: "PoppinsRegular";
  src: url("~@/static/font/Poppins-Regular.ttf");
}

/* #ifdef H5 */
::-webkit-scrollbar {
  display: inline-block !important;
  width: 12rpx !important;
  height: 12rpx !important;
  background: #f5f5f5 !important;
}

/*定义滚动条轨道 内阴影+圆角*/
::-webkit-scrollbar-track {
  border-radius: 10rpx;
  background-color: #fff;
}

/*定义滑块 内阴影+圆角*/
::-webkit-scrollbar-thumb {
  border-radius: 10rpx;
  // -webkit-box-shadow: inset 0 0 6rpx rgba(0, 0, 0, .1);
  background-color: #e0e0e0;
}

/* #endif */

.body{
	position: absolute;
	height: 100%;
	width: 100%;
}
</style>
