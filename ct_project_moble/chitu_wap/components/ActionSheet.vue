<template>
  <view>
    <view class="action-sheet-wrap u-drawer-content-visible">
      <scroll-view
        class="action-sheet-wrap_scroll"
        :scroll-x="false"
        :scroll-y="false"
      >
        <view style="padding-top: 10px; height: 100%" v-show="tabIndex == -1">
          <scroll-view scroll-x="true" class="scroll-view_H">
            <!-- <view class="option-wrap"> -->
            <view class="scroll-view-item_H" @click="handleNavChange(0)">
              <view class="option">
                <image mode="widthFix" class="logo" src="./../static/Frame.png">
                </image>
                <text>FRAMES</text>
              </view>
            </view>
            <view
              class="scroll-view-item_H"
              v-for="(item, index) in configuration.option_groups"
              :key="index"
              @click="handleNavChange(index + 1)"
            >
              <view class="option">
                <image :src="item.icon"> </image>
                <text>{{ item.name.en }}</text>
              </view>
            </view>
            <!-- 						<template v-if="isInscribe.glasses">
							<view class="scroll-view-item_H" @click="handleNavChange(-2)">
								<view class="option">
									<image mode="widthFix" class="logo" src="./../static/Frame.png">
									</image>
									<text>ENGRAVING</text>
								</view>
							</view>
						</template>

						<template v-if="isInscribe.mirrorBox">
							<view class="scroll-view-item_H" @click="handleNavChange(-3)">
								<view class="option">
									<image mode="widthFix" class="logo" src="./../static/Frame.png">
									</image>
									<text>CASE</text>
								</view>
							</view>
						</template> -->

            <!-- </view> -->
          </scroll-view>
        </view>
        <template v-if="tabIndex !== -1">
          <view class="frames" v-if="tabIndex === 0">
            <view class="title">FRAMES</view>
            <template v-for="item in catergories">
              <glasses-type
                :node="item"
                :key="item.id"
                @configurationId="configurationId"
              ></glasses-type>
            </template>
          </view>

          <!-- 					<template v-else-if="tabIndex === -2">
						<write-info></write-info>
					</template>

					<view v-else-if="tabIndex === -3">
						<write-info></write-info>
					</view> -->

          <template v-else>
            <Option
              v-for="(item1, termlistsIndex) in configuration.option_groups[
                tabIndex - 1
              ].options"
              :data="item1"
              :key="item1.id"
              :optionIndex="computeOptionIndex(tabIndex, termlistsIndex)"
            >
            </Option>
            <template v-if="ifPurchased(tabIndex)">
              <!-- 最后一个规格组里面 显示加购项目 -->
              <view
                class="content"
                v-if="
                  configuration.related_variants &&
                  configuration.related_variants.length > 0
                "
              >
                <view class="title">You may also need</view>
                <view
                  class="optional-item-wrap"
                  v-for="(item, index) in configuration.related_variants"
                  :key="item.id"
                >
                  <view class="cover">
                    <image :src="item.attribute_image"></image>
                  </view>
                  <view
                    class="u-flex-1 u-m-l-26 optional-content u-row-between"
                  >
                    <view class="u-line-2">{{ item.name.en }}</view>
                    <view class="u-flex">
                      <view
                        v-if="
                          item.price &&
                          typeof item.price[`${currency.code}`] !==
                            'undefined' &&
                          item.price[`${currency.code}`] !== null
                        "
                        class="price"
                        >{{ currency.symbol
                        }}{{
                          typeof item.price[currency.code] === "undefined"
                            ? "-"
                            : item.price[currency.code]
                        }}</view
                      >
                      <view class="unit"
                        ><text class="u-font-30">/</text
                        >{{ item.attribute_unit }}
                      </view>
                    </view>
                  </view>
                  <!-- <number-box :min="0" v-model="item.number" :longPress="false"></number-box> -->
                  <number-box
                    @change="UpChange($event, index)"
                    :min="0"
                    :longPress="false"
                    v-model="item.number"
                  >
                  </number-box>
                </view>
              </view>
            </template>

            <!-- <text>{{ optionItem.name.en }}</text> <text></text>
              <view
                v-for="(valueItem, valueIndex) in optionItem.values"
                :key="valueIndex"
              >
                <image
                  class="option_image"
                  mode="widthFix"
                  :src="valueItem.images[0]"
              /></view> -->
            <!-- <view
              v-for="(valueItem, valueIndex) in optionItem.values"
              :key="valueIndex"
            >
              <view>{{ valueItem }}</view>
              <image class="option_image"   mode="widthFix" :src="valueItem.images[0]">
            </view> -->
            <!-- <view>  
              <text>{{configuration.option_groups[
                tabIndex - 1
              ].options.name.en}}</text>    <text>2</text>  </view>
            <view class="option_wrap">
            <template
              v-for="(optionItem) in configuration.option_groups[
                tabIndex - 1
              ].options"
            >
              <view class="option_item"
                v-for="(valueItem, valueIndex) in optionItem.values"
                :key="valueIndex"
                >
                <image class="option_image"   mode="widthFix" :src="valueItem.images[0]">
              </view>
            </template>
            </view> -->
          </template>

          <!-- <view
            v-else
            class="option"
            v-for="(optionItem, optionIndex) in configuration.option_groups[
              tabIndex - 1
            ].options"
            :key="optionIndex"
            @click="handleNavChange(optionIndex + 1)"
          >
      

            <view class="option_item"
              v-for="(valueItem, valueIndex) in optionItem.values"
              :key="valueIndex"
              >
              <image class="option_image"   mode="widthFix" :src="valueItem.images[0]">
            </view>
          </view> -->
        </template>
      </scroll-view>
    </view>
  </view>
