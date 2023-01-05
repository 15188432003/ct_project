<template>
  <div class="glasses_custom">
    <span class="font-size-16">{{ data.name.en }}</span>
    <ul>
      <template
        v-for="(item, index) in model.source == 1 ? values : data.vallists"
      >
        <li
          class="flex space-between"
          :key="index"
          @click="indexChange(index)"
          :class="{ active: index == page }"
        >
          <p>{{ item.text.en }}</p>
          <div>
            <span v-if="item.price && item.price[currency.code]">
              + {{ currency.symbol
              }}{{ changeDecimal(item.price[currency.code]) }}</span
            >
            <a-icon v-show="index == page" type="check" class="check" />
          </div>
        </li>
      </template>
    </ul>
    <div class="write" v-show="page == 1">
      <p>Write your engraving</p>
      <div class="write_to" :class="{ written_warning: showInfo }">
        <input
          :placeholder="showInfo ? 'Please input the engraving text.' : ''"
          v-model="writeText"
          @blur="focusChange"
          type="text"
        />
        <a-icon class="warning" type="exclamation-circle" />
        <span v-if="carving">{{ writeText.length }}/12</span>
        <span v-else>{{ writeText.length }}/11</span>
      </div>
      <p class="info">
        <a-icon type="edit" />
        You can only enter numbers, letters, special characters or spaces in the
        middle
      </p>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState } from "vuex";
import { changeDecimal, calculate_delivery_time } from "../../utils/utils";
import Bus from "@/utils/bus";
export default {
  name: "GlassesCustom",
  data() {
    return {
      page: 0,
      writeText: "",
      time: null,
      showInfo: false,
      values: null,
      carvingIndex: 0,
      carving: true,
    };
  },
  props: {
    name: String,
    pages: Number,
    data: Object,
  },
  created() {
    if (this.data.name.en == "Lenses Engraving") {
      this.carving = true;
    } else {
      this.carving = false;
    }

    const carvingIndex = this.isInscribe.findIndex((item) => {
      return item.name == this.data.name.en;
    });
    this.carvingIndex = carvingIndex;
  },
  computed: {
    ...mapState("lens", [
      "engravingIndex",
      "caseIndex",
      "currency",
      "options",
      "model",
      "configuration",
      "isInscribe",
    ]),
  },
  methods: {
    ...mapMutations("lens", [
      "setOptions",
      "setDelivery_date",
      "setIsInscribe",
    ]),
    indexChange(index) {
      if (this.time) {
        clearTimeout(this.time);
      }
      if (index == 0) {
        this.showInfo = false;
        const newIsInscribe = this.isInscribe;
        newIsInscribe[this.carvingIndex].isChoose = "No";
        newIsInscribe[this.carvingIndex].text = "";
        if (this.carving) {
          Bus.$emit("textChange", "");
        } else {
          Bus.$emit("changMirrorBoxShow", false);
          Bus.$emit("changMirrorBox", "");
        }
        this.setIsInscribe(newIsInscribe);
        //刻字内容清除
        this.writeText = "";
      } else {
        if (!this.carving) {
          Bus.$emit("changMirrorBoxShow", true);
        }
        const newIsInscribe = this.isInscribe;
        newIsInscribe[this.carvingIndex].isChoose = "Yes";
        newIsInscribe[this.carvingIndex].text = "";
        this.setIsInscribe(newIsInscribe);
      }
      if (this.model.source === 1) {
        let options = JSON.parse(JSON.stringify(this.options));
        options.options[this.pages] = index;
        this.setOptions(options);
        Bus.$emit("optionButton", options);
        //计算交期
        const delivery_date = calculate_delivery_time(
          this.configuration,
          options.options
        );
        this.setDelivery_date(delivery_date);
      }
      this.page = index;
    },
    changeDecimal(number, bitNum) {
      return changeDecimal(number, bitNum);
    },
    ltrim(s) {
      return s.replace(/(^\s*)/g, "");
    },
    focusChange() {
      this.writeText = this.writeText.trim();
    },
  },
  watch: {
    data: {
      immediate: true,
      handler(val) {
        if (val) {
          this.values = val.values;
        }
      },
    },
    writeText(newVal, oldVal) {
      let regText;
      if (this.carving) {
        regText =
          /^[A-Za-z0-9`~!@#$%^&*()_\-+=<>?:"|./;'\\·~@#￥%……&*[\]——\-+=|《》\s{}？：“”、；‘'，。、]{0,12}$/g;
      } else {
        regText =
          /^[A-Za-z0-9`~!@#$%^&*()_\-+=<>?:"|./;'\\·~@#￥%……&*[\]——\-+=|《》\s{}？：“”、；‘'，。、]{0,11}$/g;
      }
      let textTest = regText.test(newVal);
      if (!textTest) {
        this.writeText = oldVal;
      } else {
        //判断未填写警告
        if (this.showInfo) {
          if (newVal) {
            this.showInfo = false;
          }
        }
        if (this.time) {
          clearTimeout(this.time);
        }
        this.time = setTimeout(() => {
          if (this.page == 1) {
            this.writeText = this.ltrim(newVal);
            const text = newVal.trim();
            if (text !== this.isInscribe[this.carvingIndex].text) {
              const newIsInscribe = this.isInscribe;
              newIsInscribe[this.carvingIndex].isChoose = "Yes";
              newIsInscribe[this.carvingIndex].text = text;
              if (this.carving && this.page == 1) {
                Bus.$emit("textChange", text);
              } else if (!this.carving && this.page == 1) {
                Bus.$emit("changMirrorBox", text);
              }
              this.setIsInscribe(newIsInscribe);
            }
          }
        }, 500);
      }
    },
  },
  mounted() {
    Bus.$on("showInfo", (type) => {
      if (type == 2) {
        this.showInfo = true;
      } else {
        if (type == 0 && this.carving) {
          this.showInfo = true;
        } else if (type == 1 && !this.carving) {
          this.showInfo = true;
        }
      }
    });
  },
  beforeDestroy() {
    Bus.$off("showInfo");
  },
};
</script>

<style lang="less" scoped>
.glasses_custom {
  height: 100%;
  width: 100%;
  overflow: hidden auto;
  ul {
    li {
      width: 100%;
      height: 50px;
      line-height: 50px;
      border: 1px solid #e2e4e8;
      border-radius: 3px;
      font-size: 16px;
      margin: 0.52083vw 0;
      cursor: pointer;
      position: relative;
      padding: 2px 2px 2px 20px;
      span {
        position: absolute;
        right: 20px;
      }
      .check {
        margin-right: 20px;
      }
    }
  }
  .write {
    font-size: 16px;
    .write_to {
      width: 100%;
      height: 50px;
      line-height: 50px;
      border-radius: 3px;
      position: relative;
      input {
        height: 100%;
        width: 100%;
        outline: none;
        border: none;
        padding: 2px 2px 2px 20px;
        border: 1px solid #e2e4e8;
      }
      span {
        position: absolute;
        color: rgb(170, 170, 170);
        right: 10px;
        top: 50%;
        font-size: 14px;
        font-weight: 400;
        transform: translateY(-50%);
      }

      .warning {
        position: absolute;
        left: 8px;
        top: 50%;
        transform: translateY(-50%);
        color: red;
        display: none;
      }
    }
    .written_warning {
      input {
        padding: 2px 2px 2px 32px;
        border-color: red;
      }
      .warning {
        display: block;
      }
    }
    .info {
      margin-top: 5px;
      font-size: 14px;
      // color: #9c9c9c;
    }
  }
}
.active {
  border-color: #000 !important;
  span {
    right: 45px !important;
  }
}
</style>
