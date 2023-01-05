<template>
  <div id="components-layout-demo-basic">
    <!-- 加载进度条 -->
    <a-progress :percent="percent" class="percent" v-show="percent !== 100" />
    <a-spin tip="Loading..." :spinning="spinning">
      <!-- 布局 -->
      <div id="scene" :class="isTrue ? 'logo_bg' : ''">
        <div id="scenes">
          <div v-if="engravingIndex" class="point_fixed">
            <div class="label">
              <!-- <a-icon type="edit" /> -->
              <div class="ponit_flashing"></div>
            </div>
            <div class="text">Lettering position</div>
          </div>
        </div>
        <div id="mirror_box">
          <img
            v-show="!MirrorBoxTextShow"
            class="mirror_box_img"
            src="../assets/img/Mirrorbox.png"
          />
          <img
            v-show="MirrorBoxTextShow"
            class="mirror_box_img"
            src="../assets/img/Mirrorbox_space.png"
          />
          <div v-show="MirrorBoxTextShow" class="mirror_box_cover">
            <p style="white-space: pre" class="mirror_box_text">
              {{ MirrorBoxText }}
            </p>
          </div>
        </div>
      </div>
    </a-spin>
    <a-layout v-if="isTrue" style="z-index: 1">
      <a-layout>
        <!-- 中间内容 -->
        <a-layout-content style="height: 100%">
          <a-row style="height: 100%">
            <a-col
              :xl="16"
              :xxl="18"
              :span="16"
              style="height: 100%; position: relative"
            >
              <a
                v-show="model.source === 1"
                style="position: fixed; top: 3%; z-index: 4"
                href="https://rokittechnology.com/"
              >
                <img
                  src="../assets/img/leftbutton.png"
                  style="margin-right: 20px; width: 38px"
                />
                <img
                  src="../assets/img/logo.png"
                  style="width: 248px; height: 49px"
                />
              </a>
              <div
                class="lensButton"
                @click="GoLens"
                v-if="configuration.lensSeparation === '是'"
              >
                <img
                  src="../assets/img/lens.png"
                  style="width: 70px; height: 70px"
                  alt=""
                />
              </div>
            </a-col>
            <a-col :xl="8" :xxl="6" :span="8" class="right-nav">
              <right-nav
                ref="rightNav"
                :data-list="configurationList.moduleList"
                @colorButton="colorButton"
                @randomColor="randomColor"
                @GoLens="GoLens"
                @parameterJson="parameterJson"
                @modelSizeChange="modelSizeChange"
                :base3d="base3d"
              ></right-nav>
            </a-col>
          </a-row>
        </a-layout-content>
      </a-layout>
      <!-- 底部导航 -->
      <a-layout-footer v-if="model.source === 1">
        <bottom-nav
          :detail-list="configurationList"
          :sample-list="sampleList"
          @configurationId="configuration"
        ></bottom-nav>
      </a-layout-footer>
    </a-layout>
  </div>
</template>

<script>
import Bus from "@/utils/bus";
import BottomNav from "./components/BottomNav";
import RightNav from "./components/RightNav";
// import "@/assets/js/Base3d.js";
import Base3d from "../assets/js/Base3d.js";
import productCalculator from "../utils/product-options-calculator.1.0.0.es.js";
import {
  getsample,
  getProductInfo,
  getProductList,
  getCategory,
  getCurrency,
} from "../api/forPM";
import { mapMutations, mapState } from "vuex";

import { name2Url, calculate_delivery_time } from "@/utils/utils.js";

let url = "";
switch (process.env.NODE_ENV) {
  case "test":
    url = "./mobile/";
    break;
  case "development":
    url = "./mobile/";
    break;
  case "production":
    url = "./mobile/";
    break;
  default:
}