</template>

<script>
import Bus from "@/utils/bus";
import { mapState, mapMutations } from "vuex";
import { hitSample } from "@/api/common.js";
import { changeDecimal } from "@/utils/utils";
import { exchangeRateList, tax, exchangeRate, countryList } from "@/api/third";
import GlassesType from "./GlassesType.vue";
import Option from "./Option.vue";
import NumberBox from "./NumberBox.vue";

import BigNumber from "bignumber.js";

export default {
  name: "ActionSheet",
  components: {
    GlassesType,
    Option,
    NumberBox,
  },
  props: {
    basicId: {
      type: [String, Number],
      default: "",
    },
    productsList: {
      type: Array,
      default: () => [],
    },
    base3d: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      isAnmate: false,
      totalVat: 0,
      totalDuties: 0,
      showTaxModle: false,
      isShowRateSelect: false,
      goodsNumber: 1,
      showDrawer: true,
      tabsList: [],
      styleCurrentId: "",
      LensCurrentId: "",
      selectedId: "",
      defaultSelectedId: "",
      currentModuleParameter: [],
      sampleInfo: {},

      isFirstHit: true,

      isNoLink: true,

      isTrue: true,

      currentParameterList: [], // 当前的parameterList

      number: 0,
      exchangeRateList: [],
      countryList: [],
      tax: {
        vat: -1,
        duty: -1,
        code: "Select",
        key: "Select",
      },
    };
  },
  mounted() {
    //this.exchangeRateList = exchangeRateList;

    Bus.$on("changePage", (page, index) => {
      this.handleNavChange(page + 1).then(() => {
        Bus.$emit("showInfo", index);
      });
    });
  },
  computed: {
    ...mapState({
      dotTrue: (state) => state.model.dotTrue,
      rate: (state) => state.model.rate,
      catergories: (state) => state.model.catergories,
      configuration: (state) => state.model.configuration,
      tabIndex: (state) => state.model.tabIndex,
      currency: (state) => state.model.currency,
      isInscribe: (state) => state.model.isInscribe,
      engravingIndex: (state) => state.model.engravingIndex,
      caseIndex: (state) => state.model.caseIndex,
    }),
    priceRate: function () {
      return changeDecimal(this.price, 2);
    },
    // 计算价格
    price() {},
    // 计算屏幕高度
    tabItemWith() {
      if (this.tabsList.length < 5) {
        if (this.tabsList.length == 2) {
          const width = "50%";
          return width;
        } else {
          const width = 100 / this.tabsList.length + "%";
          return width;
        }
      }
      return "";
    },
    style() {
      const style = {
        width: "100%",
        height: this.height
          ? this.getUnitValue(this.height)
          : this.getUnitValue(this.length),
        transform: `translate3D(0px, 70%,0px)`,
      };
      return style;
    },
  },
  watch: {
    "rate.value": function () {
      this.tax.vat = changeDecimal(this.totalVat * this.rate.value, 2);
      this.tax.duty = changeDecimal(this.totalDuties * this.rate.value, 2);
    },
    price() {
      this.confirmTax([
        {
          value: this.tax.code,
          label: this.tax.key,
        },
      ]);
    },
    // 监听下标值 更新眼镜样式
    randomBgIndex(val) {
      this.styleCurrentId = val;
      this.handleChangeColor(
        this.list[0],
        this.list[0].renderMode,
        this.list[0].parameterTagList[0].parameterList[val]
      );
    },
    // 监听AJ01以外的id值设置眼镜
    randomLensesIndex(val) {
      // this.defaultSelectedId = val
      this.list[1].parameterTagList[0].parameterList.forEach((item, index) => {
        if (item.parameterId === val) {
          this.handleSelectLens(
            this.list[1],
            this.list[1].parameterTagList[0],
            item
          );
        }
      });
    },
    // 监听AJ01以外的id值设置眼镜
    randomLensesIndexTwo(val) {
      // this.defaultSelectedId = val
      this.list[1].parameterTagList[1].parameterList.forEach((item, index) => {
        if (item.parameterId === val) {
          this.handleSelectLens(this.list[1], item);
        }
      });
    },

    tabIndex(val, oldVal) {
      val = val - 1;
      oldVal = oldVal - 1;
      if (val == this.engravingIndex && !this.isAnmate) {
        this.isAnmate = true;
        this.base3d.animateBack();
        if (this.isInscribe[0].isChoose.toLowerCase() == "no") {
          this.base3d.pointOpen = true;
          this.base3d.initPoint();
        } else {
          this.base3d.pointOpen = false;
        }
      } else if (
        val !== this.engravingIndex &&
        val !== this.caseIndex &&
        this.isAnmate
      ) {
        this.isAnmate = false;
        this.base3d.animateInit();
      }

      if (val == this.caseIndex) {
        this.base3d.animateShow();
      } else if (oldVal == this.caseIndex && val !== this.caseIndex) {
        this.base3d.unAnimateShow();
      }
    },
  },
  methods: {
    ...mapMutations("model", [
      "SET_COLOR_INFO",
      "SET_DEFAULT_LENS",
      "SET_LENS_LIST",
      "SET_SAMPLE_INFO",
      "SET_DOT_STATUS",
      "SET_DOT_TRUE",
      "SET_LENSES_LIST",
      "setTabIndex",
      "setConfiguration",
    ]),
    //判断加购项
    ifPurchased(listsIndex) {
      listsIndex = listsIndex - 1;
      if (
        (this.configuration.option_groups[
          listsIndex
        ].options[0].type.toLowerCase() === "image" &&
          !this.configuration.option_groups[listsIndex + 1]) ||
        (this.configuration.option_groups[
          listsIndex
        ].options[0].type.toLowerCase() === "image" &&
          this.configuration.option_groups[listsIndex + 1] &&
          this.configuration.option_groups[
            listsIndex + 1
          ].options[0].type.toLowerCase() === "text")
      ) {
        return true;
      } else {
        return false;
      }
    },

    async confirmTax(e) {
      let code = e[0].value;
      let selectItem = null;
      try {
        this.countryList.every((item) => {
          console.log("item", item);
          console.log("code", code);
          if (item.code === code) {
            selectItem = item;
            return false;
          }
          return true;
        });
        if (!selectItem) {
          return;
        }
        if (!selectItem.isSupport) {
          this.tax.code = selectItem.code;
          this.tax.key = selectItem.key;
          this.tax.vat = -1;
          this.tax.duty = -1;
          return;
        }

        let parameter = [
          {
            destinationCountry: code,
            externalId: this.sampleInfo.productId,
            orderCurrency: "USD",
            originCountry: "CN",
            transportationPrice: 0,
            hsCodeReplaceAllowed: false,
            goods: [
              {
                description: this.sampleInfo.sampleName,
                externalId: this.sampleInfo.productId,
                price: {
                  currency: "USD",
                  value: +this.price,
                },
                quantity: this.goodsNumber,
                weight: +this.sampleInfo.weight,
                hsCode: this.sampleInfo.hsCode,
              },
            ],
          },
        ];
        if (this.goodsList.length > 0) {
          this.goodsList.forEach((item) => {
            if (item.number > 0) {
              parameter[0].goods.push({
                description: item.sampleName,
                externalId: item.productId,
                price: {
                  currency: "USD",
                  value: +item.price,
                },
                quantity: item.number,
                weight: +item.weight,
                hsCode: item.hsCode,
              });
            }
          });
        }

        const res = await tax(parameter);
        if (
          res.totalVat >= 0 &&
          res.totalVat !== null &&
          res.totalDuties >= 0 &&
          res.totalDuties !== null
        ) {
          this.tax.key = selectItem.key;
          this.tax.code = selectItem.code;
          this.totalVat = res.totalVat;
          this.totalDuties = res.totalDuties;
          this.tax.vat = changeDecimal(res.totalVat * this.rate.value, 2);
          this.tax.duty = changeDecimal(res.totalDuties * this.rate.value, 2);
        } else {
          this.tax.vat = -1;
          this.tax.duty = -1;
        }
      } catch (e) {
        this.tax.vat = -1;
        this.tax.duty = -1;
        throw e;
      } finally {
        uni.hideLoading();
      }
    },
    handleSelectLens(row, item, item2) {
      if (item.parameterList) {
        if (this.defaultSelectedId === item2.parameterId) return;
        item.parameterList.forEach((item, index) => {
          if (item.parameterId === item2.parameterId) {
            this.LensCurrentId = item.parameterId;
          }
        });
        const defaultLensInfo = {
          ...item2,
        };
        defaultLensInfo.name = row.moduleName;
        this.selectedId = item.tagId;
        this.defaultSelectedId = item2.parameterId;
        this.isNoLink = false;
        // 设置镜片
        this.SET_DEFAULT_LENS(defaultLensInfo);
        this.SET_LENSES_LIST(row);
        this.SET_DOT_STATUS(true);
        this.$emit("handleChangeLens", item2.json);
        if (this.list[0].parameterTagList[0].parameterList.length <= 1) {
          this.getHitSampleInfo();
        }
      } else {
        if (this.defaultSelectedId === item.parameterId) return;
        const defaultLensInfo = {
          ...item,
        };
        this.selectedId = "";
        this.LensCurrentId = null;
        defaultLensInfo.name = row.moduleName;
        this.defaultSelectedId = item.parameterId;
        this.isNoLink = false;

        // 设置镜片
        this.SET_DEFAULT_LENS(defaultLensInfo);
        this.SET_LENSES_LIST(undefined);
        this.SET_DOT_STATUS(true);
        this.$emit("handleChangeLens", item.json);
        if (this.list[0].parameterTagList[0].parameterList.length <= 1) {
          this.getHitSampleInfo();
        }
      }
      this.number++;
      // console.log(this.number1)
      if (this.number <= 1) {
        uni.showLoading({
          title: "loading",
        });
        setTimeout(() => {
          uni.hideLoading();
        }, 400);
      }

      // this.handleChangeColor(this.list[1], this.list[1].renderMode, this.list[1].parameterList[val])
    },
    // 点击购买按钮
    async handleBuy() {
      uni.showLoading({
        title: "加载中",
      });
      try {
        const uniInput = document
          .getElementsByClassName("uni-input-input")[0]
          .removeAttribute("autocomplete");
        const moduleList = [];
        this.list.forEach((item, index) => {
          const moduleItem = {
            moduleId: item.moduleId,
            parameterList: [],
          };
          if (this.isNoLink) {
            this.currentModuleParameter.linkageModuleList.forEach((it) => {
              if (item.moduleId === it.moduleId) {
                it.linkageParameterList.forEach((itparam) => {
                  item.parameterTagList[0].parameterList.forEach(
                    (itemparam) => {
                      if (itemparam.parameterId === itparam.parameterId) {
                        moduleItem.parameterList.push({
                          parameterId: itemparam.parameterId,
                        });
                      }
                    }
                  );
                });
              }
            });

            item.parameterTagList[0].parameterList.forEach((it) => {
              if (this.currentModuleParameter.moduleId == item.moduleId) {
                if (this.currentModuleParameter.parameterId == it.parameterId) {
                  moduleItem.parameterList.push({
                    parameterId: it.parameterId,
                  });
                }
              }
            });
          } else {
            if (item.moduleName === "Frames Color") {
              item.parameterTagList[0].parameterList.forEach((it) => {
                if (this.currentModuleParameter.moduleId == item.moduleId) {
                  if (
                    this.currentModuleParameter.parameterId == it.parameterId
                  ) {
                    moduleItem.parameterList.push({
                      parameterId: it.parameterId,
                    });
                  }
                } else if (this.defaultSelectedId == it.parameterId) {
                  moduleItem.parameterList.push({
                    parameterId: it.parameterId,
                  });
                }
              });
            } else {
              item.parameterTagList.forEach((item2) => {
                item2.parameterList.forEach((item3, index) => {
                  if (this.LensCurrentId) {
                    if (this.LensCurrentId === item3.parameterId) {
                      moduleItem.parameterList.push({
                        parameterId: item3.parameterId,
                      });
                    }
                  } else {
                    if (item3.parameterId === this.defaultSelectedId) {
                      moduleItem.parameterList.push({
                        parameterId: item3.parameterId,
                      });
                    }
                  }
                });
              });
            }
          }

          // item.parameterList.forEach((it) => {
          // 	if (this.currentModuleParameter.moduleId == item.moduleId) {
          // 		if (this.currentModuleParameter.parameterId == it.parameterId) {
          // 			moduleItem.parameterList.push({
          // 				parameterId: it.parameterId
          // 			})
          // 		}
          // 	} else {
          // 		moduleItem.parameterList.push({
          // 			parameterId: it.parameterId
          // 		})
          // 	}

          // })
          moduleList.push(moduleItem);
        });

        let additionalGoodsList = [];

        this.goodsList.forEach((item) => {
          if (item.number > 0) {
            const additionalGoodsItem = {
              additionalSampleId: item.sampleId,
              additionalGoodsQuantity: item.number,
            };
            additionalGoodsList.push(additionalGoodsItem);
          }
        });

        const params = {
          hitType: 3,
          basicStyleId: this.basicId,
          moduleList,
          quantity: this.goodsNumber,
          additionalGoodsLst: additionalGoodsList,
        };
        const res = await hitSample(params);

        // console.log(res)
        // debugger
        if (res.checkoutUrl) {
          uni.showToast({
            icon: "none",
            title: "success",
          });
          window.location.href = res.checkoutUrl;
          sessionStorage.setItem("configNumber", 1);
        }
        // window.location.replace(res.checkoutUrl)
      } catch (e) {
        throw e;
      } finally {
        uni.hideLoading();
      }
    },
    async getHitSampleInfo() {
      try {
        const moduleList = [];
        this.list.forEach((item, index) => {
          const moduleItem = {
            moduleId: item.moduleId,
            parameterList: [],
          };
          if (this.isNoLink) {
            this.currentModuleParameter.linkageModuleList.forEach((it) => {
              if (item.moduleId === it.moduleId) {
                it.linkageParameterList.forEach((itparam) => {
                  item.parameterTagList[0].parameterList.forEach(
                    (itemparam) => {
                      if (itemparam.parameterId === itparam.parameterId) {
                        moduleItem.parameterList.push({
                          parameterId: itemparam.parameterId,
                        });
                      }
                    }
                  );
                });
              }
            });
            item.parameterTagList[0].parameterList.forEach((it) => {
              if (this.currentModuleParameter.moduleId == item.moduleId) {
                if (this.currentModuleParameter.parameterId == it.parameterId) {
                  moduleItem.parameterList.push({
                    parameterId: it.parameterId,
                  });
                }
              }
            });
          } else {
            if (item.moduleName === "Frames Color") {
              item.parameterTagList[0].parameterList.forEach((it) => {
                if (this.currentModuleParameter.moduleId == item.moduleId) {
                  if (
                    this.currentModuleParameter.parameterId == it.parameterId
                  ) {
                    moduleItem.parameterList.push({
                      parameterId: it.parameterId,
                    });
                  }
                } else if (this.defaultSelectedId == it.parameterId) {
                  moduleItem.parameterList.push({
                    parameterId: it.parameterId,
                  });
                }
              });
            } else {
              item.parameterTagList.forEach((it) => {
                it.parameterList.forEach((it2) => {
                  if (this.currentModuleParameter.moduleId == item.moduleId) {
                    if (
                      this.currentModuleParameter.parameterId == it2.parameterId
                    ) {
                      moduleItem.parameterList.push({
                        parameterId: it2.parameterId,
                      });
                    }
                  } else if (this.defaultSelectedId == it2.parameterId) {
                    moduleItem.parameterList.push({
                      parameterId: it2.parameterId,
                    });
                  }
                });
              });
            }
            // item.parameterTagList[0].parameterList.forEach((it) => {
            // 	if (this.currentModuleParameter.moduleId == item.moduleId) {
            // 		if (this.currentModuleParameter.parameterId == it.parameterId) {
            // 			moduleItem.parameterList.push({
            // 				parameterId: it.parameterId
            // 			})
            // 		}
            // 	} else if (this.defaultSelectedId == it.parameterId) {
            // 		moduleItem.parameterList.push({
            // 			parameterId: it.parameterId
            // 		})
            // 	}

            // })
          }

          moduleList.push(moduleItem);
        });

        const params = {
          hitType: 1,
          basicStyleId: this.basicId,
          moduleList,
        };

        const res = await hitSample(params);
        this.sampleInfo = res;
        this.SET_SAMPLE_INFO(res);
        this.$emit("setSampleInfo", res);
      } catch (e) {
        throw e;
      } finally {
      }
    },
    // 修改颜色
    handleChangeColor(row, renderMode, item) {
      // console.log(row)
      this.currentParameterList = [];
      // console.log(this.list)
      if (item.linkageModuleList && item.linkageModuleList.length > 0) {
        this.list.forEach((listItem) => {
          item.linkageModuleList.forEach((it) => {
            if (listItem.moduleId === it.moduleId) {
              it.linkageParameterList.forEach((itparam) => {
                listItem.parameterTagList[0].parameterList.forEach(
                  (itemparam) => {
                    if (itemparam.parameterId === itparam.parameterId) {
                      this.defaultSelectedId = itparam.parameterId;
                      this.currentParameterList.push(itemparam);
                      const defaultLensInfo = {
                        ...itemparam,
                      };
                      defaultLensInfo.name = listItem.moduleName;
                      // 设置镜片
                      this.SET_DEFAULT_LENS(defaultLensInfo);
                      this.SET_LENSES_LIST(undefined);
                      this.isNoLink = true;
                    }
                  }
                );
              });
            }
          });
        });
      } else {
        this.currentParameterList = this.list[1].parameterTagList;

        if (this.isTrue) {
          this.list[1].parameterTagList.forEach((item) => {
            item.parameterList.forEach((item2) => {
              if (item2.isDefault) {
                this.selectedId = item.tagId;
                this.defaultSelectedId = item2.parameterId;
                const defaultLensInfo = {
                  ...item2,
                };
                defaultLensInfo.name = this.list[1].moduleName;
                this.SET_DEFAULT_LENS(defaultLensInfo);
                this.SET_LENSES_LIST(this.list[1]);
              }
            });
          });
        }
        this.isNoLink = false;
      }

      if (this.currentModuleParameter.parameterId == item.parameterId)
        return false;
      this.$nextTick(() => {
        this.$emit("handleChangeColor", item.json);

        const colorItem = {
          name: row.moduleName,
          renderMode,
          value: item.colorValue,
          parameterDispalyImage: item.parameterDispalyImage,
          parameterName: item.parameterName,
        };

        this.currentModuleParameter = item;
        this.currentModuleParameter.moduleId = row.moduleId;

        // this.currentParameterList.forEach((it) => {
        // debugger
        // console.log('it')

        // })
        // 设置镜片
        if (this.isTrue) {
          if (item.linkageModuleList && item.linkageModuleList.length > 0) {
            this.$emit("handleChangeLens", this.currentParameterList[0].json);
            this.isTrue = true;
          } else {
            this.currentParameterList.forEach((item) => {
              item.parameterList.forEach((item2, index) => {
                if (item2.isDefault) {
                  this.LensCurrentId = item2.parameterId;
                  this.$emit("handleChangeLens", item2.json);
                }
              });
            });
            this.isTrue = false;
          }
        }
        // 设置颜色
        this.SET_COLOR_INFO(colorItem);
        this.getHitSampleInfo();
        if (!this.isFirstHit) {
          if (!this.dotTrue) {
            // 修改状态
            this.SET_DOT_STATUS(true);
          }
          this.SET_DOT_TRUE(false);
        } else {
          this.isFirstHit = false;
        }
      });
    },

    handleSelectedStyle(index) {
      this.styleCurrentId = index;
    },
    handleNavChange(index) {
      return new Promise((reslove) => {
        if (index == 0) {
          document
            .querySelector(".action-sheet-wrap_scroll")
            .classList.add("scroll_autoHeight");
        } else {
          let group_index = index - 1;
          if (
            this.configuration.option_groups[group_index].options.length > 1
          ) {
            document
              .querySelector(".action-sheet-wrap_scroll")
              .classList.add("scroll_autoHeight");
          } else if (
            this.configuration.option_groups.length - 1 == group_index &&
            this.configuration.related_variants &&
            this.configuration.related_variants.length > 0
          ) {
            document
              .querySelector(".action-sheet-wrap_scroll")
              .classList.add("scroll_autoHeight");
          } else {
            document
              .querySelector(".action-sheet-wrap_scroll")
              .classList.remove("scroll_autoHeight");
          }
        }
        this.setTabIndex(index);
        reslove("Yes");
      });
    },
    computeOptionIndex(listsIndex, termlistsIndex) {
      let optionIndex = 0;
      listsIndex = listsIndex - 1;
      for (let i = 0; i < listsIndex; i++) {
        optionIndex += this.configuration.option_groups[i].options.length;
      }

      optionIndex += termlistsIndex;
      //optionIndex ;

      return {
        listsIndex,
        termlistsIndex,
        optionIndex,
      };
    },
    UpChange(e, index) {
      this.SET_DOT_STATUS(true);
      let configuration = Object.assign({}, this.configuration);
      configuration["related_variants"][index].number = e.value;
      this.setConfiguration(configuration);
    },
    // 判断传入的值，是否带有单位，如果没有，就默认用rpx单位
    getUnitValue(val) {
      if (/(%|px|rpx|auto)$/.test(val)) return val;
      else return val + "rpx";
    },
    // 此处的原理是，关闭时先通过动画隐藏弹窗和遮罩，再移除整个组件
    // 打开时，先渲染组件，延时一定时间再让遮罩和弹窗的动画起作用
    change(param1, param2, status) {
      // 如果this.popup为false，意味着为picker，actionsheet等组件调用了popup组件
      if (this.popup == true) {
        this.$emit("input", status);
      }
      this[param1] = status;
      if (status) {
        // #ifdef H5 || MP
        this.timer = setTimeout(() => {
          this[param2] = status;
          this.$emit(status ? "open" : "close");
        }, 50);
        // #endif
        // #ifndef H5 || MP
        this.$nextTick(() => {
          this[param2] = status;
          this.$emit(status ? "open" : "close");
        });
        // #endif
      } else {
        this.timer = setTimeout(() => {
          this[param2] = status;
          this.$emit(status ? "open" : "close");
        }, this.duration);
      }
    },
    toggleActionSheet(e) {
      e.preventDefault();

      if (this.showDrawer) {
        this.change("showDrawer", "visibleSync", false);
      } else {
        this.change("visibleSync", "showDrawer", true);
      }
    },
  },
};
</script>

