<template>
  <u-popup
    v-model="dialogVisible"
    mode="center"
    width="655"
    height="1157"
    border-radius="8"
    closeable
  >
    <view class="container">
      <!-- LOGO -->
      <view class="u-flex u-row-center">
        <image class="logo" src="./../static/glass-logo.png" mode=""></image>
      </view>

      <view class="content">
        <scroll-view scroll-y="true" style="height: 882rpx">
          <u-collapse ref="collapseRef" :item-style="collapseStyle">
            <u-collapse-item
              :title="item.name"
              v-for="item in categoriesList"
              :open="item.open"
              :key="item.id"
              @change="(e) => handleCollapseChange(e, item.id)"
            >
              <view class="list-wrap">
                <view
                  class="list-item"
                  v-for="(item, index) in basicstylesList"
                  :key="index"
                  @click="() => handleSelected(item)"
                >
                  <image :src="item.image" mode="" class="cover"></image>
                  <text class="text-name">{{ item.name }}</text>
                </view>

              </view>
            </u-collapse-item>
          </u-collapse>
        </scroll-view>
      </view>
    </view>
  </u-popup>
</template>

<script>
import { mapMutations } from "vuex";
import { getBasicstylesList, getBasicstylesCategories } from "@/api/common.js";
export default {
  props: {
    value: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      collapseStyle: {
        fontSize: "28px",
        fontWeight: "bold",
        color: "#333",
      },
      isShowSubsection: false,
      params: {
        pageIndex: 1,
        pageSize: 10,
      },
      curNow: "",
      basicstylesList: [],
      list: [
        {
          name: "Sunglasses",
        },
        {
          name: "Eyeglasses",
        },
      ],
      categoriesList: [],
    };
  },
  computed: {
    dialogVisible: {
      get() {
        return this.value;
      },
      set(newVal) {
        this.$emit("input", newVal);
        if (newVal) {
          this.fetchsBasicstylesCategories();
        }
        setTimeout(() => {
          this.isShowSubsection = newVal;
        }, 500);
      },
    },
  },
  methods: {
    ...mapMutations("model", ["SET_DOT_TRUE", "SET_DOT_STATUS"]),
    handleCollapseChange({ show }, id) {
      // console.log(id)
      if (show) {
        this.fetchBasicstylesList(id);
      }
    },
    handleSelected(row) {
      this.SET_DOT_TRUE(true);
      this.SET_DOT_STATUS(false);
      this.dialogVisible = false;
      sessionStorage.setItem("configurationId", row.id);
      this.$emit("initModal", row.id);
    },
    // 获取基本款分类列表
    async fetchsBasicstylesCategories() {
      try {
        const res = await getBasicstylesCategories();
        if (res.length) {
          res[0].open = true;
          this.fetchBasicstylesList(res[0].id);
        }
        this.categoriesList = res;
      } catch (e) {
        //TODO handle the exception
        console.log(e);
      }
    },
    // 获取某个类型下的眼镜信息
    async fetchBasicstylesList(id) {
      try {
        const params = { ...this.params };
        params.categoryId = id;
        const res = await getBasicstylesList(params);
        this.basicstylesList = res.rows;

        this.$nextTick(() => {
          this.$refs.collapseRef.init();
          console.log("重新计算");
        });
      } catch (e) {
        //TODO handle the exception
        console.log(e);
      }
    },
    sectionChange() {},
  },
};
</script>

<style scoped lang="scss">
* {
  font-family: PoppinsRegular;
}

.container {
  padding: 36rpx 55rpx 74rpx 55rpx;

  /deep/ .u-subsection {
    background: #f2f2f2;
    border-radius: 30rpx !important;
  }

  /deep/ .u-item {
    border-radius: 30rpx;
    border: none;
    border-color: #f2f2f2 !important;
    border-width: 0;
  }

  /deep/ .u-item-bg {
    border-radius: 30rpx !important;
  }

  .logo {
    width: 286rpx;
    height: 56rpx;
    text-align: center;
    margin-bottom: 47rpx;
  }

  .content {
    margin-top: 47rpx;
  }

  .list-wrap {
    display: flex;
    flex-wrap: wrap;
    margin: 0 -12.5rpx;

    .list-item {
      position: relative;
      flex: 0 0 calc(50% - 25rpx);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 260rpx;
      // background-color: #F6F6F6;
      // border: 1rpx solid #CECECE;
      margin: 0 12.5rpx 25rpx 12.5rpx;

      .text-name {
        position: absolute;
        bottom: 15rpx;
        left: 0;
        right: 0;

        color: #333;
        font-size: 28rpx;
        text-align: center;
      }

      .text-commingsoon {
        font-size: 24rpx;
        opacity: 0.7;
        color: #a4acba;
      }

      .cover {
        flex: 1;
        width: 100%;
      }
    }
  }
}
</style>
