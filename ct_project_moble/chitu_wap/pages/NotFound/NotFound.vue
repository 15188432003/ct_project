<template>
  <view id="components-layout-demo-basic">
    <u-image
      src="@/static/glass-logo.png"
      class="logo"
      :width="286"
      :height="56"
    >
      <u-loading slot="loading"></u-loading>

      <view slot="error">
        <u-image
          src="@/static/icon/photo.jpg"
          :width="244"
          :height="244"
        ></u-image>
      </view>
    </u-image>

    <view class="box">
      <view class="box_inner" v-if="mode == 2">
        <u-image src="@/static/404.png" class="logo" :width="432" :height="384">
          <u-loading slot="loading"></u-loading>

          <view slot="error">
            <u-image
              src="@/static/icon/photo.jpg"
              :width="244"
              :height="244"
            ></u-image>
          </view>
        </u-image>
        <view>
          <view class="h1">Sorry, no product found.</view>
          <view>
            You may want to return to the
            <text class="href" @click="goLink('https://rokittechnology.com/')">
              home page.</text
            >
          </view>
        </view>
      </view>
      <view class="box_inner" v-if="mode == 1">
        <u-image src="@/static/404.png" class="logo" :width="432" :height="384">
          <u-loading slot="loading"></u-loading>

          <view slot="error">
            <u-image
              src="@/static/icon/photo.jpg"
              :width="244"
              :height="244"
            ></u-image>
          </view>
        </u-image>
        <view class="h1">Sorry, product not found.</view>
        <button class="button-1" size="large" @click="goLink('./')">
          CONTINUE SHOPPING
        </button>
      </view>
    </view>
    <!-- <a-layout style="z-index: 9999">
      <a-layout>
        <a-layout-content style="height: 100%">
          <a-row style="height: 100%">
            <a-col :span="24" style="height: 100%; position: relative">
              <a
                style="position: fixed; top: 3%; z-index: 4"
                href="https://rokittechnology.com/"
              >
                <img
                  src="../assets/img/leftbutton.png"
                  style="margin-right: 20px; width: 38px; visibility: hidden"
                />
                <img
                  src="../assets/img/logo.png"
                  style="width: 248px; height: 49px"
                />
              </a>

              <view class="box">
                <view v-if="mode == 2">
                  <img src="../assets/img/404.png" alt="" />
                  <view>
                    <p>Sorry, no product found.</p>
                    <p>
                      You may want to return to the
                      <a href="https://rokittechnology.com/">home page.</a>
                    </p>
                  </view>
                </view>
                <view v-if="mode == 1">
                  <img src="../assets/img/404.png" alt="" />
                  <p>Sorry, product not found.</p>
                  <a-button class="button-1" size="large" @click="goHome">
                    CONTINUE SHOPPING
                  </a-button>
                </view>
              </view>
            </a-col>
          </a-row>
        </a-layout-content>
      </a-layout>
    </a-layout> -->
  </view>
</template>

<script>
export default {
  data() {
    return {
      mode: 1,
    };
  },
  mounted() {
    // vue 获取参数
    if (process.env.NODE_ENV === "prod") {
      gtag("event", "page_view", {
        url: `${window.location.href}`,
        name: `404`,
      });
    }
    if (sessionStorage.getItem("mode")) {
      this.mode = sessionStorage.getItem("mode");
    }
  },
  methods: {
    async goLink(href) {
      sessionStorage.removeItem("mode");
      window.location.replace(href);
    },
  },
};
</script>

<style lang="scss" scoped>
.logo {
  margin: 0 auto;
  margin-top: 10rpx;
}
.box {
  width: 100vw;
  height: 100vh;
  text-align: center;
  display: table;
  background: #fff;
  & > .box_inner {
    display: table-cell;
    vertical-align: middle;
    font-size: 32rpx;
    view {
      margin-top: 30rpx;

      .href {
        text-decoration: underline;
        color: #011d7c;
        padding-left: 5rpx;
      }
    }
    view + view {
      font-size: 20rpx;
    }
    .h1 {
      font-size: 32rpx;
    }
    img {
      width: 175rpx;
    }
  }
  .button-1 {
    background: #011d7c !important;
    color: #fff !important;
    border: #011d7c !important;
    padding: 5rpx 10rpx;
    width: 300rpx;
    font-size: 12rpx;
    margin-top: 10rpx;
  }
}
</style>