<style scoped lang="scss">
* {
  font-family: PoppinsRegular;
}

.action-sheet-wrap {
  background: #fbfbfb;

  .action-sheet-wrap_scroll {
    // height: auto;

    &.scroll_autoHeight {
      height: auto;
    }
  }

  .title {
    font-weight: bold;
    color: #000;
    margin-bottom: 20rpx;
  }

  .scroll-view_H {
    white-space: nowrap;
    width: 100%;
    height: 100%;

    &::-webkit-scrollbar {
      height: 3rpx;
    }
  }

  .scroll-view-item_H {
    height: 100%;
    width: 33.3%;
    display: inline-block;

    .option {
      display: flex;
      margin: auto;
      flex-direction: column;
      flex-wrap: nowrap;
      justify-content: center;
      align-content: center;
      align-items: center;
      // flex-basis: 25%;
      font-weight: bold;

      uni-image {
        width: 130rpx;
        height: 130rpx;
        margin-bottom: 0;
      }

      uni-text {
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        display: inline-block;
        vertical-align: middle;
        max-width: 200rpx;
      }
    }
  }

  .frames {
    padding: 40rpx 70rpx;
  }

  .option_wrap {
    display: flex;

    .option_item {
      display: inline-flex;
      margin: auto;

      & + .option_item {
        margin-left: 20rpx;
      }
    }
  }

  .option-wrap {
    display: flex;
    overflow: scroll;

    flex-direction: row;
    align-content: center;
    align-items: center;
    height: 100%;

    .option + .option {
      margin-left: 0rpx;
    }
  }
}

