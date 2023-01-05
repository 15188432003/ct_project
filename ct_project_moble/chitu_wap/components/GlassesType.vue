<template>
  <view>
    <view class="text-center">
      <u-collapse
        v-if="node.products && node.products.length > 0"
        :bordered="false"
        expand-icon-position="right"
      >
        <u-collapse-item :key="node.id" :title="this.title1" :open="activeKey">
          <view>
            <view
              :span="12"
              class="products_box"
              v-for="item1 in node.products"
              :key="item1.id"
              :class="{ checked: item1.id === checkID }"
              @click="imgclick(item1)"
            >
              <view>
                <image
                  class="products_image"
                  mode="widthFix"
                  :src="item1.productImage"
                ></image>
                <text class="name">{{ item1.name.en }}</text>
                <u-icon name="checkmark" color="#000" size="50"></u-icon>
              </view>
            </view>
          </view>
        </u-collapse-item>
      </u-collapse>
      <template v-if="node.children">
        <glasses-Type
          v-for="item2 in node.children"
          :node="item2"
          :title="title1"
          :key="item2.id"
        ></glasses-Type>
      </template>
    </view>
  </view>
</template>

<script>
import { mapMutations, mapState } from "vuex";
export default {
  name: "glassesType",
  props: ["node", "title"],
  data() {
    return {
      searchItem: {
        pageIndex: 1,
        pageSize: 10,
      },
      glassesList: [],
      glassesList2: [],
      activeKey: true,
      empty: {
        image: "../../assets/img/empty.png",
        name: "coming soon~",
      },
      num: 0,
    };
  },
  beforeMount() {
    this.activeKey = true;
  },
  computed: {
    ...mapState({
      configuration: (state) => state.model.configuration,
      checkID: (state) => state.model.checkID,
    }),
    title1: function () {
      return (this.title ? this.title + "-" : "") + this.node.name.en;
    },
  },
  mounted() {
    //this.title1 = this.title + "-" + this.node.name.en;
    // this.node.forEach((item, index) => {
    //   this.activeKey[index] = [];
    //   this.activeKey[index].push(item.name.en);
    // });
  },
  methods: {
    ...mapMutations("model", ["setCheckID"]),
    imgclick(val) {
      this.setCheckID(val.id);
      //console.log("val", val);
      // if (val.id !== undefined) {
      //   const router = this.$route.query.basicstyleid;
      //   if (router !== val.id) {
      //     this.$router.push({ path: `/`, query: { basicstyleid: val.id } });
      //   }
      // }
    },
  },
};
</script>
<style lang="scss" scoped>
.products_image {
  width: 80rpx;
  margin-left: 10rpx;
  margin-right: 10rpx;
}

.name {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  max-width: 400rpx;
}
.products_box {
  height: 100rpx;
  display: flex;
  align-items: center;
  border: 1px solid #333;
  border-radius: 10rpx;
  position: relative;
  word-wrap: break-word;
  background: #fff;
  & + .products_box {
    margin-top: 30rpx;
  }
  .u-icon {
    display: none;
    position: absolute;
    right: 30rpx;
  }
  &.checked {
    .u-icon {
      display: block;
    }
  }
  uni-view {
    display: flex;
    align-items: center;
  }
}
</style>
