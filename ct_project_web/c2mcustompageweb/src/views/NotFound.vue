<template>
  <div id="components-layout-demo-basic">
    <a-layout style="z-index: 9999">
      <a-layout>
        <!-- 中间内容 -->
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

              <div class="box">
                <div v-if="mode == 2">
                  <img src="../assets/img/404.png" alt="" />
                  <div>
                    <p>Sorry, no product found.</p>
                    <p>
                      You may want to return to the
                      <a href="https://rokittechnology.com/">home page.</a>
                    </p>
                  </div>
                </div>
                <div v-if="mode == 1">
                  <img src="../assets/img/404.png" alt="" />
                  <p>Sorry, product not found.</p>
                  <a-button class="button-1" size="large" @click="goHome">
                    CONTINUE SHOPPING
                  </a-button>
                </div>
              </div>
            </a-col>
          </a-row>
        </a-layout-content>
      </a-layout>
    </a-layout>
  </div>
</template>

<script>
export default {
  name: "NotFound",
  components: {},
  data() {
    return {
      mode: 1, //1 除了店铺找不到以外的错误  //2 店铺被删除(无产品 无分类 分类里找不到产品)
    };
  },
  computed: {},
  watch: {},
  beforeDestroy() {},
  mounted() {
    // vue 获取参数
    if (this.$route.params.mode) {
      this.mode = this.$route.params.mode;
    }
  },
  methods: {
    async goHome() {
      window.location.replace("./");
    },
  },
};
</script>
<style lang="less" scoped>
#scene {
  position: fixed;
  top: 0%;
  // display: inline-block;
  z-index: 1;
  width: 80%;
  height: 100%;
  // background-image: url("../assets/img/background.png") !important;
  // background-size: cover;
}
#components-layout-demo-basic {
  position: relative;
  height: 100%;
}
#components-layout-demo-basic > .ant-layout:last-child {
  height: 100%;
}
.right-nav {
  background: #fff;
  height: 100%;
  position: relative;
  padding: 10px 40px 0 40px;
  border-radius: 6px;
  z-index: 2;
}
.lensButton {
  position: absolute;
  // margin: 800px 0 0 1500px;
  right: 40px;
  bottom: 40px;
  z-index: 4;
  cursor: pointer;
}
.ant-layout {
  background-color: transparent !important;
}
.ant-layout-footer {
  z-index: 3;
  padding: 24px 0 !important;
  background-color: transparent !important;
}

.box {
  width: 100vw;
  height: 100vh;
  text-align: center;
  display: table;
  background: #fff;
  & > div {
    display: table-cell;
    vertical-align: middle;
    font-size: 32px;
    p {
      margin-top: 30px;
      a {
        text-decoration: underline;
        color: #011d7c;
      }
    }
    p + p {
      font-size: 16px;
    }
    img {
      width: 175px;
    }
  }
  .button-1 {
    background: #011d7c !important;
    color: #fff !important;
    border: #011d7c !important;
    padding: 5px 106px;
    font-size: 12px;
  }
}
</style>