.container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 133rpx 55rpx 0 55rpx;
  height: 100%;
  box-sizing: border-box;

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

  .statement-text {
    color: #c3c3c3;
    font-size: 22rpx;
    padding-bottom: 42rpx;
    word-break: break-all;
  }

  .logo {
    width: 286rpx;
    height: 56rpx;
    text-align: center;
    margin-bottom: 47rpx;
  }

  .sample-selected-wrap {
    padding-bottom: 46rpx;
    border-bottom: 1rpx solid #e2e4e8;
  }

  .sample-cover {
    // width: 244rpx !important;
    // height: 244rpx !important;
    margin-left: 40rpx;
    background: #f2f2f2;
    border-radius: 6rpx;
  }

  .style-wrap {
    margin-left: 40rpx;
    box-sizing: border-box;

    .style-item-wrap {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      // align-items: center;

      .bg-color {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 70rpx;
        height: 70rpx;
        border-radius: 50%;
        // border: 4rpx solid #FFFFFF;
        transition: all 0.4s;
      }

      .color-666 {
        color: #666;
      }

      .style-item-image {
        width: 70rpx;
        height: 70rpx;
        border-radius: 50%;
      }
    }

    .style-item-wrap:not(:last-child) {
      margin-bottom: 29rpx;
    }
  }

  .content {
    padding: 35rpx;

    .title {
      font-size: 30rpx;
      color: #000;
      margin-bottom: 26rpx;
      line-height: 36rpx;
    }
  }

  .content {
    // padding: 20rpx 30rpx 20rpx 30rpx;

    .optional-item-wrap {
      display: flex;
      justify-content: space-between;
      align-items: center;

      font-size: 28rpx;
      color: #666;

      .optional-content {
        display: flex;
        justify-content: space-between;
        flex-direction: column;
        height: 100rpx;
        padding: 10rpx 20rpx 6rpx 0;
      }

      .cover {
        flex: 0 0 100rpx;
        width: 100rpx !important;
        height: 100rpx !important;
        border-radius: 6rpx;
        background: #f2f2f2;

        image {
          width: 100%;
          height: 100%;
        }
      }

      .price {
        color: #df5641;
      }

      .unit {
        font-size: 24rpx;
        color: #999;
        margin-left: 6rpx;
      }
    }

    .optional-item-wrap:not(:last-child) {
      margin-bottom: 20rpx;
    }
  }
}
</style>
