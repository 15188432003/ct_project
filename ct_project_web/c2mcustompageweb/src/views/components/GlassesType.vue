<template>
  <div>
    <div class="text-left frames_tab">
      <uL v-if="node.products && node.products.length > 0">
        <div :title="title1">{{ title1 }}</div>
        <li
          class="button margin-tb-10"
          v-for="item1 in node.products"
          :key="item1.id"
          :class="{
            active: model.source === 1 && item1.id == configuration.id,
          }"
        >
          <div @click="imgclick(item1)">
            <img class="image" :src="item1.productImage" alt="" />
            <div :title="item1.name.en" class="name">{{ item1.name.en }}</div>
            <a-icon
              type="check"
              class="check"
              v-show="model.source === 1 && item1.id == configuration.id"
            />
          </div>
        </li>
      </uL>

      <template v-if="node.children">
        <glasses-Type
          v-for="item2 in node.children"
          :node="item2"
          :title="title1"
          :key="item2.id"
        ></glasses-Type>
      </template>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState } from "vuex";
import { name2Url } from "@/utils/utils.js";
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
      activeKey: [],
      empty: {
        image: "../../assets/img/empty.png",
        name: "coming soon~",
      },
      num: 0,
    };
  },
  beforeMount() {
    this.activeKey.push(this.node.id);
  },
  computed: {
    ...mapState("lens", ["configuration", "model", "glassList"]),
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
    ...mapMutations("lens", [
      "setInfoIcon",
      "setColor",
      "setParameterList",
      "setBottom",
      "setColorList",
      "setadditionalList",
      "setMoneys",
      "setCatergories",
    ]),
    imgclick(val) {
      if (val.id !== undefined) {
        const router = this.$route.query.basicstyleid;
        if (router !== val.id) {
          if (val.id === "404740ed8dea4cb5b17c03cce00332ad") {
            if (router !== undefined) {
              this.setColor({});
              this.setParameterList({});
              this.setBottom("");
              this.setColorList({});
              this.setInfoIcon(false);
              this.setadditionalList([]);
              this.setMoneys(0);
              this.$router.push({ path: `/` });
            }
          } else {
            this.setColor({});
            this.setParameterList({});
            this.setBottom("");
            this.setColorList({});
            this.setInfoIcon(false);
            this.setadditionalList([]);
            this.setMoneys(0);
            console.log("val", val);
            console.log("glassList", this.glassList);
            let product = this.glassList.find((item) => {
              return item.id == val.id;
            });
            console.log("product", product);
            this.$router.push({
              path: `/products/${name2Url(product.name.en)}`,
              query: { id: val.id },
            });
          }
        }
        // this.$emit("configurationId", val.id);
        // this.setInfoIcon(false);
      }
    },
  },
};
</script>
<style lang="less" scoped>
.button {
  width: 100%;
  border: 1px solid rgb(226, 228, 232);
  border-radius: 6px;
  display: flex;
  align-items: center;
  &.margin-tb-10 {
    margin: 10px 0;
  }
  & > div {
    position: relative;
    width: 100%;
    display: flex;
    align-items: center;
    &:hover {
      cursor: pointer;
    }
  }

  .image {
    width: 40px;
    height: auto;
    margin: 8px 12px;
  }
  &.active {
    border-color: #000;
  }
  .check {
    // margin-right: 20px;
    font-size: 18px;
    position: absolute;
    right: 20px;
  }
}

.logo {
  width: 146px;
  height: 29px;
  margin-top: 29px;
  margin-bottom: 25px;
}
.button-glasses {
  background-color: #f2f2f2;
  width: 220px;
  margin: 0 auto;
  border-radius: 20px;
  text-align: center;
  cursor: pointer;
  .Sun {
    padding: 8px 0;
    background: black;
    color: #fff;
    width: 120px;
    border-radius: 20px;
  }
  .Eye {
    padding: 8px 0;
    width: 110px;
    text-align: center;
  }
}
.img {
  width: 170px;
  height: 170px;
  margin: 0 auto;
  margin-bottom: 15px;
  background-image: url("../../assets/img/empty.png");
  background-repeat: no-repeat;
  background-size: cover;
  position: relative;
}

.img2 {
  width: 170px;
  height: 170px;
  margin: 0 auto;
  margin-bottom: 15px;
  background-image: url("../../assets/img/empty.png");
  background-repeat: no-repeat;
  background-size: cover;
  position: relative;
}
.name2 {
  width: 100%;
  color: #a4acba;
  font-size: 12px;
  position: absolute;
  bottom: 10%;
  left: 50%;
  transform: translate(-50%, -10%);
}
/deep/.ant-drawer-body {
  padding: 20px !important;
}
/deep/.ant-collapse-borderless > .ant-collapse-item {
  border-bottom: 0px;
}
/deep/.ant-collapse-borderless > .ant-collapse-item > .ant-collapse-content {
  background-color: #fff;
}
/deep/.ant-collapse-borderless {
  background-color: #fff;
}
/deep/.ant-collapse-icon-position-right
  > .ant-collapse-item
  > .ant-collapse-header {
  font-weight: bold;
  text-align: left;
}
/deep/.ant-collapse-content > .ant-collapse-content-box {
  padding: 0;
}
</style>
