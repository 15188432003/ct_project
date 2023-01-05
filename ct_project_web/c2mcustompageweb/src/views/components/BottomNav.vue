<template>
  <div class="footer color-2D2D2D">
    <a-row>
      <!-- 名称 -->
      <a-col :span="10">
        <div
          class="Poppins-Bold padding-left-20 font-size-20 ellipsis-20 margin-top-10"
          :title="
            model.source === 1
              ? configuration.variantName
              : preViewData.attribute.comName
          "
        >
          {{
            model.source === 1
              ? configuration.variantName
              : preViewData.attribute.comName
          }}
        </div>
      </a-col>
      <!-- 规格 -->
      <!-- 数量 -->
      <a-col :span="currencyList.length > 0 ? 4 : 8">
        <div
          v-if="model.source === 1"
          class="flex justify-center align-center margin-top-10"
        >
          <div class="margin-right-20 font-size-14">Quantity</div>
          <div class="flex">
            <a-button icon="minus" class="border-radius-0" @click="decline" />
            <a-input-number
              class="text-center border-radius-0"
              v-model="configuration.number"
              :min="1"
              :precision="0"
              @change="changeNumber"
            />
            <a-button icon="plus" class="border-radius-0" @click="increase" />
          </div>
        </div>
      </a-col>

      <!-- 价钱 -->
      <a-col class="price" :span="currencyList.length > 0 ? 4 : 0">
        <div style="white-space: nowrap" class="margin-top-10">
          <div style="line-height: 0">
            <a-select
              v-if="model.source === 1"
              v-model="currency.code"
              @change="changeRate"
              dropdownClassName="select_number"
            >
              <a-select-option
                v-for="item in currencyList"
                :key="item.code"
                :value="item.code"
              >
                {{ item.code }}
              </a-select-option>
            </a-select>

            <div class="font-size-22 color-red inline-block exchangeRate-right">
              <span class="weight-bolder">
                {{ currency.symbol }}{{ price }}
              </span>
              <p class="color-2D2D2D">VAT & Duty included</p>
            </div>
          </div>
        </div>
      </a-col>
      <a-col :span="4" class="text-center">
        <div
          v-if="delivery_date"
          class="font-size-14 color-2D2D2D inline-block delivery margin-top-15"
        >
          {{ delivery_date }}
        </div>
      </a-col>
      <!-- 购买按钮 -->
      <a-col :span="2">
        <div class="margin-top-5 flex align-center justify-flex-end">
          <a-button
            v-if="model.source === 1"
            class="button-1"
            size="large"
            @click="buyGlasses"
          >
            BUY NOW
          </a-button>
        </div>
      </a-col>
    </a-row>
    <!-- 侧边侧罩层 -->
    <!-- <a-drawer
      placement="left"
      :maskClosable="true"
      width="410"
      :visible="visible"
      @close="onClose"
    >
      <div style="width: 100%; text-align: center">
        <img src="../../assets/img/logo.png" class="logo" />
      </div>
      <template v-for="item in catergories">
        <glasses-type
          :node="item"
          :key="item.id"
          @configurationId="configurationId"
        ></glasses-type>
      </template>
    </a-drawer> -->
  </div>
</template>

<script>
import Bus from "@/utils/bus";
import { purchase } from "../../api/forPM";
import { mapState, mapMutations } from "vuex";
import { exchangeRateList, countryList } from "../../api/third";
import { BigNumber } from "bignumber.js";