export default {
  name: "Home",
  components: { BottomNav, RightNav },
  data() {
    return {
      percent: 0,
      base3d: null,
      url: "",
      progressNum: 0,
      configurationId: "", //7991a19fb94440fc9741d10cbe13f313
      configurationList: {},
      sampleList: {},
      number: 0,
      isTrue: false,
      spinning: false,
      CatergoriesList: [],
      isTransform: false,
      MirrorBoxText: "",
      MirrorBoxTextShow: false,
      name: undefined,
    };
  },
  computed: {
    ...mapState("lens", [
      "lensJson",
      "LensColorButton",
      "catergories",
      "configuration",
      "preViewData",
      "model",
      "options",
      "optionSpec",
      "glassList",
      "engravingIndex",
    ]),
  },
  watch: {
    lensJson(val) {
      this.base3d.changeLens(val);
      this.number++;
      if (this.number <= 1) {
        this.spinning = true;
        setTimeout(() => {
          this.spinning = false;
        }, 800);
      }
    },
    LensColorButton(val) {
      this.base3d.changeLens(val);
    },
  },
  beforeDestroy() {
    Bus.$off("optionButton");
    Bus.$off("colorButton");
    Bus.$off("textChange");
    Bus.$off("changMirrorBoxShow");
    Bus.$off("changMirrorBox");
    this.base3d && this.base3d.removeGroup();
  },
  mounted() {
    // console.log(this.lensJson);
    //监听浏览器返回
    //const route = this.$route.query.basicstyleid;
    // 获取产品基本款总列表
    //this.initCatergories();
    // if (route === null || route === undefined || route === "") {
    //   this.init(this.configurationId);
    // } else {
    //   this.init(route);
    // }
    Bus.$on("changMirrorBox", (val) => {
      this.MirrorBoxText = val;
    });
    Bus.$on("changMirrorBoxShow", (val) => {
      this.MirrorBoxTextShow = val;
    });
    Bus.$on("resize", () => {
      this.resize();
    });
    Bus.$on("textChange", (val) => {
      // console.log(this.base3d);
      this.base3d.addLettering(val);
    });
    Bus.$on("optionButton", (options) => {
      //this.base3d.action_initial();
      if (this.model.source === 1) {
        this.poCalc(options);
        if (this.configuration.variants.length > 0) {
          this.configuration.variants.forEach((item) => {
            if (
              JSON.stringify(item.options) === JSON.stringify(options.options)
            ) {
              this.setOptions(Object.assign({}, item));
              let configuration = Object.assign({}, this.configuration);
              configuration.variantName = item.name.en;

              this.setConfiguration(configuration);
            }
          });
        }

        if (
          this.configuration.three_d_model.actions &&
          this.configuration.three_d_model.actions.length >= 0
        ) {
          this.options.options.forEach((item, index) => {
            for (
              let i = 0;
              i < this.configuration.three_d_model.actions.length;
              i++
            ) {
              if (
                this.configuration.three_d_model.actions[i].options[index] ===
                  item &&
                this.configuration.three_d_model.actions[i].options[index] <=
                  this.optionSpec[index].length
              ) {
                this.configuration.three_d_model.actions[i].args.forEach(
                  (argsItem) => {
                    let obj = {
                      moduleTag: argsItem.module_name,
                      json: JSON.stringify({
                        [argsItem.module_name]: JSON.parse(argsItem.value),
                      }),
                    };
                    this.colorButton(obj);
                  }
                );
              }
            }
          });
        }
      } else {
        let preViewData = Object.assign({}, this.preViewData); //JSON.parse(JSON.stringify(this.preViewData));
        // 检测禁用情况 如果禁用就用越界表示 如果没禁用就检查值 是否越界 没越界就设为0

        if (
          preViewData.option_constraints &&
          preViewData.option_constraints.length > 0
        ) {
          preViewData.option_constraints.forEach((at_constraintsItem) => {
            // 禁用对象
            if (
              at_constraintsItem.constraints &&
              at_constraintsItem.constraints.length > 0
            ) {
              let at_constraints = null;
              preViewData.lists.forEach((listItem) => {
                if (listItem.termlists && listItem.termlists.length) {
                  listItem.termlists.forEach((termlistsItem) => {
                    if (
                      at_constraintsItem.at_metadata_key === termlistsItem.id
                    ) {
                      at_constraints = termlistsItem;
                    }
                  });
                }
              });
              // 禁用条件
              let isDisable = false;
              at_constraintsItem.constraints.forEach((constraintsItem) => {
                // 检查每个选项是否等于禁用条件
                let index = 0;
                preViewData.lists.forEach((listItem) => {
                  if (listItem.termlists && listItem.termlists.length) {
                    listItem.termlists.forEach((termlistsItem) => {
                      if (
                        termlistsItem.vallists &&
                        termlistsItem.vallists[
                          preViewData.userOptions[index]
                        ] &&
                        termlistsItem.vallists[preViewData.userOptions[index]]
                          .id == constraintsItem.value_key &&
                        termlistsItem.id === constraintsItem.metadata_key
                      ) {
                        // 有禁用的选项就设为越界
                        isDisable = true;
                        preViewData.userOptions[
                          at_constraintsItem.optionIndex
                        ] = at_constraints.vallists.length;
                      }

                      index++;
                    });
                  }
                });
              });
              // 如果未被禁用且值为越界就设为0
              if (
                !isDisable &&
                preViewData.userOptions[at_constraintsItem.optionIndex] >=
                  preViewData.options[at_constraintsItem.optionIndex].values
                    .length
              ) {
                preViewData.userOptions[at_constraintsItem.optionIndex] = 0;
              }
            }
          });
        }
        options = preViewData.userOptions;

        let optinIndex = 0;
        if (this.preViewData.lists && this.preViewData.lists.length > 0) {
          let preViewData = Object.assign({}, this.preViewData);
          preViewData.lists.forEach((listItem) => {
            if (listItem.termlists && listItem.termlists.length) {
              listItem.termlists.forEach((termlistsItem) => {
                if (
                  termlistsItem.vallists[options[optinIndex]] &&
                  termlistsItem.vallists[options[optinIndex]].actions &&
                  termlistsItem.vallists[options[optinIndex]].actions.length > 0
                ) {
                  termlistsItem.vallists[options[optinIndex]].actions.forEach(
                    (actionItem) => {
                      let json =
                        typeof actionItem.value === "string"
                          ? JSON.parse(actionItem.value)
                          : actionItem.value;

                      this.colorButton({
                        moduleTag: actionItem.module_name,
                        json: JSON.stringify({
                          [actionItem.module_name]: json,
                        }),
                      });
                    }
                  );
                }
                optinIndex++;
              });
            }
          });
        }

        this.setPreViewData(preViewData);

        // 计算价格 如果可以找到变体就用变体的价格 如果找不到就用累计单价相加

        // this.colorButton({
        //   moduleTag:
        //     this.preViewData.lists[this.optionIndex.listsIndex].termlists[
        //       this.optionIndex.termlistsIndex
        //     ].vallists[index].name,
        //   json: this.preViewData.lists[this.optionIndex.listsIndex].termlists[
        //     this.optionIndex.termlistsIndex
        //   ].vallists[index],
        // });
        // let userOptions = this.preViewData.userOptions;
        // userOptions[this.optionIndex.optionIndex] = index;
        // let data = Object.assign({ userOptions }, this.preViewData);
        // this.setPreViewData(data);
      }
    });
    Bus.$on("colorButton", (data) => {
      this.colorButton(data);
      // data.json.actions.forEach((item, index) => {
      //   console.log("item", item);
      //   this.colorButton(item);
      // });
    });

    // 如果有父级发送消息代表是ifarme环境 source == window.parent 过滤掉webpack的消息
    // 调试3D预览开关
    // if (false) {
    if (window.self === window.top) {
      // 判断有无iframe嵌套
      // 定制页面走接口
      this.setModel({
        source: 1,
        isShowAR: false,
      });

      // 获取产品基本款总列表
      this.initCatergories();

      // 初次加载时判断浏览器打开的是手机端还是电脑端
      this.iphonebrowserRedirect();
      this.$nextTick(() => {
        window.onresize = () => {
          // 判断浏览器打开的是手机端还是电脑端
          this.browserRedirect();
        };
      });
    } else {
      let preViewData = null;
      window.addEventListener(
        "message",
        (e) => {
          let { data, origin, source } = e;
          console.log(e);
          console.log("data 2022/10/20", data); // '这是来自父页面的消息'
          console.log(origin); // 'http://127.0.0.1:5500' （当前运行的地址）
          console.log(source); // 父页面窗口对象 windowyvg
          console.log(source === window.top); // true
          console.log(source === window.parent); // true

          if (source !== window.top) {
            console.log("ret");
            return;
          }

          if (!data.lists) {
            console.error("没有数据");
          }

          if (source === window.top) {
            preViewData = data;
            // 标记每个禁用对象的 optionIndex
            if (
              preViewData.option_constraints &&
              preViewData.option_constraints.length > 0
            ) {
              for (let i = 0; i < preViewData.option_constraints.length; i++) {
                for (let y = 0; y < preViewData.options.length; y++) {
                  if (
                    preViewData.option_constraints[i].at_metadata_key ===
                    preViewData.options[y].metadata_key
                  ) {
                    preViewData.option_constraints[i].optionIndex = y;
                  }
                }
              }
            }
            console.log(preViewData.lists);
            if (preViewData.lists) {
              // 商品中心不走接口
              this.setModel({
                source: 2,
                isShowAR: false,
              });
              this.init2(preViewData);
            }
          }
          // 注意，window.top 永远表示最顶层窗口，也就是浏览器窗口
          // window.parent 表示当前窗口的父窗口（上一级）
          // 只有两级的情况下，window.parent 窗口就是 top 窗口
        },
        { once: true }
      );
    }

    // 初次加载时判断浏览器打开的是手机端还是电脑端
    // this.iphonebrowserRedirect();
    this.$nextTick(() => {
      // window.onresize = () => {
      //   // 判断浏览器打开的是手机端还是电脑端
      //   this.browserRedirect();
      // };
    });
  },
  methods: {
    ...mapMutations("lens", [
      "setDetailsImg",
      "setBottom",
      "setColorList",
      "setConfiguration",
      "setOptions",
      "setCatergories",
      "setPreViewData",
      "setModel",
      "setOptionSpec",
      "setGlassLIst",
      "setCurrency",
      "setCurrencyList",
      "setDelivery_date",
      "setEngravingIndex",
      "setCaseIndex",
      "setIsInscribe",
    ]),
    async initCurrency() {
      const res = await getCurrency();
      if (res.code == 0) {
        const configuration = JSON.parse(JSON.stringify(this.configuration));
        let currencyList = [];
        if (res.data) {
          // start  todo 临时隐藏 除美元的币种
          res.data = res.data.filter((item) => {
            return item.code === "USD";
          });
          // end  todo 临时隐藏 除美元的币种
          currencyList = res.data.filter((item) => {
            // 区分货币空值和0
            return (
              typeof configuration.price[`${item.code}`] !== "undefined" &&
              configuration.price[`${item.code}`] !== null
            );
          });
          this.setCurrency(Object.assign({}, currencyList[0]));
        } else {
          this.setCurrency(Object.assign({}, {}));
        }

        this.setCurrencyList(currencyList);
      }
    },
    async init2(data) {
      console.log(data);
      let userOptions = [];
      // 设置默认选中的属性
      data.lists.forEach((item) => {
        item.termlists.forEach(() => {
          userOptions.push(0);
        });
      });
      // json格式转换
      data.userOptions = userOptions;
      data.lists.forEach((listTtem) => {
        listTtem.termlists.forEach((termlistItem) => {
          termlistItem.vallists.forEach((vallistsItem) => {
            vallistsItem.actions.forEach((actionsTtem) => {
              // 使用moudle name 作为key
              let json = {};
              json[actionsTtem.module_name] = actionsTtem.value;
              actionsTtem.json = JSON.stringify(json);
            });
          });
        });
      });

      //初始化刻字索引
      let engravingIndex = data.groupNames.findIndex((item) => {
        return item.toLowerCase() == "engraving";
      });

      let caseIndex = data.groupNames.findIndex((item) => {
        return item.toLowerCase() == "case";
      });
      engravingIndex = engravingIndex == -1 ? null : engravingIndex;
      caseIndex = caseIndex == -1 ? null : caseIndex;
      this.setEngravingIndex(engravingIndex);
      this.setCaseIndex(caseIndex);
      let arrIsInscribe = [];

      let arrIsInscribes = {
        engravingIndex: engravingIndex,
        caseIndex: caseIndex,
      };
      for (const key in arrIsInscribes) {
        if (arrIsInscribes[key]) {
          const name = data.lists[arrIsInscribes[key]].termNames[0];
          let obj = {
            indexName: key,
            name: name,
            isChoose: "No",
            text: "",
          };
          arrIsInscribe.push(obj);
        }
      }
      if (arrIsInscribe.length > 0) {
        this.setIsInscribe(arrIsInscribe);
      }
      //眼镜类型
      const glassList = data.attrForm.groupLists.find((item) => {
        return item.name == "参数表";
      });
      const glassLists = glassList.tagLists[0].paramList.find((item) => {
        return item.name.en.toLowerCase() == "type";
      });
      if (glassLists) {
        this.name = glassLists.val.text.en;
      }

      this.setPreViewData(data);
      this.initThree();
    },
    // 为了计算距离顶部的高度，当高度大于60显示回顶部图标，小于60则隐藏
    // 初次加载时判断浏览器打开的是手机端还是电脑端
    iphonebrowserRedirect() {
      var sUserAgent = navigator.userAgent.toLowerCase();
      var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
      var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
      var bIsMidp = sUserAgent.match(/midp/i) == "midp";
      var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
      var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
      var bIsAndroid = sUserAgent.match(/android/i) == "android";
      var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
      var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";

      if (
        bIsIpad ||
        bIsIphoneOs ||
        bIsMidp ||
        bIsUc7 ||
        bIsUc ||
        bIsAndroid ||
        bIsCE ||
        bIsWM
      ) {
        if (this.$route.query.id) {
          window.location.href = `${url}#/?basicstyleid=${this.$route.query.id}`; //http://36.156.138.127:85/mobile  http://design-your-own.rokitlife.com/mobile
        } else if (this.$route.query.basicstyleid) {
          window.location.href = `${url}#/?basicstyleid=${this.$route.query.basicstyleid}`;
        } else {
          window.location.href = `${url}#/`;
        }
      }
    },
    // 根据窗口的变动判断浏览器打开的是手机端还是电脑端
    browserRedirect() {
      var sUserAgent = navigator.userAgent.toLowerCase();
      var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
      var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
      var bIsMidp = sUserAgent.match(/midp/i) == "midp";
      var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
      var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
      var bIsAndroid = sUserAgent.match(/android/i) == "android";
      var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
      var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
      if (
        bIsIpad ||
        bIsIphoneOs ||
        bIsMidp ||
        bIsUc7 ||
        bIsUc ||
        bIsAndroid ||
        bIsCE ||
        bIsWM
      ) {
        if (this.$route.query.id) {
          window.location.href = `${url}#/?basicstyleid=${this.$route.query.id}`; //http://36.156.138.127:85/mobile  http://design-your-own.rokitlife.com/mobile
        } else if (this.$route.query.basicstyleid) {
          window.location.href = `${url}#/?basicstyleid=${this.$route.query.basicstyleid}`;
        } else {
          window.location.href = `${url}#/`;
        }
      }
    },
    // 获取产品基本款配置详情
    async init(id) {
      const res = await getProductInfo({ id: id });
      if (res.code === 0) {
        // 整合配置项的数据
        this.configurationList = res.data;
        console.log(this.configurationList);
        console.log(this.configurationList.description);
        // const aa = {};

        if (this.configurationList.options) {
          this.configurationList.options.forEach((optionsItem) => {
            if (
              optionsItem.group_index !== null &&
              !isNaN(optionsItem.group_index)
            ) {
              if (
                !this.configurationList.option_groups[optionsItem.group_index]
                  .options
              ) {
                this.configurationList.option_groups[
                  optionsItem.group_index
                ].options = [];
              }
              this.configurationList.option_groups[
                optionsItem.group_index
              ].options.push(optionsItem);
            }
          });
        }
        // 加购项初始化number

        if (this.configurationList.related_variants) {
          this.configurationList.related_variants.forEach((item) => {
            item.number = 0;
            if (item.attributes && item.attributes.length >= 0) {
              // 提取加购项图片

              let attribute_image = item.attributes.find((item1) => {
                return item1.tags && item1.tags[0] === "product_image";
              });

              if (
                attribute_image &&
                attribute_image.values.length > 0 &&
                attribute_image.values[0] &&
                attribute_image.values[0].images.length > 0
              ) {
                item.attribute_image = attribute_image.values[0].images[0];
              }

              // 提取加购项单位
              let attribute_unit = item.attributes.find((item1) => {
                return item1.tags && item1.tags[0] === "unit";
              });
              if (
                attribute_unit &&
                attribute_unit.values.length > 0 &&
                attribute_unit.values[0] &&
                attribute_unit.values[0].text
              ) {
                item.attribute_unit = attribute_unit.values[0].text.en;
              }

              // 提取加购项重量
              let attribute_weight = item.attributes.find((item1) => {
                return item1.tags && item1.tags[0] === "weight";
              });
              if (
                attribute_weight &&
                attribute_weight.values.length > 0 &&
                attribute_weight.values[0] &&
                attribute_weight.values[0].number
              ) {
                item.weight = attribute_weight.values[0].number;
              }

              // 海关编码
              let attribute_hsCode = item.attributes.find((item1) => {
                return item1.tags && item1.tags[0] === "HS_code";
              });

              if (
                attribute_hsCode &&
                attribute_hsCode.values.length > 0 &&
                attribute_hsCode.values[0] &&
                attribute_hsCode.values[0].text
              ) {
                item.hsCode = attribute_hsCode.values[0].text.en;
              }
            }
          });
        }
        // 默认数量
        res.data.number = 1;
        // 默认变体名
        res.variantName = "";
        if (res.data.variants && res.data.variants.length > 0) {
          res.data.variantName = res.data.variants[0].name.en;
        }
        // 默认商品单位
        // if (res.data.unit && res.data.variants.length > 0) {
        //   res.data.unit = res.data.variants[0].name.en;
        // }

        if (res.data.attributes && res.data.attributes.length > 0) {
          // 最长交期
          let attribute_maximum_delivery_date = res.data.attributes.find(
            (item) => {
              return (
                item.tags && item.tags[0] === "product_maximum_delivery_date"
              );
            }
          );
          if (
            attribute_maximum_delivery_date &&
            attribute_maximum_delivery_date.values.length > 0 &&
            attribute_maximum_delivery_date.values[0] &&
            attribute_maximum_delivery_date.values[0].number
          ) {
            res.data.maximum_delivery_date =
              attribute_maximum_delivery_date.values[0].number;
          }

          //最短交期
          let attribute_minimum_delivery_date = res.data.attributes.find(
            (item) => {
              return (
                item.tags && item.tags[0] === "product_minimum_delivery_date"
              );
            }
          );

          if (
            attribute_minimum_delivery_date &&
            attribute_minimum_delivery_date.values.length > 0 &&
            attribute_minimum_delivery_date.values[0] &&
            attribute_minimum_delivery_date.values[0].number
          ) {
            res.data.minimum_delivery_date =
              attribute_minimum_delivery_date.values[0].number;
          }

          // 商品单位
          let attribute_unit = res.data.attributes.find((item) => {
            return item.tags && item.tags[0] === "unit";
          });
          if (
            attribute_unit &&
            attribute_unit.values.length > 0 &&
            attribute_unit.values[0] &&
            attribute_unit.values[0].text
          ) {
            res.data.unit = attribute_unit.values[0].text.en;
          }

          // 商品重量
          let attribute_weight = res.data.attributes.find((item) => {
            return item.tags && item.tags[0] === "weight";
          });
          if (
            attribute_weight &&
            attribute_weight.values.length > 0 &&
            attribute_weight.values[0] &&
            attribute_weight.values[0].number
          ) {
            res.data.weight = attribute_weight.values[0].number;
          }

          //海关编码
          let attribute_hsCode = res.data.attributes.find((item) => {
            return item.tags && item.tags[0] === "HS_code";
          });
          if (
            attribute_hsCode &&
            attribute_hsCode.values.length > 0 &&
            attribute_hsCode.values[0] &&
            attribute_hsCode.values[0].text
          ) {
            res.data.hsCode = attribute_hsCode.values[0].text.en;
          }

          // 镜片分离
          let attribute_lensSeparation = res.data.attributes.find((item) => {
            return item.tags && item.tags[0] === "product_separator_lens";
          });

          if (
            attribute_lensSeparation &&
            attribute_lensSeparation.values.length > 0 &&
            attribute_lensSeparation.values[0] &&
            attribute_lensSeparation.values[0].text
          ) {
            res.data.lensSeparation =
              attribute_lensSeparation.values[0].text.en;
          }
        }

        //眼镜类型
        let glasses_type = res.data.attributes.find((item) => {
          return item.name.en == "type";
        });

        if (glasses_type) {
          this.name = glasses_type.values[0].text.en;
        }

        //初始化刻字索引
        let engravingIndex = this.configurationList.option_groups.findIndex(
          (item) => {
            return item.name.en.toLowerCase() == "engraving";
          }
        );

        let caseIndex = this.configurationList.option_groups.findIndex(
          (item) => {
            return item.name.en.toLowerCase() == "case";
          }
        );
        engravingIndex = engravingIndex == -1 ? null : engravingIndex;
        caseIndex = caseIndex == -1 ? null : caseIndex;
        this.setEngravingIndex(engravingIndex);
        this.setCaseIndex(caseIndex);
        let arrIsInscribe = [];
        let arrIsInscribes = {
          engravingIndex: engravingIndex,
          caseIndex: caseIndex,
        };
        for (const key in arrIsInscribes) {
          if (arrIsInscribes[key]) {
            const name =
              this.configurationList.option_groups[arrIsInscribes[key]]
                .options[0].name.en;
            let obj = {
              indexName: key,
              name: name,
              isChoose: "No",
              text: "",
            };
            arrIsInscribe.push(obj);
          }
        }

        if (arrIsInscribe.length > 0) {
          this.setIsInscribe(arrIsInscribe);
        }
        // 设置默认规格
        this.setOptions(res.data.variants[0]);
        this.setConfiguration(res.data);
        //获取货币
        await this.initCurrency();
        //计算交期
        const delivery_date = calculate_delivery_time(
          res.data,
          res.data.variants[0].options
        );
        this.setDelivery_date(delivery_date);
        //this.poCalc();
        this.initThree();
      } else {
        if (res.code === 110) {
          // 跳转404页面 带参数
          this.$router.push({
            name: "NotFound",
            params: {
              mode: 1,
            },
          });
          return;
          // this.$message.error("Error");
        } else {
          this.$router.push({
            name: "NotFound",
            params: {
              mode: 1,
            },
          });
          return;
          //this.$message.error(res.Message);
        }
      }
      // 获取默认样本信息
      //this.sampleinit();
    },
    poCalc(options) {
      // 根据变体和矩阵生成可选项目
      // 默认放开  看每个选项有无 越界值 index===length  有越界值用-1
      let user_options = options
        ? Object.assign([], options.options)
        : Object.assign([], this.options.options);
      if (user_options.length <= 0) {
        return;
      }

      //通过 变体&&规格矩阵&&用户选择 生成可选项
      let variantsList = [];
      this.configuration.variants.forEach((item) => {
        variantsList.push(item.options);
      });

      let paramSchemaList = [];
      if (this.configuration.options) {
        this.configuration.options.forEach((item) => {
          paramSchemaList.push(item.values.length);
        });
      }

      let parameter = {
        paramSchema: paramSchemaList,
        variants: variantsList,
      };
      if (this.configuration.variant_option_matrix) {
        parameter.variant_option_matrix =
          this.configuration.variant_option_matrix;
      }

      // 空值设为任意值
      for (let i = 0; i < user_options.length; i++) {
        let length = paramSchemaList[i];
        for (let y = 0; y < variantsList.length; y++) {
          if (variantsList[y][i] >= length) {
            user_options[i] = -1;
            break;
          }
        }
      }

      var poCalc = new productCalculator(parameter);
      const result = poCalc.calculateOptionalParams(user_options);
      this.setOptionSpec(result);
      let option_temple = Object.assign({}, this.options);
      this.optionSpec.forEach((item, index) => {
        // 被限制项 设置为空参数
        if (
          item.length == 1 &&
          item[0] >= this.configuration.options[index].values.length
        ) {
          option_temple.options[index] =
            this.configuration.options[index].values.length;
        } else if (
          item.length >= 1 &&
          option_temple.options[index] ==
            this.configuration.options[index].values.length
        ) {
          // 开放限制项
          option_temple.options[index] = 0;
        }
      });
      this.setOptions(option_temple);
    },

    async initCatergories() {
      const res = await getCategory();
      if (res.code === 0) {
        if (!res.data) {
          // 跳转404页面 带参数
          this.$router.push({
            name: "NotFound",
            params: {
              mode: 2,
            },
          });
          // this.$message.error("Error");
          return;
        }
        this.CatergoriesList = res.data;
        this.CatergoriesList.forEach((item, index) => {
          this.$set(this.CatergoriesList[index], "products", []);
        });
        this.$nextTick(() => {
          this.initProductList();
        });
      }
    },
    // 获取产品基本款总列表
    async initProductList() {
      // 空参数取所有分类的产品
      let parameter = {
        category_id: "",
      };
      const res = await getProductList(parameter);
      if (res.code === 0) {
        if (!res.data) {
          // 跳转404页面 带参数
          this.$router.push({
            name: "NotFound",
            params: {
              mode: 2,
            },
          });
          // this.$message.error("Error");
          return;
        }
        if (res.data && !res.data.products) {
          // 跳转404页面 带参数
          this.$router.push({
            name: "NotFound",
            params: {
              mode: 2,
            },
          });
          // this.$message.error("Error");
          return;
        }
        // 给产品归类
        this.setGlassLIst(res.data.products);
        // 提取产品图片
        // this.glassList.forEach((item, index) => {
        //   this.glassList[index].productImage = item.attributes.find(
        //     (item) => {
        //       return item.tag === "product_images";
        //     }
        //   ).value.images[0];
        // });
        // 如果没有属性字段都设为空
        this.glassList.forEach((item, index) => {
          if (item.attributes) {
            let attribute_image = item.attributes.find((item) => {
              return item.tags && item.tags[0] === "product_image";
            });

            let image = "";
            //产品图
            if (
              attribute_image &&
              attribute_image.values &&
              attribute_image.values.length > 0 &&
              attribute_image.values[0].images.length > 0
            ) {
              image = attribute_image.values[0].images[0];
            }

            // //交期
            // if (
            //   attribute_desic &&
            //   attribute_desic.values &&
            //   attribute_desic.values.length > 0
            // ) {
            //   desic = attribute_desic.values[0].text.en;
            // }

            // //商品重量
            // if (
            //   attribute_weight &&
            //   attribute_weight.values &&
            //   attribute_weight.values.length > 0
            // ) {
            //   weight = attribute_weight.values[0].number;
            // }

            // //海关编码
            // if (
            //   attribute_hscode &&
            //   attribute_hscode.values &&
            //   attribute_hscode.values.length > 0
            // ) {
            //   hscode = attribute_hscode.values[0].text.en;
            // }

            // //镜片拆卸
            // if (
            //   attribute_transform &&
            //   attribute_transform.values &&
            //   attribute_transform.values.length > 0
            // ) {
            //   isTransform = attribute_transform.values[0].text.en;
            // }

            this.glassList[index].productImage = image;
            // this.glassList[index].productDesic = desic;
            // this.glassList[index].attribute_weight = weight;
            // this.glassList[index].attribute_hscode = hscode;
            // this.glassList[index].isTransform = true;
          } else {
            this.glassList[index].productImage = "";
            // this.glassList[index].productDesic = "";
            // this.glassList[index].attribute_weight = "";
            // this.glassList[index].attribute_hscode = "";
            // this.glassList[index].isTransform = false;
          }
        });

        // this.glassList.forEach((item, index) => {
        //   this.glassList[index].productImage = item.attributes.find(
        //     (item) => {
        //       return item.name.en === "产品单位";
        //     }
        //   ).value.images[0];
        // });

        // this.glassList.forEach((item, index) => {
        //   this.glassList[index].productImage = item.attributes.find(
        //     (item) => {
        //       return item.name.en === "产品交期";
        //     }
        //   ).value.images[0];
        // });

        // this.glassList.forEach((item, index) => {
        //   this.glassList[index].productImage = item.attributes.find(
        //     (item) => {
        //       return item.name.en === "产品重量";
        //     }
        //   ).value.images[0];
        // });

        // this.glassList.forEach((item, index) => {
        //   this.glassList[index].productImage = item.attributes.find(
        //     (item) => {
        //       return item.name.en === "海关编码";
        //     }
        //   ).value.images[0];
        // });

        let glassyListTemp = JSON.parse(JSON.stringify(this.glassList));
        // 递归目录给产品归类
        let getChildren = function getChildren(node) {
          glassyListTemp.forEach((glassItem) => {
            if (glassItem.category_id === node.id) {
              if (!node.products) {
                node.products = [];
              }
              node.products.push(glassItem);
            }
          });
          if (node.children) {
            node.children.forEach((item) => {
              getChildren(item);
            });
          }
        };
        this.CatergoriesList.forEach((item) => {
          getChildren(item);
        });

        //设置默认款式 取第一个分类的第一个
        let getDefaultProduct = (arr) => {
          for (let index = 0; index < arr.length; index++) {
            if (arr[index].products && arr[index].products.length > 0) {
              this.configurationId = arr[index].products[0].id;
              return;
            } else if (arr[index].children) {
              getDefaultProduct(arr[index].children);
            }
          }
          return arr;
        };
        getDefaultProduct(this.CatergoriesList);
        this.setCatergories(this.CatergoriesList);
      }

      let productId = this.$route.query.basicstyleid
        ? this.$route.query.basicstyleid
        : this.$route.query.id;
      let product;
      if (
        typeof this.$route.query.basicstyleid !== "undefined" &&
        this.$route.query.basicstyleid !== "undefined"
      ) {
        // 兼容旧链接
        switch (this.$route.query.basicstyleid) {
          case "404740ed8dea4cb5b17c03cce00332ad":
            productId = "586492";
            break;
          case "2cb39e92b0374fddb22dacb99c8d03c0":
            productId = "589842";
            break;
          case "0be6b166f1b64f44af35ec05187279ef":
            productId = "664797";
            break;
          case "5c3b7b9f17b14da9a9cb1eb09a8049f0":
            productId = "588353";
            break;
          case "586492":
            productId = "586492";
            break;
          case "589842":
            productId = "589842";
            break;
          case "664797":
            productId = "664797";
            break;
          case "588353":
            productId = "588353";
            break;
          default:
            this.$router.push({
              name: "NotFound",
              params: {
                mode: 1,
              },
            });
        }
        product = this.glassList.find((item) => {
          return item.id === productId;
        });
        history.replaceState(
          "",
          "",
          `./#/products/${name2Url(product.name.en)}?id=${product.id}`
        );
      } else if (this.$route.query.id) {
        product = this.glassList.find((item) => {
          return item.id === productId;
        });
      }

      if (
        (productId === null || productId === undefined || productId === "") &&
        !product
      ) {
        if (this.configurationId === "") {
          this.$router.push({
            name: "NotFound",
            params: {
              mode: 2,
            },
          });
          return;
        }
        if (process.env.NODE_ENV === "prod") {
          // eslint-disable-next-line no-undef
          gtag("event", "page_view", {
            url: `${window.location.href}`,
            name: `${product.name.en}`,
            id: `${product.id}`,
          });
        }
        this.init(this.configurationId);
      } else {
        if (!product) {
          this.$router.push({
            name: "NotFound",
            params: {
              mode: 1,
            },
          });
          return;
        }
        if (process.env.NODE_ENV === "prod") {
          // eslint-disable-next-line no-undef
          gtag("event", "page_view", {
            url: `${window.location.href}`,
            name: `${product.name.en}`,
            id: `${product.id}`,
          });
        }
        this.init(product.id);
      }
      // if (route === null || route === undefined || route === "") {
      //   if (this.configurationId === "") {
      //     this.$router.push({
      //       name: "NotFound",
      //       params: {
      //         mode: 2,
      //       },
      //     });
      //     return;
      //   }
      //   this.init(this.configurationId);
      // } else {
      //   this.init(route);
      // }
    },
    // 获取默认样本信息
    async sampleinit() {
      const res = await getsample({
        id: this.configurationList.defaultSampleId,
      });
      if (res.Code === 0) {
        this.sampleList = res.Data;
        this.setBottom(res.Data);
        // this.setDetailsImg(res.Data);
      } else {
        this.$message.error(res.Message);
      }
    },
    // 3D加载
    initThree() {
      // console.log("preViewData", this.preViewData);
      let url3D = "";
      if (this.model.source === 1) {
        url3D = this.configuration.three_d_model.file;
        // url3D =
        //   "https://c2mcs-test.s3.us-west-1.amazonaws.com/product/PID0123456789/23338057c81e5bd9b5e05c1f25aa06c8.glb";
      } else {
        url3D = this.preViewData.url3D;
      }
      this.base3d = new Base3d("#scenes", url3D, this.LoadingFinish, this.name);
      if (this.model.source === 1) {
        this.base3d.total_actions =
          this.configuration.three_d_model.actions || [];
      } else {
        this.base3d.total_actions = this.preViewData.actions || [];
      }
      this.base3d.onProgress((e) => {
        this.percent = e.progressNum;
        if (this.percent === 100) {
          this.isTrue = true;
        }
        let progressNum = e.loaded / e.total;
        progressNum = progressNum.toFixed(1) * 100;
        if (progressNum >= 100) {
          setTimeout(() => {
            this.progressNum = progressNum;
          }, 100);
        } else {
          this.progressNum = progressNum;
        }
        this.progressNum = progressNum;
      });
    },
    // 3D加载完成时返回
    LoadingFinish() {
      // 初始化渲染变色
      if (this.model.source === 1) {
        Bus.$emit("optionButton", this.configuration.variants[0]);
      } else {
        Bus.$emit("optionButton", this.preViewData.userOptions);
      }
    },
    // 点击颜色值进行变色
    colorButton(val) {
      //判断是否用渐变材质
      if (val.json.indexOf("MeshPhysicalMaterial") >= 0) {
        this.base3d.changeLens(val.json);
      } else {
        this.base3d.changeColor(val.moduleTag, val.json);
      }
    },
    resize() {
      if (this.base3d) {
        this.base3d.onWindowResize();
      }
    },
    // 随机变色
    randomColor() {
      const res = this.base3d.randomColor(
        this.configurationList.moduleList[0].parameterTagList[0].parameterList,
        this.configurationList.moduleList[0].moduleTag
      );
      // 通过bus进行传参返回下标值
      Bus.$emit("randomColor", res);
    },
    // configuration(val) {
    //   this.initTwo(val);
    // },
    GoLens() {
      this.base3d.shiftOutLens();
    },
    parameterJson(val) {
      this.base3d.changeLens(val);
    },
    modelSizeChange(tabIndex) {
      if (tabIndex == -4) {
        this.base3d.model;
      }
    },
  },
};
</script>
<style lang="less" scoped>
#scene {
  position: fixed;
  top: 0%;
  // display: inline-block;
  z-index: 3;
  width: 100%;
  height: 100%;
  // background-image: url("../assets/img/background.png") !important;
  // background-size: cover;
  #scenes {
    width: 100%;
    height: 100%;
  }
  #mirror_box {
    width: 100%;
    height: 100%;
    display: none;
    position: relative;
    .mirror_box_img {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);

      width: 230.5vh;
      height: 150vh;
      z-index: -999 !important;
    }
    .mirror_box_cover {
      position: absolute;
      left: 50%;
      transform: translateX(-55%);
      z-index: 999;
      top: 44%;
      width: 48.5%;
      height: 4.5%;
    }
    .mirror_box_text {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      z-index: 10;
      color: #000;
      font-family: "Poppins-Bold";
      font-size: 30px;
    }
  }
}
#components-layout-demo-basic {
  position: relative;
  height: 100%;
}
#components-layout-demo-basic > .ant-layout:last-child {
  height: 100%;
}
.right-nav {
  // background: #fff;
  height: 100%;
  position: relative;
  padding: 0;
  border-radius: 6px;
  z-index: 3;
  & > div {
    display: flex;
    justify-content: flex-end;
  }
  &.close {
    /deep/.nav_detail {
      width: 0;
      padding: 0;
      background-color: red;
    }
  }
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

.ant-radio-group {
  text-align: center;
  width: 100%;
}
.ant-radio-group-large .ant-radio-button-wrapper {
  border-radius: 5px !important;
  margin-bottom: 40px;
  border: 1px solid #a4a4a4;
}
.ant-radio-button-wrapper:not(:first-child)::before {
  background-color: transparent !important;
}
.position-absolute {
  position: absolute;
  bottom: 10px;
}

.logo_bg {
  background-size: contain;
  background-image: url("../../src/assets/img/logo2.png");
}

.percent {
  z-index: 4;
  width: 80% !important;
  position: absolute;
  top: 45%;
  left: 48%;
  transform: translate(-50%, -50%);
}
.Glasses-Type {
  color: #999999;
  text-decoration: underline;
}
.ant-col-19 {
  padding-left: 30px !important;
}
/deep/.ant-progress-bg {
  height: 20px !important;
  background-color: black;
}
/deep/ .ant-progress-status-success .ant-progress-bg {
  background-color: black;
}
.ant-spin-nested-loading {
  width: 80% !important;
  top: 490px;
}
/deep/.ant-spin-dot-item {
  background-color: #000000 !important;
}
/deep/.ant-spin {
  color: #000000 !important;
}

/deep/.anticon.anticon-check-circle {
  display: none;
}

.point_fixed {
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 10;

  .label {
    position: absolute;
    top: -16px;
    left: -16px;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: #35343477;
    border: 1px solid #ffffff77;
    color: #ffffff;
    text-align: center;
    line-height: 40px;
    font-weight: 100;
    font-size: 14px;
    cursor: help;
    transform: scale(0, 0);
    transition: transform 0.3s;
    box-shadow: 0 0 3px #cecccc77;
    .ponit_flashing {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      margin: auto;
      width: 20px;
      height: 20px;
      border-radius: 50%;

      background-color: #fff;
    }
  }

  .text {
    position: absolute;
    top: 30px;
    left: -120px;
    width: 200px;
    padding: 20px;
    border-radius: 4px;
    background: rgba(0, 0, 0, 0.6);
    border: 1px solid #ffffff77;
    color: #ffffff;
    line-height: 1.3em;
    font-weight: 100;
    font-size: 14px;
    opacity: 0;
    transition: opacity 0.3s;
    pointer-events: none;
    text-align: justify;
    text-align-last: left;
  }
  &:hover .text {
    opacity: 1;
  }
}
.visible .label {
  transform: scale(1, 1) !important;
}
</style>
