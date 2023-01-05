<template>
  <div>
    <!-- 眼镜框展示图 -->
    <template v-if="data.type === 'image'">
      <span
        class="font-size-16"
        v-show="
          model.source === 1
            ? options.options[optionIndex.optionIndex] <
              configuration.options[optionIndex.optionIndex].values.length
            : preViewData.userOptions[optionIndex.optionIndex] <
              preViewData.lists[optionIndex.listsIndex].termlists[
                optionIndex.termlistsIndex
              ].vallists.length
        "
        >{{
          model.source === 1 ? data.name.en : data.name[preViewData.inpLanguage]
        }}
      </span>
      <div
        v-for="(item2, index2) in model.source === 1
          ? data.values
          : data.vallists"
        :key="index2"
      >
        <div
          v-show="
            model.source === 1
              ? optionSpec.length > 0 &&
                optionSpec[optionIndex.optionIndex] &&
                optionSpec[optionIndex.optionIndex].indexOf(index2) !== -1
              : preViewData.userOptions[optionIndex.optionIndex] <
                preViewData.lists[optionIndex.listsIndex].termlists[
                  optionIndex.termlistsIndex
                ].vallists.length
          "
          class="button flex align-center space-between margin-tb-10 cursor-pointer option"
          :class="
            (
              model.source === 1
                ? options.options[optionIndex.optionIndex] === index2
                : preViewData.userOptions[optionIndex.optionIndex] === index2
            )
              ? 'checked'
              : ''
          "
          :title="
            model.source === 1
              ? item2.name.en
              : item2.name[preViewData.inpLanguage]
          "
          @click="chooseButton(index2)"
        >
          <div style="width: 100%" class="flex align-center">
            <img
              v-if="
                model.source === 1
                  ? !!item2.images && item2.images.length > 0
                  : !!item2.image
              "
              :src="
                model.source === 1
                  ? item2.images
                    ? item2.images[0]
                    : ''
                  : item2.image
              "
              class="circular"
              alt=""
            />
            <div class="colorValue">
              {{
                item2.name
                  ? model.source === 1
                    ? item2.name.en
                    : item2.name[preViewData.inpLanguage]
                  : ""
              }}
            </div>
          </div>
          <div
            :title="`+${currency.symbol}${changeDecimal(
              item2.price[currency.code]
            )}`"
            class="price"
            v-if="item2.price && item2.price[currency.code]"
          >
            + {{ currency.symbol
            }}{{ changeDecimal(item2.price[currency.code]) }}
          </div>

          <a-icon
            v-show="
              model.source === 1
                ? options.options[optionIndex.optionIndex] === index2
                : preViewData.userOptions[optionIndex.optionIndex] === index2
            "
            type="check"
            class="check"
          />
        </div>
      </div>
    </template>

    <template v-if="data.type === 'color'">
      <span
        class="font-size-16"
        v-show="
          model.source === 1
            ? options.options[optionIndex.optionIndex] <
              configuration.options[optionIndex.optionIndex].values.length
            : preViewData.userOptions[optionIndex.optionIndex] <
              preViewData.lists[optionIndex.listsIndex].termlists[
                optionIndex.termlistsIndex
              ].vallists.length
        "
        >{{
          model.source === 1 ? data.name.en : data.name[preViewData.inpLanguage]
        }}
      </span>
      <div
        v-for="(item2, index2) in model.source === 1
          ? data.values
          : data.vallists"
        :key="index2"
      >
        <div
          v-show="
            model.source === 1
              ? optionSpec.length > 0 &&
                optionSpec[optionIndex.optionIndex].indexOf(index2) !== -1
              : preViewData.userOptions[optionIndex.optionIndex] <
                preViewData.lists[optionIndex.listsIndex].termlists[
                  optionIndex.termlistsIndex
                ].vallists.length
          "
          class="button flex align-center space-between margin-tb-10 cursor-pointer option"
          :style="
            (
              model.source === 1
                ? options.options[optionIndex.optionIndex] === index2
                : preViewData.userOptions[optionIndex.optionIndex] === index2
            )
              ? 'border:1px solid #000000;'
              : 'border:1px solid #E2E4E8;'
          "
          :title="
            model.source === 1
              ? item2.name.en
              : item2.name[preViewData.inpLanguage]
          "
          @click="chooseButton(index2)"
        >
          <div class="flex align-center">
            <span
              v-if="
                model.source === 1
                  ? !!item2.color && item2.color.length > 0
                  : !!item2.color
              "
              :style="`background:${item2.color}`"
              class="circular"
              alt=""
            />
            <div class="colorValue">
              {{
                item2.name
                  ? model.source === 1
                    ? item2.name.en
                    : item2.name[preViewData.inpLanguage]
                  : ""
              }}
            </div>
          </div>
          <div
            :title="`+${currency.symbol}${changeDecimal(
              item2.price[currency.code]
            )}`"
            class="price"
            v-if="item2.price && item2.price[currency.code]"
          >
            + {{ currency.symbol
            }}{{ changeDecimal(item2.price[currency.code]) }}
          </div>
          <a-icon
            v-show="
              model.source === 1
                ? options.options[optionIndex.optionIndex] === index2
                : preViewData.userOptions[optionIndex.optionIndex] === index2
            "
            type="check"
            class="check"
          />
        </div>
      </div>
    </template>

    <template v-if="data.type === 'text'">
      <template
        v-if="
          data.name.en === 'Lenses Engraving' ||
          data.name.en === 'Case Engraving'
        "
      >
        <GlassesCustom :data="data" :pages="optionIndex.optionIndex" />
      </template>
      <template v-else>
        <span
          class="font-size-16"
          v-show="
            model.source === 1
              ? options.options[optionIndex.optionIndex] <
                configuration.options[optionIndex.optionIndex].values.length
              : preViewData.userOptions[optionIndex.optionIndex] <
                preViewData.lists[optionIndex.listsIndex].termlists[
                  optionIndex.termlistsIndex
                ].vallists.length
          "
          >{{
            model.source === 1
              ? data.name.en
              : data.name[preViewData.inpLanguage]
          }}
        </span>
        <div
          v-for="(item2, index2) in model.source === 1
            ? data.values
            : data.vallists"
          :key="index2"
        >
          <div
            v-show="
              model.source === 1
                ? optionSpec.length > 0 &&
                  optionSpec[optionIndex.optionIndex].indexOf(index2) !== -1
                : preViewData.userOptions[optionIndex.optionIndex] <
                  preViewData.lists[optionIndex.listsIndex].termlists[
                    optionIndex.termlistsIndex
                  ].vallists.length
            "
            class="button flex align-center space-between margin-tb-10 cursor-pointer option"
            :style="
              (
                model.source === 1
                  ? options.options[optionIndex.optionIndex] === index2
                  : preViewData.userOptions[optionIndex.optionIndex] === index2
              )
                ? 'border:1px solid #000000;'
                : 'border:1px solid #E2E4E8;'
            "
            :title="
              model.source === 1
                ? item2.text.en
                : item2.text[preViewData.inpLanguage]
            "
            @click="chooseButton(index2)"
          >
            <div class="flex align-center">
              <div
                :title="
                  item2.text
                    ? model.source === 1
                      ? item2.text.en
                      : item2.text[preViewData.inpLanguage]
                    : ''
                "
                class="textValue no_labelValue"
              >
                {{
                  item2.text
                    ? model.source === 1
                      ? item2.text.en
                      : item2.text[preViewData.inpLanguage]
                    : ""
                }}
              </div>
            </div>
            <div
              :title="`+${currency.symbol}${changeDecimal(
                item2.price[currency.code]
              )}`"
              class="price"
              v-if="item2.price && item2.price[currency.code]"
            >
              + {{ currency.symbol
              }}{{ changeDecimal(item2.price[currency.code]) }}
            </div>
            <a-icon
              v-show="
                model.source === 1
                  ? options.options[optionIndex.optionIndex] === index2
                  : preViewData.userOptions[optionIndex.optionIndex] === index2
              "
              type="check"
              class="check"
            />
          </div>
        </div>
      </template>
    </template>

    <template v-if="data.type === 'textarea'">
      <span
        class="font-size-16"
        v-show="
          model.source === 1
            ? options.options[optionIndex.optionIndex] <
              configuration.options[optionIndex.optionIndex].values.length
            : preViewData.userOptions[optionIndex.optionIndex] <
              preViewData.lists[optionIndex.listsIndex].termlists[
                optionIndex.termlistsIndex
              ].vallists.length
        "
        >{{
          model.source === 1 ? data.name.en : data.name[preViewData.inpLanguage]
        }}
      </span>
      <div
        v-for="(item2, index2) in model.source === 1
          ? data.values
          : data.vallists"
        :key="index2"
      >
        <div
          v-show="
            model.source === 1
              ? optionSpec.length > 0 &&
                optionSpec[optionIndex.optionIndex].indexOf(index2) !== -1
              : preViewData.userOptions[optionIndex.optionIndex] <
                preViewData.lists[optionIndex.listsIndex].termlists[
                  optionIndex.termlistsIndex
                ].vallists.length
          "
          class="button flex align-center space-between margin-tb-10 cursor-pointer option"
          :style="
            (
              model.source === 1
                ? options.options[optionIndex.optionIndex] === index2
                : preViewData.userOptions[optionIndex.optionIndex] === index2
            )
              ? 'border:1px solid #000000;'
              : 'border:1px solid #E2E4E8;'
          "
          :title="
            model.source === 1
              ? item2.text.en
              : item2.text[preViewData.inpLanguage]
          "
          @click="chooseButton(index2)"
        >
          <div class="flex align-center">
            <div
              :title="
                item2.text
                  ? model.source === 1
                    ? item2.text.en
                    : item2.text[preViewData.inpLanguage]
                  : ''
              "
              class="textValue no_labelValue"
            >
              {{
                item2.text
                  ? model.source === 1
                    ? item2.text.en
                    : item2.text[preViewData.inpLanguage]
                  : ""
              }}
            </div>
          </div>
          <div
            :title="`+${currency.symbol}${changeDecimal(
              item2.price[currency.code]
            )}`"
            class="price"
            v-if="item2.price && item2.price[currency.code]"
          >
            + {{ currency.symbol
            }}{{ changeDecimal(item2.price[currency.code]) }}
          </div>
          <a-icon
            v-show="
              model.source === 1
                ? options.options[optionIndex.optionIndex] === index2
                : preViewData.userOptions[optionIndex.optionIndex] === index2
            "
            type="check"
            class="check"
          />
        </div>
      </div>
    </template>

    <template v-if="data.type === 'number'">
      <span
        class="font-size-16"
        v-show="
          model.source === 1
            ? options.options[optionIndex.optionIndex] <
              configuration.options[optionIndex.optionIndex].values.length
            : preViewData.userOptions[optionIndex.optionIndex] <
              preViewData.lists[optionIndex.listsIndex].termlists[
                optionIndex.termlistsIndex
              ].vallists.length
        "
        >{{
          model.source === 1 ? data.name.en : data.name[preViewData.inpLanguage]
        }}
      </span>
      <div
        v-for="(item2, index2) in model.source === 1
          ? data.values
          : data.vallists"
        :key="index2"
      >
        <div
          v-show="
            model.source === 1
              ? optionSpec.length > 0 &&
                optionSpec[optionIndex.optionIndex].indexOf(index2) !== -1
              : preViewData.userOptions[optionIndex.optionIndex] <
                preViewData.lists[optionIndex.listsIndex].termlists[
                  optionIndex.termlistsIndex
                ].vallists.length
          "
          class="button flex align-center space-between margin-tb-10 cursor-pointer option"
          :style="
            (
              model.source === 1
                ? options.options[optionIndex.optionIndex] === index2
                : preViewData.userOptions[optionIndex.optionIndex] === index2
            )
              ? 'border:1px solid #000000;'
              : 'border:1px solid #E2E4E8;'
          "
          :title="item2.number"
          @click="chooseButton(index2)"
        >
          <div class="flex align-center">
            <div
              :title="
                (item2.number !== null || typeof item2.number !== 'undefined'
                  ? item2.number
                  : '') +
                (data.extra.percentage && data.extra.percentage ? '%' : '') +
                (data.extra && data.extra.unit ? data.extra.unit : '')
              "
              class="textValue no_labelValue"
            >
              {{
                item2.number !== null || typeof item2.number !== "undefined"
                  ? item2.number
                  : ""
              }}
              {{
                data.extra.percentage && data.extra.percentage === 1 ? "%" : ""
              }}
              {{ data.extra && data.extra.unit ? data.extra.unit : "" }}
            </div>
          </div>
          <div
            :title="`+${currency.symbol}${changeDecimal(
              item2.price[currency.code]
            )}`"
            class="price"
            v-if="item2.price && item2.price[currency.code]"
          >
            + {{ currency.symbol
            }}{{ changeDecimal(item2.price[currency.code]) }}
          </div>
          <a-icon
            v-show="
              model.source === 1
                ? options.options[optionIndex.optionIndex] === index2
                : preViewData.userOptions[optionIndex.optionIndex] === index2
            "
            type="check"
            class="check"
          />
        </div>
      </div>
    </template>

    <template v-if="data.type === 'code'">
      <span
        class="font-size-16"
        v-show="
          model.source === 1
            ? options.options[optionIndex.optionIndex] <
              configuration.options[optionIndex.optionIndex].values.length
            : preViewData.userOptions[optionIndex.optionIndex] <
              preViewData.lists[optionIndex.listsIndex].termlists[
                optionIndex.termlistsIndex
              ].vallists.length
        "
        >{{
          model.source === 1 ? data.name.en : data.name[preViewData.inpLanguage]
        }}
      </span>
      <div
        v-for="(item2, index2) in model.source === 1
          ? data.values
          : data.vallists"
        :key="index2"
      >
        <div
          v-show="
            model.source === 1
              ? optionSpec.length > 0 &&
                optionSpec[optionIndex.optionIndex].indexOf(index2) !== -1
              : preViewData.userOptions[optionIndex.optionIndex] <
                preViewData.lists[optionIndex.listsIndex].termlists[
                  optionIndex.termlistsIndex
                ].vallists.length
          "
          class="button flex align-center space-between margin-tb-10 cursor-pointer option"
          :style="
            (
              model.source === 1
                ? options.options[optionIndex.optionIndex] === index2
                : preViewData.userOptions[optionIndex.optionIndex] === index2
            )
              ? 'border:1px solid #000000;'
              : 'border:1px solid #E2E4E8;'
          "
          :title="item2.code"
          @click="chooseButton(index2)"
        >
          <div class="flex align-center">
            <div
              :title="item2.code ? item2.code : ''"
              class="textValue no_labelValue"
            >
              {{ item2.code ? item2.code : "" }}
            </div>
          </div>
          <div
            :title="`+${currency.symbol}${changeDecimal(
              item2.price[currency.code]
            )}`"
            class="price"
            v-if="item2.price && item2.price[currency.code]"
          >
            + {{ currency.symbol
            }}{{ changeDecimal(item2.price[currency.code]) }}
          </div>
          <a-icon
            v-show="
              model.source === 1
                ? options.options[optionIndex.optionIndex] === index2
                : preViewData.userOptions[optionIndex.optionIndex] === index2
            "
            type="check"
            class="check"
          />
        </div>
      </div>
    </template>
  </div>
</template>

<script>
//    number code
import Bus from "@/utils/bus";
import { mapState, mapMutations } from "vuex";
import { changeDecimal } from "../../utils/utils";
import { calculate_delivery_time } from "@/utils/utils.js";
import GlassesCustom from "./GlassesCustom.vue";
export default {
  props: ["data", "optionIndex"],
  components: { GlassesCustom },
  data() {
    return {
      colorDataList: {},
      Id: "404740ed8dea4cb5b17c03cce00332ad",
      number: 1,
      addlist: [],
    };
  },
  computed: {
    ...mapState("lens", [
      "color",
      "configuration",
      "lensesList",
      "configurationList",
      "preViewData",
      "model",
      "options",
      "optionSpec",
      "currency",
    ]),
  },
  watch: {},
  mounted() {
    // 初始化加载是根据屏幕的高度修改颜色选择卡的高度
    // if (window.innerHeight > 950) {
    //   const height = window.innerHeight - 610;
    //   const color = document.getElementsByClassName("option")[0];
    //   color.style.height = `${height}px`;
    // } else if (window.innerHeight > 900) {
    //   const height = window.innerHeight - 610;
    //   const color = document.getElementsByClassName("option")[0];
    //   color.style.height = `${height}px`;
    // } else if (window.innerHeight > 850) {
    //   const height = window.innerHeight - 610;
    //   const color = document.getElementsByClassName("option")[0];
    //   color.style.height = `${height}px`;
    // } else if (window.innerHeight > 800) {
    //   const height = window.innerHeight - 590;
    //   const color = document.getElementsByClassName("option")[0];
    //   color.style.height = `${height}px`;
    // } else if (window.innerHeight > 750) {
    //   const height = window.innerHeight - 570;
    //   const color = document.getElementsByClassName("option")[0];
    //   color.style.height = `${height}px`;
    // } else if (window.innerHeight > 700) {
    //   const height = window.innerHeight - 510;
    //   const color = document.getElementsByClassName("option")[0];
    //   color.style.height = `${height}px`;
    // } else if (window.innerHeight > 650) {
    //   const height = window.innerHeight - 510;
    //   const color = document.getElementsByClassName("option")[0];
    //   color.style.height = `${height}px`;
    // } else if (window.innerHeight > 600) {
    //   const height = window.innerHeight - 500;
    //   const color = document.getElementsByClassName("option")[0];
    //   color.style.height = `${height}px`;
    // } else {
    //   const height = window.innerHeight - 500;
    //   const color = document.getElementsByClassName("option")[0];
    //   color.style.height = `${height}px`;
    // }
    // 判断是否有值
    // 获取产品基本款配置详情
    // if (this.color.moduleId === undefined) {
    //   // const route = this.$route.query.basicstyleid;
    //   // if (route === null || route === undefined || route === "") {
    //   //   this.init(this.Id);
    //   // } else {
    //   // this.init();
    //   // }
    // } else {
    //   this.configurationList = this.configuration;
    //   this.colorDataList = this.color;
    //   this.$nextTick(() => {
    //     const circular = document.getElementsByClassName("circular");
    //     for (let i = 0; i < this.colorDataList.parameterTagList.length; i++) {
    //       const element = this.colorDataList.parameterTagList[i];
    //       if (element.tagId === null) {
    //         element.parameterList.forEach((item, index) => {
    //           circular[
    //             index
    //           ].style.backgroundImage = `url('${item.parameterDispalyImage}')`;
    //           circular[index].style.backgroundRepeat = `no-repeat`;
    //           circular[index].style.backgroundSize = `contain`;
    //         });
    //       }
    //     }
    //   });
    // }
    //加购的数量
    Bus.$on("money", (e) => {
      this.number = e;
    });
    // 随机色
    Bus.$off("randomColor");
    Bus.$on("randomColor", (e) => {
      this.colorButton(e);
    });
    // 监听屏幕的高度修改颜色选择卡的高度
    this.$nextTick(() => {
      window.addEventListener("resize", () => {
        if (document.getElementsByClassName("color")[0] !== undefined) {
          if (window.innerHeight > 950) {
            const height = window.innerHeight - 610;
            const color = document.getElementsByClassName("color")[0];
            color.style.height = `${height}px`;
          } else if (window.innerHeight > 900) {
            const height = window.innerHeight - 610;
            const color = document.getElementsByClassName("color")[0];
            color.style.height = `${height}px`;
          } else if (window.innerHeight > 850) {
            const height = window.innerHeight - 610;
            const color = document.getElementsByClassName("color")[0];
            color.style.height = `${height}px`;
          } else if (window.innerHeight > 800) {
            const height = window.innerHeight - 570;
            const color = document.getElementsByClassName("color")[0];
            color.style.height = `${height}px`;
          } else if (window.innerHeight > 750) {
            const height = window.innerHeight - 500;
            const color = document.getElementsByClassName("color")[0];
            color.style.height = `${height}px`;
          } else if (window.innerHeight > 700) {
            const height = window.innerHeight - 510;
            const color = document.getElementsByClassName("color")[0];
            color.style.height = `${height}px`;
          } else if (window.innerHeight > 650) {
            const height = window.innerHeight - 510;
            const color = document.getElementsByClassName("color")[0];
            color.style.height = `${height}px`;
          } else if (window.innerHeight > 600) {
            const height = window.innerHeight - 500;
            const color = document.getElementsByClassName("color")[0];
            color.style.height = `${height}px`;
          } else {
            const height = window.innerHeight - 500;
            const color = document.getElementsByClassName("color")[0];
            color.style.height = `${height}px`;
          }
        }
      });
      window.addEventListener(
        "resize",
        () => {
          // if (window.innerWidth < 1266) {
          //   this.$nextTick(() => {
          //     const colorValue = document.getElementsByClassName("colorValue");
          //     for (let i = 0; i < colorValue.length; i++) {
          //       colorValue[i].style.width = "60px";
          //     }
          //   });
          // } else if (window.innerWidth < 1374) {
          //   this.$nextTick(() => {
          //     const colorValue = document.getElementsByClassName("colorValue");
          //     for (let i = 0; i < colorValue.length; i++) {
          //       colorValue[i].style.width = "90px";
          //     }
          //   });
          // } else if (window.innerWidth < 1440) {
          //   this.$nextTick(() => {
          //     const colorValue = document.getElementsByClassName("colorValue");
          //     for (let i = 0; i < colorValue.length; i++) {
          //       colorValue[i].style.width = "110px";
          //     }
          //   });
          // } else if (window.innerWidth < 2048) {
          //   this.$nextTick(() => {
          //     const colorValue = document.getElementsByClassName("colorValue");
          //     for (let i = 0; i < colorValue.length; i++) {
          //       colorValue[i].style.width = "140px";
          //     }
          //   });
          // }
        },
        false
      );
    });
  },
  beforeUpdate() {
    // if (window.innerWidth < 1266) {
    //   this.$nextTick(() => {
    //     const colorValue = document.getElementsByClassName("colorValue");
    //     for (let i = 0; i < colorValue.length; i++) {
    //       colorValue[i].style.width = "60px";
    //     }
    //   });
    // } else if (window.innerWidth < 1374) {
    //   this.$nextTick(() => {
    //     const colorValue = document.getElementsByClassName("colorValue");
    //     for (let i = 0; i < colorValue.length; i++) {
    //       colorValue[i].style.width = "90px";
    //     }
    //   });
    // } else if (window.innerWidth < 1440) {
    //   this.$nextTick(() => {
    //     const colorValue = document.getElementsByClassName("colorValue");
    //     for (let i = 0; i < colorValue.length; i++) {
    //       colorValue[i].style.width = "110px";
    //     }
    //   });
    // } else if (window.innerWidth < 2048) {
    //   this.$nextTick(() => {
    //     const colorValue = document.getElementsByClassName("colorValue");
    //     for (let i = 0; i < colorValue.length; i++) {
    //       colorValue[i].style.width = "140px";
    //     }
    //   });
    // }
  },
  beforeDestroy() {
    Bus.$off("optionButton");
    Bus.$off("colorButton");
  },
  methods: {
    ...mapMutations("lens", [
      "setColor",
      "setColorList",
      "setConfiguration",
      "setBottom",
      "setParameter",
      "setInfoIcon",
      "setLensColorButton",
      "setLensColorButton",
      "setPreViewData",
      "setOptions",
      "setDelivery_date",
    ]),
    changeDecimal(number, bitNum) {
      return changeDecimal(number, bitNum);
    },
    chooseButton(index) {
      console.log(this.configuration);
      // 存储遍历到的inde

      // 被限制项 设置为空参数
      // this.optionSpec.forEach((item, index) => {
      //   if (
      //     item.length == 1 &&
      //     item[0] >= this.configuration.options[index].values.length
      //   ) {
      //     this.options.options[index] =
      //       this.configuration.options[index].values.length;
      //   }
      // });

      if (this.model.source === 1) {
        let options = JSON.parse(JSON.stringify(this.options));
        options.options[this.optionIndex.optionIndex] = index;
        this.setOptions(options);
        Bus.$emit("optionButton", options);
        //计算交期
        const delivery_date = calculate_delivery_time(
          this.configuration,
          options.options
        );
        this.setDelivery_date(delivery_date);
        this.setInfoIcon(true);
      } else {
        let preViewData = Object.assign({}, this.preViewData); //JSON.parse(JSON.stringify());
        preViewData.userOptions[this.optionIndex.optionIndex] = index;
        this.setPreViewData(preViewData);
        Bus.$emit("optionButton", preViewData.userOptions);
      }

      // let _index = 0;
      // if (this.model.source === 1) {
      //   let options = JSON.parse(JSON.stringify(this.options));
      //   options.options[this.optionIndex.optionIndex] = index;
      //   let actionsList = [];
      //   this.configuration.three_d_model.actions.forEach((actionsItem) => {
      //     if (
      //       JSON.stringify(actionsItem.options) ===
      //       JSON.stringify(options.options)
      //     ) {
      //       actionsList.push(actionsItem);
      //     }
      //   });

      //   if (actionsList.length > 0) {
      //     let jsonList = [];
      //     actionsList.forEach((item, index) => {
      //       jsonList.push({ json: item.args.value });
      //     });
      //     Bus.$emit("colorButton", {
      //       moduleTag: actionsList[0].args.module_name,
      //       json: {
      //         actions: jsonList,
      //       },
      //     });
      //   }

      //   this.setOptions(Object.assign({}, options));
      //   Bus.$emit("optionButton", options);
      //   this.setInfoIcon(true);
      // } else {
      //   Bus.$emit("colorButton", {
      //     moduleTag:
      //       this.preViewData.lists[this.optionIndex.listsIndex].termlists[
      //         this.optionIndex.termlistsIndex
      //       ].vallists[index].name,
      //     json: this.preViewData.lists[this.optionIndex.listsIndex].termlists[
      //       this.optionIndex.termlistsIndex
      //     ].vallists[index],
      //   });
      //   let userOptions = this.preViewData.userOptions;
      //   userOptions[this.optionIndex.optionIndex] = index;
      //   let data = Object.assign({ userOptions }, this.preViewData);
      //   this.setPreViewData(data);
      // }
    },
    // 获取产品基本款配置详情
    async init() {
      // this.configurationList = ;
      // const res = await getConfiguration({ id: id });
      // if (res.code === 0) {
      // this.configurationList = this.configuration;
      // this.colorDataList = this.configuration.moduleList[0];
      // this.$nextTick(() => {
      //   const circular = document.getElementsByClassName("circular");
      //   for (let i = 0; i < this.colorDataList.parameterTagList.length; i++) {
      //     const element = this.colorDataList.parameterTagList[i];
      //     if (element.tagId === null) {
      //       element.parameterList.forEach((item, index) => {
      //         if (item.isDefault === true) {
      //           if (item.linkageModuleList) {
      //             if (item.linkageModuleList.length > 0) {
      //               this.setParameter(
      //                 item.linkageModuleList[0].linkageParameterList[0]
      //                   .parameterId
      //               );
      //             }
      //           }
      //         }
      // circular[
      //   index
      // ].style.backgroundImage = `url('${item.parameterDispalyImage}')`;
      // circular[index].style.backgroundRepeat = `no-repeat`;
      // circular[index].style.backgroundSize = `contain`;
      //  });
      // }
      //  }
      // });
      // this.setColor(this.colorDataList);
      // this.setColorList(this.colorDataList);
      // this.setConfiguration(this.configurationList);
      // } else {
      //   this.$message.error(res.Message);
      // }
    },
    // 点击按钮进行变色
    colorButton() {
      // const parameterList =
      //   this.colorDataList.parameterTagList[0].parameterList;
      // for (let i = 0; i < parameterList.length; i++) {
      //   parameterList[i].isDefault = false;
      //   if (index === i) {
      //     parameterList[i].isDefault = true;
      //     if (parameterList[i].linkageModuleList) {
      //       const linkageModuleList = parameterList[i].linkageModuleList;
      //       if (linkageModuleList.length > 0) {
      //         const parameterId =
      //           parameterList[i].linkageModuleList[0].linkageParameterList[0]
      //             .parameterId;
      //         this.setParameter(parameterId);
      //         this.configurationList.moduleList[1].parameterTagList[0].parameterList.forEach(
      //           (item) => {
      //             if (parameterId === item.parameterId) {
      //               this.setLensColorButton(item.json);
      //             }
      //           }
      //         );
      //       }
      //     }
      //   }
      // }
      // this.setColorList(this.colorDataList);
      // // 给父组件传参进行3D变色
      // const Json = parameterList[index].json;
      // if (Json !== "" && Json !== undefined && Json !== null) {
      //   this.$emit("colorButton", {
      //     moduleTag: this.colorDataList.moduleTag,
      //     json: parameterList[index].json,
      //   });
      // }
      // // 命中样本
      // this.setInfoIcon(true);
    },
  },
};
</script>

<style lang="less" scoped>
.color {
  overflow-y: auto;
}
.glasses {
  width: 200px;
}
.button {
  width: 100%;
  border: 1px solid #000000;
  border-radius: 6px;
  position: relative;
}
.colorValue {
  max-width: calc(100% - 100px);
  font-size: 16px;
  color: #2d2d2d;
  overflow: hidden;
  width: auto;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.colorValue.valueLong {
  max-width: calc(100% - 180px);
}
.check {
  // margin-right: 20px;
  font-size: 18px;
  position: absolute;
  right: 20px;
}
.image {
  width: 200px;
  height: 200px;
  margin: 20px auto;
}

/deep/.ant-input-number-handler-wrap {
  opacity: 1 !important;
}

.option {
  position: relative;
  border: 1px solid #e2e4e8;
}
.checked {
  border-color: #000;
  .price {
    right: 45px;
  }
}

.glasses {
  width: 200px;
}
.button {
  width: 100%;
  border-radius: 6px;
  cursor: pointer;
}
.circular {
  /* background-color: #8ecbd4; */
  /* background: linear-gradient(to left bottom, #94d1da, #c5d8e9); */
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin: 8px 12px;
}

.textValue {
  font-size: 16px;
  font-family: Poppins;
  color: #2d2d2d;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 190px;
  margin: 8px 23px;
  height: 40px;
  line-height: 40px;
}

.textValue {
  font-size: 16px;
  font-family: Poppins;
  color: #2d2d2d;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 190px;
  margin: 8px 23px;
  height: 40px;
  line-height: 40px;
}

.textValue.no_labelValue {
  width: 250px;
  margin-right: 0;
}

.colorValue {
  font-size: 16px;
  font-family: Poppins;
  color: #2d2d2d;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: inline-block;
  // prettier-ignore
}
.price {
  font-size: 16px;
  font-family: Poppins;
  color: #2d2d2d;
  position: absolute;
  right: 20px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: inline-block;
  width: auto;
  max-width: 70px;
}
.check {
  // margin-right: 28px;
  font-size: 18px;
}
.checkWhite {
  color: #fff;
  font-size: 20px;
  line-height: 55px;
}
.title-Additional {
  font-size: 18px;
  color: #000000;
}
.Lens {
  width: 3vw;
  height: 6vh;
  /* background-color: #f2f2f2; */
  border-radius: 6px;
}
.input-number {
  width: 60px;
}
.lens-list {
  overflow-y: auto;
  /* height: 230px; */
}
.image {
  width: 200px;
  height: 200px;
  margin: 20px auto;
}
.lensColorButton {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}
.lens-color {
  display: flex;
}
</style>