import { changeDecimal } from "../../utils/utils";
const key = "updatable";
export default {
  props: {
    detailList: {
      type: Object,
      default: () => {},
    },
    sampleList: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      taxloading: false,
      rate: {
        value: 1,
        code: "USD",
      },
      number: 1,
      money: 0,
      visible: false,
      productName: "",
      symbol: "$",
      sample: {},
      countryList: null,
      exchangeRateList: null,
      countriesList: [],
      tax: {
        vat: -1,
        duty: -1,
        code: undefined,
      },
    };
  },
  computed: {
    price: function () {
      if (this.model.source === 1) {
        let price = BigNumber(0);
        // 计算加购价格
        if (this.configuration.related_variants) {
          this.configuration.related_variants.forEach((item) => {
            if (
              typeof item.price[this.currency.code] === "undefined" ||
              item.price[this.currency.code] == null
            ) {
              price = price.plus(0);
            } else {
              price = price.plus(
                BigNumber(item.price[this.currency.code]).multipliedBy(
                  item.number
                )
              );
            }
          });
        }

        if (
          typeof this.options.price[this.currency.code] === "undefined" &&
          price.toNumber() == 0
        ) {
          return "-";
        }

        return changeDecimal(
          BigNumber(this.options.price[this.currency.code])
            .multipliedBy(this.configuration.number)
            .plus(price.toNumber())
            .toNumber(),
          2
        );
      } else {
        let price = this.preViewData.attribute.comPrice >> 0;
        let _index = 0;
        this.preViewData.lists.forEach((preViewDataItem) => {
          preViewDataItem.termlists.forEach((termlistsItem) => {
            price +=
              termlistsItem.vallists[this.preViewData.userOptions[_index]]
                .price >> 0;
            _index++;
          });
        });
        return price;
      }
    },
    ...mapState("lens", [
      "moneys",
      "color",
      "lens",
      "configuration",
      "bottom",
      "additionalList",
      "lensesList",
      "lensList",
      "configuration",
      "catergories",
      "preViewData",
      "model",
      "options",
      "currencyList",
      "currency",
      "delivery_date",
      "engravingIndex",
      "caseIndex",
      "isInscribe",
    ]),
  },
  mounted() {
    this.exchangeRateList = exchangeRateList;
    this.countryList = countryList;
    if (this.sampleList.price !== undefined) {
      this.sample = this.sampleList;
      this.money = this.sampleList.price;
      this.productName = this.sampleList.sampleName;
      this.sample.price = this.sample.price === null ? 0 : this.sample.price;
      this.sample.price = parseFloat(this.sample.price).toFixed(2);
    }
  },
  watch: {
    detailList(val) {
      this.productName = val.productName;
      Bus.$emit("money", this.number);
    },
    sampleList(val) {
      this.sample = val;
      this.money = val.price;
      this.productName = val.sampleName;
      this.sample.price = this.sample.price === null ? 0 : this.sample.price;
      this.sample.price = parseFloat(this.sample.price).toFixed(2);
    },
    moneys(val, old) {
      this.sample.price = this.sample.price - old + val;
      this.sample.price = this.sample.price.toFixed(2);
    },
  },
  methods: {
    ...mapMutations("lens", [
      "setParameterList",
      "setMoneys",
      "setInfoIcon",
      "setParameterName",
      "setBottom",
      "setLensJson",
      "setConfiguration",
      "setCurrency",
    ]),
    changeRate(code) {
      let currency = this.currencyList.find((item) => {
        return item.code === code;
      });
      this.setCurrency(Object.assign({}, currency));
    },
    // 减数字
    decline() {
      if (this.configuration.number > 1) {
        let configuration = JSON.parse(JSON.stringify(this.configuration));
        configuration.number--;
        this.setConfiguration(configuration);
      }
    },
    // 加数字
    increase() {
      let configuration = JSON.parse(JSON.stringify(this.configuration));
      configuration.number++;
      this.setConfiguration(configuration);
    },
    // 数字输入框
    changeNumber(e) {
      let number = 0;
      if (e === "" || e === null) {
        number = 1;
      } else if (e > 0) {
        number = e;
      } else {
        number = 1;
      }
      let configuration = JSON.parse(JSON.stringify(this.configuration));
      configuration.number = number;
      this.setConfiguration(configuration);
    },
    // 购买
    async buyGlasses() {
      let arrList = [];
      if (this.isInscribe.length && this.isInscribe.length > 0) {
        this.isInscribe.forEach((item) => {
          console.log(item);
          if (item.isChoose.toLowerCase() == "yes" && !item.text) {
            arrList.push(item.indexName);
          }
        });
      }

      if (arrList.length == 0) {
        this.$message.loading({ content: "Loading...", key });

        let ecp_vid_shopify = "";
        this.configuration.variants.forEach((item) => {
          if (
            JSON.stringify(item.options) ===
            JSON.stringify(this.options.options)
          ) {
            ecp_vid_shopify = item.ecp_vid.shopify;
          }
        });
        // 提取刻字自定义属性
        let attributes = [];
        this.isInscribe.forEach((item) => {
          if (item.isChoose.toLowerCase() == "yes") {
            attributes.push({
              key: item.name,
              value: item.text,
            });
          }
        });
        let parameter = [];
        if (attributes.length > 0) {
          parameter.push({
            vid: ecp_vid_shopify,
            quantity: this.configuration.number,
            attributes: attributes,
          });
        } else {
          parameter.push({
            vid: ecp_vid_shopify,
            quantity: this.configuration.number,
          });
        }

        if (this.configuration.related_variants) {
          this.configuration.related_variants.forEach((item) => {
            if (item.number > 0) {
              parameter.push({
                vid: item.ecp_vid.shopify,
                quantity: item.number,
              });
            }
          });
        }

        const res = await purchase(parameter);
        if (res.code === 0) {
          this.$message.error({ content: "Loaded!", key });
          if (
            res.data.checkout_url === "" ||
            res.data.checkout_url === undefined ||
            res.data.checkout_url === null
          ) {
            this.$message.error({ content: "error!", key, duration: 1 });
          } else {
            this.$message.success({ content: "Success!", key, duration: 1 });
            window.location.href = res.data.checkout_url;
          }
        } else {
          this.$message.error(res.Message);
        }
      } else if (arrList.length == 2) {
        Bus.$emit("changePage", this.engravingIndex, 2);
      } else {
        if (arrList[0] === "engravingIndex") {
          Bus.$emit("changePage", this.engravingIndex, 0);
        } else {
          Bus.$emit("changePage", this.caseIndex, 1);
        }
      }
    },
  },
  // 打开侧边遮罩层
  showDrawer() {
    this.visible = true;
  },
  // 关闭侧边遮罩层
  onClose() {
    this.visible = false;
  },
  // },
};
</script>

