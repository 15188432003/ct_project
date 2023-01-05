<template>
  <div>
    <!-- 右侧关闭按钮 -->
    <!-- color和lenses的选配值 -->
    <div class="details_box scrollbar">
      <div class="margin-left-10">
        <div class="margin-bottom-48" style="width: 100%">
          <div title="FRAMES" class="Poppins-Bold font-size-16 color-333333">
            FRAMES
          </div>
          <div>
            <div
              class="font-size-16 color-666666 name"
              :title="configuration.name.en"
            >
              {{ configuration.name.en }}
            </div>
          </div>
        </div>

        <div
          v-for="(item, index) in imageList"
          class="margin-bottom-48"
          style="width: 100%"
          :key="index"
        >
          <div
            v-show="item.values[options.options[index]]"
            class="Poppins-Bold font-size-16 color-333333"
          >
            <span
              :class="{
                detail_name: true,
                detail_name_long: !(
                  item.values[options.options[index]] &&
                  item.values[options.options[index]].price &&
                  item.values[options.options[index]].price[currency.code]
                ),
              }"
              :title="item.name.en"
              >{{ item.name.en }}</span
            >

            <span
              v-if="
                item.values[options.options[item.group_index]] &&
                item.values[options.options[item.group_index]].price &&
                item.values[options.options[item.group_index]].price[
                  currency.code
                ]
              "
              :title="`+${currency.symbol}${changeDecimal(
                item.values[options.options[item.group_index]].price[
                  currency.code
                ]
              )}`"
              class="price right clearfix"
              >+
              {{ currency.symbol }}
              {{
                changeDecimal(
                  item.values[options.options[index]].price[currency.code]
                )
              }}
            </span>
          </div>
          <div>
            <div
              class="font-size-16 color-666666 name"
              :title="
                item.values[options.options[index]] &&
                item.values[options.options[index]].name
                  ? item.values[options.options[index]].name.en
                  : ''
              "
            >
              {{
                item.values[options.options[index]] &&
                item.values[options.options[index]].name
                  ? item.values[options.options[index]].name.en
                  : ""
              }}
            </div>
          </div>
        </div>

        <template v-if="textList">
          <div
            class="margin-bottom-48"
            v-for="(item, index) in textList"
            :key="item.group_index"
          >
            <div
              class="Poppins-Bold font-size-16 color-333333"
              :title="item.name.en"
            >
              <span>{{ item.name.en }}</span
              ><span
                v-if="
                  item.values[options.options[item.group_index]] &&
                  item.values[options.options[item.group_index]].price &&
                  item.values[options.options[item.group_index]].price[
                    currency.code
                  ]
                "
                :title="`+${currency.symbol}${changeDecimal(
                  item.values[options.options[item.group_index]].price[
                    currency.code
                  ]
                )}`"
                class="price right clearfix"
                >+
                {{ currency.symbol }}
                {{
                  changeDecimal(
                    item.values[options.options[item.group_index]].price[
                      currency.code
                    ]
                  )
                }}</span
              >
            </div>
            <div class="font-size-16 color-666666 name">
              {{ isInscribe[index].name }}: {{ isInscribe[index].isChoose }}
            </div>
            <div
              v-show="isInscribe[index].isChoose.toLowerCase() == 'yes'"
              class="font-size-16 color-666666 name"
              :title="isInscribe[index].text"
            >
              Your Engraving: {{ isInscribe[index].text }}
            </div>
          </div>
        </template>

        <div v-for="item in lensList.parameterTagList" :key="item.tagId">
          <div v-for="item2 in item.parameterList" :key="item2.parameterId">
            <div
              class="button flex align-center space-between"
              v-if="item2.parameterId === parameter"
            >
              <div style="width: 100%">
                <div class="font-size-16 color-333333">Lenses</div>
                <div>
                  <div class="font-size-16 color-666666">
                    {{ item2.parameterName }}
                  </div>
                </div>
              </div>
            </div>
            <div
              class="button flex align-center space-between"
              v-if="linkageModuleLength === 0"
            >
              <div style="width: 100%" v-if="item2.isDefault">
                <div class="font-size-16 color-333333">Lenses</div>
                <div>
                  <div class="font-size-16 color-666666">
                    {{ item.tagName }}
                    {{ item.tagName === null ? "" : "/" }}
                    {{ lensName === "" ? item2.parameterName : lensName }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 分割线 -->
    <a-divider style="margin: 20px 0" v-if="false" />
    <div class="margin-top-37" v-if="false">
      <!-- 加购的数量以及信息显示 -->
      <div class="title-Additional margin-bottom-27">You may also need</div>
      <div class="lens-list">
        <div v-for="item in additionalList" :key="item.productId">
          <div class="flex space-between margin-tb-25">
            <!-- 背景图片 -->
            <div class="Lens"></div>
            <div class="font-size-14 weight-norma color-666666l">
              <!-- 商品名称 -->
              <div
                class="ellipsis font-size-16 LensesName"
                :title="item.productName"
                style="width: 200px"
              >
                {{ item.productName }}
              </div>
              <div>
                <!-- 价格 -->
                <span
                  v-if="
                    item.price &&
                    typeof item.price[`${currency.code}`] !== 'undefined' &&
                    item.price[`${currency.code}`] !== null
                  "
                  class="color-red font-size-18"
                  >{{ currency.symbol
                  }}{{
                    typeof item.price[currency.code] === "undefined"
                      ? "-"
                      : item.price[currency.code]
                  }}</span
                >
                <!-- 单位 -->
                <span
                  class="color-grey font-size-14 weight-normal margin-left-5"
                >
                  /{{ item.unit }}
                </span>
              </div>
            </div>
            <!-- 数量 -->
            <div>
              <div class="font-size-18 color-666666">x{{ item.number }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="hint">
      <div
        data-v-9a0ace72=""
        style="
          width: 100%;
          display: inline-block;
          height: 1px;
          background: #e2e4e8;
          width: 100%;
        "
      ></div>
      <div class="hint_text">
        Above is your custom information. Please note that customized products
        are not eligible for return or exchange. Please make sure that
        everything is correct.
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { changeDecimal } from "../../utils/utils";
export default {
  props: {
    additionalLens: {
      type: Array,
      default: () => [],
    },
    lensName: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      number: 1,
      additionalList: [],
      Id: "404740ed8dea4cb5b17c03cce00332ad",
      lensList: {},
      image: "",
      linkageModuleLength: 0,
      imageList: null,
      textList: null,
    };
  },
  computed: {
    ...mapState("lens", [
      "lens",
      "color",
      "pageNumber",
      "parameter",
      "detailsImg",
      "bottom",
      "configuration",
      "options",
      "currency",
      "isInscribe",
      "model",
      "engravingIndex",
      "caseIndex",
    ]),
  },
  watch: {
    additionalLens(val) {
      this.additionalList = val;
      this.$nextTick(() => {
        // 获取眼镜片展示图位置
        const Lens = document.getElementsByClassName("Lens");
        // 添加图片
        this.additionalList.forEach((item, index) => {
          Lens[index].style.backgroundImage = `url('${item.productImage}')`;
          Lens[index].style.backgroundSize = `contain`;
          Lens[index].style.backgroundRepeat = `no-repeat`;
        });
      });
    },
    detailsImg(val) {
      this.image = val.image;
    },
    configuration: {
      immediate: true,
      deep: true,
      handler(val) {
        if (this.engravingIndex) {
          this.imageList = val.options.slice(0, this.engravingIndex);
          this.textList = val.options.slice(
            this.engravingIndex,
            val.options.length
          );
        } else if (this.caseIndex) {
          this.imageList = val.options.slice(0, this.caseIndex);
          this.textList = val.options.slice(this.caseIndex, val.options.length);
        } else {
          this.imageList = val.options;
        }
      },
    },
  },
  mounted() {
    // console.log(this.bottom.image);
    this.image = this.bottom.image;
    // 获取产品基本款配置详情
    // const route = this.$route.query.basicstyleid;
    // if (route === null || route === undefined || route === "") {
    //this.init();
    // } else {
    //   this.init(route);
    // }
    // 根据vuex中的lens值进行渲染
    this.additionalList = this.lens;
    this.$nextTick(() => {
      const Lens = document.getElementsByClassName("Lens");
      this.additionalList.forEach((item, index) => {
        Lens[index].style.backgroundImage = `url('${item.productImage}')`;
        Lens[index].style.backgroundSize = `contain`;
        Lens[index].style.backgroundRepeat = `no-repeat`;
      });
    });
    // 渲染color的背景颜色图片
    // for (let i = 0; i < this.color.parameterTagList.length; i++) {
    //   const element = this.color.parameterTagList[i];
    //   if (element.tagId === null) {
    //     element.parameterList.forEach((item) => {
    //       if (item.isDefault === true) {
    //         const color = document.getElementsByClassName("colorRgb")[0];
    //         // console.log(item);
    //         color.innerHTML = item.parameterName;
    //       }
    //     });
    //   }
    // }
    if (window.innerWidth < 1200) {
      this.$nextTick(() => {
        const LensesName = document.getElementsByClassName("LensesName");
        for (let i = 0; i < LensesName.length; i++) {
          LensesName[i].style.width = "84px";
        }
      });
    } else if (window.innerWidth < 1300) {
      this.$nextTick(() => {
        const LensesName = document.getElementsByClassName("LensesName");
        for (let i = 0; i < LensesName.length; i++) {
          LensesName[i].style.width = "104px";
        }
      });
    } else if (window.innerWidth < 1400) {
      this.$nextTick(() => {
        const LensesName = document.getElementsByClassName("LensesName");
        for (let i = 0; i < LensesName.length; i++) {
          LensesName[i].style.width = "124px";
        }
      });
    } else if (window.innerWidth < 1600) {
      this.$nextTick(() => {
        const LensesName = document.getElementsByClassName("LensesName");
        for (let i = 0; i < LensesName.length; i++) {
          LensesName[i].style.width = "154px";
        }
      });
    } else if (window.innerWidth < 1800) {
      this.$nextTick(() => {
        const LensesName = document.getElementsByClassName("LensesName");
        for (let i = 0; i < LensesName.length; i++) {
          LensesName[i].style.width = "174px";
        }
      });
    } else if (window.innerWidth < 1900) {
      this.$nextTick(() => {
        const LensesName = document.getElementsByClassName("LensesName");
        for (let i = 0; i < LensesName.length; i++) {
          LensesName[i].style.width = "200px";
        }
      });
    }
    window.addEventListener(
      "resize",
      () => {
        if (window.innerWidth < 1200) {
          this.$nextTick(() => {
            const LensesName = document.getElementsByClassName("LensesName");
            for (let i = 0; i < LensesName.length; i++) {
              LensesName[i].style.width = "84px";
            }
          });
        } else if (window.innerWidth < 1300) {
          this.$nextTick(() => {
            const LensesName = document.getElementsByClassName("LensesName");
            for (let i = 0; i < LensesName.length; i++) {
              LensesName[i].style.width = "104px";
            }
          });
        } else if (window.innerWidth < 1400) {
          this.$nextTick(() => {
            const LensesName = document.getElementsByClassName("LensesName");
            for (let i = 0; i < LensesName.length; i++) {
              LensesName[i].style.width = "124px";
            }
          });
        } else if (window.innerWidth < 1600) {
          this.$nextTick(() => {
            const LensesName = document.getElementsByClassName("LensesName");
            for (let i = 0; i < LensesName.length; i++) {
              LensesName[i].style.width = "154px";
            }
          });
        } else if (window.innerWidth < 1800) {
          this.$nextTick(() => {
            const LensesName = document.getElementsByClassName("LensesName");
            for (let i = 0; i < LensesName.length; i++) {
              LensesName[i].style.width = "174px";
            }
          });
        } else if (window.innerWidth < 1900) {
          this.$nextTick(() => {
            const LensesName = document.getElementsByClassName("LensesName");
            for (let i = 0; i < LensesName.length; i++) {
              LensesName[i].style.width = "200px";
            }
          });
        }
      },
      false
    );
  },
  methods: {
    ...mapMutations("lens", ["setInfoIcon"]),
    changeDecimal(number, bitNum) {
      return changeDecimal(number, bitNum);
    },
    // 获取产品基本款配置详情
    // async init() {
    //   // console.log(this.configuration.moduleList[1]);
    //   this.lensList = this.configuration.moduleList[1];
    //   this.linkageModuleLength =
    //     this.configuration.moduleList[0].parameterTagList[0].parameterList[0].linkageModuleList.length;
    // },
    // 关闭按钮
    BackOff() {
      this.$emit("back-off", { isTrue: true, number: this.pageNumber });
      this.setInfoIcon(false);
    },
  },
};
</script>

<style scoped lang="less">
.details_box {
  // prettier-ignore
  height: calc(100% - 80PX);
  padding-top: 20px;
  padding-bottom: 10px;
  overflow-y: auto;
  .price {
    font-family: "Poppins-Regular";
    font-weight: normal;
    color: #df5641;
    max-width: 100px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: inline-block;
  }
  .detail_name {
    max-width: 90%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: inline-block;
  }
  .detail_name_long {
    max-width: 170px;
  }
}
.close {
  text-align: right;
}
.colorRgb {
  font-size: 16px;
  color: #666666;
}
.lensValue {
  width: 36px;
  height: 36px;
  /* background-color: ; */
  /* background: linear-gradient(to left bottom, #94d1da, #e7f4f6); */
  background-repeat: no-repeat;
  border-radius: 50%;
}
.title-Additional {
  font-size: 18px;
  color: #000000;
}
.name {
  margin-top: 10px;
}
.Lens {
  width: 60px;
  height: 60px;
  background: #f2f2f2;
  border-radius: 6px;
  background-repeat: no-repeat;
}
.input-number {
  width: 60px;
}
.lens-list {
  height: 230px;
}
.hint {
  width: auto;
  font-size: 12px;
  color: #c3c3c3;
  position: absolute;
  padding-right: 40px;
  bottom: 0;
  overflow-y: auto;
  background: #fff;
  // prettier-ignore
  // height: PX;
  .hint_text {
    padding: 10px 0;
  }
}
.image {
  width: 158px;
  height: 158px;
  // margin-right: 29px;
  border-radius: 6px;
  img {
    width: 100%;
  }
}
</style>
