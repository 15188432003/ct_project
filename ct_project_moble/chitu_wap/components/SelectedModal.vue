<template>
  <u-popup
    v-model="dialogVisible"
    mode="center"
    width="655"
    height="1037rpx"
    border-radius="8"
    closeable
  >
    <view class="container">
      <view class="u-flex sample-selected-wrap">
        <scroll-view class="style-wrap">
          <view class="margin-bottom-48" style="width: 100%">
            <view class="Poppins-Bold font-size-16 color-333333">FRAMES:</view>
            <view>
              <view
                class="font-size-16 color-666666 name"
                :title="
                  configuration && configuration.name && configuration.name.en
                "
              >
                {{
                  configuration && configuration.name && configuration.name.en
                }}
              </view>
            </view>
          </view>
          <view
            class="style-item-wrap"
            v-for="(item, index) in imageList"
            :key="index"
          >
            <view
              :class="{
                name: true,
                name_long:
                  item.values[options.options[index]] &&
                  item.values[options.options[index]].price &&
                  item.values[options.options[index]].price[currency.code],
              }"
              v-show="item.values[options.options[index]]"
              >{{ item.name.en }}:
              <view
                v-if="
                  item.values[options.options[index]] &&
                  item.values[options.options[index]].price &&
                  item.values[options.options[index]].price[currency.code]
                "
                class="price"
                >+
                {{ currency.symbol }}
                {{
                  changeDecimal(
                    item.values[options.options[index]].price[currency.code]
                  )
                }}
              </view>
            </view>
            <text class="color-666 margin-bottom-48">
              {{
                item.values[options.options[index]] &&
                item.values[options.options[index]].name
                  ? item.values[options.options[index]].name.en
                  : ""
              }}
            </text>
          </view>
          <template v-if="textList">
            <div
              class="margin-bottom-48"
              v-for="(item, index) in textList"
              :key="item.group_index"
            >
              <div
                class="Poppins-Bold font-size-16 color-333333"
                style="position: relative"
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

          <!-- 					<view class="engraving margin-bottom-48" v-if="glassesInscribe.isInscribe == 'Yes'">
						<view>ENGRAVING <view class="price">+ $ 10.00</view>
						</view>
						<view>Lenses Engraving:{{glassesInscribe.isInscribe}}</view>
						<view>Write Your Engraving:{{glassesInscribe.text}}</view>
					</view>
					<view class="case" v-if="mirrorBox.isInscribe == 'Yes'">
						<view>Case <view class="price">+ $ 10.00</view>
						</view>
						<view>Case Engraving:{{mirrorBox.isInscribe}}</view>
						<view>Write Your Engraving:{{mirrorBox.text}}</view>
					</view> -->
          <!-- <view class="style-item-wrap">
            <view>{{ configuration.name }}:</view>
            <view v-if="lensesList" class="color-666">
              <view
                v-for="(item, index) in lensesList.parameterTagList"
                :key="index"
              >
                {{ item.tagId === null ? "" : item.tagName + "/" }}
              </view>
            </view>
            <view class="color-666">
              {{ configuration.parameterName }}
            </view>
          </view> -->
        </scroll-view>
        <!-- <u-image
          :src="sampleInfo.image"
          class="sample-cover"
          :width="244"
          :height="244"
          v-if="sampleInfo.image"
        >
          <u-loading slot="loading"></u-loading>

          <view slot="error">
            <u-image
              src="@/static/icon/photo.jpg"
              :width="244"
              :height="244"
            ></u-image>
          </view>
        </u-image>
        <view class="" v-else> </view> -->
      </view>

      <!-- 加购商品的信息 -->
      <!-- <view class="content" v-if="false">
        <view class="title">You may also need</view>
        <scroll-view scroll-y="true" style="height: 340rpx">
          <view class="optional-wrap">
            <view
              class="optional-item-wrap"
              v-for="(item, index) in lensList"
              :key="index"
            >
              <view class="u-flex">
                <u-image
                  :src="item.productImage"
                  class="cover"
                  :width="55"
                  :height="55"
                >
                  <u-loading slot="loading"></u-loading>
                </u-image>
                <view class="u-flex-1 u-m-l-26 optional-content u-row-between">
                  <view class="u-line-2">{{ item.productName }}</view>
                  <view class="u-flex">
                    <view class="price">${{ item.price }}</view>
                    <view class="unit"
                      ><text class="u-font-30">/</text>{{ item.unit }}</view
                    >
                  </view>
                </view>
              </view>

              <view>X{{ item.number }}</view>
            </view>
          </view>
        </scroll-view>
      </view> -->

      <view class="statement-text">
        The model is for reference only. Actual product may vary due to product
        enhancement.
      </view>
    </view>
  </u-popup>
</template>

<script>
import { getBasicstylesList } from "@/api/common.js";
import { mapState } from "vuex";
import { mapMutations } from "vuex";

import { changeDecimal } from "@/utils/utils.js";
export default {
  props: {
    value: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
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
      imageList: null,
      textList: null,
    };
  },
  computed: {
    ...mapState({
      dotStatus: (state) => state.model.dotStatus,
      rate: (state) => state.model.rate,
      configuration: (state) => state.model.configuration,
      options: (state) => state.model.options,
      tabIndex: (state) => state.model.tabIndex,
      optionSpec: (state) => state.model.optionSpec,
      currency: (state) => state.model.currency,
      engravingIndex: (state) => state.model.engravingIndex,
      caseIndex: (state) => state.model.caseIndex,
      isInscribe: (state) => state.model.isInscribe,
    }),
    dialogVisible: {
      get() {
        return this.value;
      },
      set(newVal) {
        this.$emit("input", newVal);
      },
    },
  },
  watch: {
    dialogVisible(value) {
      this.SET_DOT_STATUS(false);
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

        // console.log(this.textList[0].values[this.options.options[this.textList[0].group_index]].price[this.currency.code]);
        // console.log(isInscribe);
      },
    },
  },
  methods: {
    ...mapMutations("model", ["SET_DOT_STATUS"]),
    changeDecimal(number, bitNum) {
      return changeDecimal(number, bitNum);
    },
  },
};
</script>

<style scoped lang="scss">
* {
  font-family: PoppinsRegular;
}

.margin-bottom-48 {
  margin-bottom: 48rpx;
}

.container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 133rpx 55rpx 0 55rpx;
  height: 100%;
  box-sizing: border-box;

  .name {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

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
    //border-bottom: 1rpx solid #e2e4e8;
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
      margin-top: 10px;
      position: relative;

      .name {
        max-width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        display: inline-block;
      }

      .name_long {
        max-width: 140px;
      }

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
        max-width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        display: inline-block;
      }

      .style-item-image {
        width: 70rpx;
        height: 70rpx;
        border-radius: 50%;
      }

      .price {
        position: absolute;
        right: 0;
        top: 0;
        color: #df5641;
        display: inline-block;
      }
    }

    .style-item-wrap:not(:last-child) {
      margin-bottom: 29rpx;
    }
  }

  .engraving,
  .case {
    position: relative;
  }

  .content {
    margin-top: 44rpx;

    .title {
      font-size: 30rpx;
      color: #000;
      margin-bottom: 26rpx;
      line-height: 36rpx;
    }
  }

  .optional-wrap {
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

  .price {
    position: absolute;
    right: 0;
    top: 0;
    color: #df5641;
    display: inline-block;
  }

  .price {
    position: absolute;
    right: 0;
    top: 0;
    color: #df5641;
    display: inline-block;
  }
}
</style>