<style lang="less">
.select_number .ant-select-dropdown-menu-item {
  font-size: 14px !important;
}
</style>

<style lang="less" scoped>
.logo {
  width: 146px;
  height: 29px;
  margin-top: 29px;
  margin-bottom: 25px;
}

.delivery {
  vertical-align: top;
  line-height: 1;
  font-size: 14px;
}

/deep/.ant-btn-lg {
  font-size: 1vw;
  height: 2.2vw;
}

.price {
  position: relative;
  .exchangeRate-right {
    min-width: 200px;
    padding-left: 20px;
    top: -8px;
    position: relative;
    .lable {
      padding-right: 0;
    }
    .value {
      min-width: 35px;
      display: inline-block;
    }
    & > p {
      font-size: 14px;
      position: absolute;
      top: 24px;
    }
  }

  .exchangeRate-left {
    width: 66px;
    display: inline-block;
  }
  /deep/.ant-select-selection__rendered {
    line-height: 32px;
    height: 32px;
    font-size: 14px;
  }
  /deep/.ant-select-selection {
    border-radius: 0;
  }
  /deep/.ant-select,
  /deep/.ant-select > div {
    height: 32px !important;
    width: 110px !important;
  }
}

.tax {
  .exchangeRate-left {
    vertical-align: super;
  }
  .ant-select {
    vertical-align: super;
  }
  .exchangeRate-right {
    & > div {
      height: 15px;
    }
  }
  .lable {
    width: 113px;
    display: inline-block;
  }
  // .lable,.value{
  //   height:15px;
  //   display: inline-block;
  // }
}

.footer {
  background-color: #fffeff;
  height: 80px;
  padding: 15px 10px;
}
.button-1 {
  background: #011d7c !important;
  color: #fff !important;
  border: #011d7c !important;
  padding: 5px 20px;
}
.Glasses-type {
  color: #001d7c;
  text-decoration: underline;
  font-size: 16px;
}
.Glasses-type:hover {
  color: #001d7c;
  text-decoration: underline;
}
.ant-drawer-body {
  text-align: center;
}
.ant-badge {
  margin-top: 5px;
}
.ant-radio-group-solid
  .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled) {
  background: #041d7d !important;
  border-color: #041d7d !important;
}
.ant-radio-button-wrapper:first-child {
  border-radius: 20px 0 0 20px !important;
}
.ant-radio-button-wrapper:last-child {
  border-radius: 0 20px 20px 0 !important;
}

/deep/.ant-btn-icon-only {
  height: 1.66667vw;
  width: 1.66667vw;
  font-size: 1vw;
}

/deep/.ant-input-number {
  width: 6vw;
  height: 1.66667vw;
}

/deep/.ant-input-number-handler-wrap {
  display: none !important;
}
/deep/.ant-input-number-input {
  text-align: center;
  height: 30px;
  font-size: 14px;
}
/deep/.ant-input-number {
  border-right: 0;
  border-left: 0;
}
/deep/.ant-input-number:hover {
  border-top: 1px solid #d9d9d9;
  border-bottom: 1px solid #d9d9d9;
}
/deep/.ant-input-number-focused {
  box-shadow: 0 0 0 0;
}
</style>
