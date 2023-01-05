<template>
  <view class="option">
    <!-- 眼镜框展示图 -->
    <template v-if="data.type === 'image'">
		
      <view
        v-show="
          options.options[optionIndex.optionIndex] <
          configuration.options[optionIndex.optionIndex].values.length
        "
        class="title_wrapper"
      >
        <text class="title">{{ data.name.en }} </text>
        <text
          :class="{
            valueLong:
              configuration.options[optionIndex.optionIndex].values[
                options.options[optionIndex.optionIndex]
              ].price &&
              configuration.options[optionIndex.optionIndex].values[
                options.options[optionIndex.optionIndex]
              ].price[currency.code] &&
              !!`+${currency.symbol}${changeDecimal(
                configuration.options[optionIndex.optionIndex].values[
                  options.options[optionIndex.optionIndex]
                ].price[currency.code]
              )}`,
          }"
          class="value"
        >
          {{
            configuration.options[optionIndex.optionIndex].values[
              options.options[optionIndex.optionIndex]
            ] &&
            configuration.options[optionIndex.optionIndex].values[
              options.options[optionIndex.optionIndex]
            ].name.en
          }}
        </text>

        <text
          v-if="
            configuration.options[optionIndex.optionIndex].values[
              options.options[optionIndex.optionIndex]
            ] &&
            configuration.options[optionIndex.optionIndex].values[
              options.options[optionIndex.optionIndex]
            ].price &&
            configuration.options[optionIndex.optionIndex].values[
              options.options[optionIndex.optionIndex]
            ].price[`${currency.code}`]
          "
          class="price"
        >
          + {{ currency.symbol
          }}{{
            changeDecimal(
              configuration.options[optionIndex.optionIndex].values[
                options.options[optionIndex.optionIndex]
              ].price[`${currency.code}`]
            )
          }}
        </text>
      </view>

      <view
        v-show="
          options.options[optionIndex.optionIndex] <
          configuration.options[optionIndex.optionIndex].values.length
        "
        class="option_list"
      >
        <scroll-view :scroll-x="true" :scroll-y="false" class="scroll-x">
          <view
            @click="chooseButton(index2)"
            class="option_imageWrapper"
            :class="{
              option_imageWrapper_active:
                options.options[optionIndex.optionIndex] === index2,
            }"
            v-for="(item2, index2) in data.values"
            :key="index2"
          >
            <image
              style="width: 84rpx; height: 84rpx"
              class="option_image"
              mode="aspectFill"
              :src="item2.images[0]"
            ></image>
          </view>
        </scroll-view>
      </view>
	  
    </template>
	
	<template v-if="data.type === 'text'">
		<WriteInfo :data="data" :pages="optionIndex.optionIndex" />
	</template>
  </view>
</template>

<script>
import Bus from "@/utils/bus";
import { mapState, mapMutations } from "vuex";
import { changeDecimal, calculate_delivery_time } from "@/utils/utils.js";
	import WriteInfo from "./WriteInfo.vue"
export default {
  props: ["data", "optionIndex"],
  data() {
    return {};
  },
  components:{WriteInfo},
  computed: {
    ...mapState({
      options: (state) => state.model.options,
      optionSpec: (state) => state.model.optionSpec,
      configuration: (state) => state.model.configuration,
      currency: (state) => state.model.currency,
    }),
  },
  watch: {},
  mounted() {},
  beforeUpdate() {},
  //   beforeDestroy() {
  //     Bus.$off("optionButton");
  //     Bus.$off("colorButton");
  //   },
  methods: {
    ...mapMutations("model", [
      "setOptionSpec",
      "setOptions",
      "setDelivery_date",
    ]),
    chooseButton(index) {
      let options = JSON.parse(JSON.stringify(this.options));
      options.options[this.optionIndex.optionIndex] = index;
      this.setOptions(options);
      Bus.$emit("optionButton", options);
      const delivery_date = calculate_delivery_time(
        this.configuration,
        options.options
      );
      this.setDelivery_date(delivery_date);
      //this.setInfoIcon(true);
    },
    changeDecimal(number, bitNum) {
      return changeDecimal(number, bitNum);
    },
  },
};
</script>

<style lang="scss" scoped>
.scroll-x {
  overflow-x: auto;
}

.option {
  padding: 0rpx;
  padding-bottom: 0;
  .title_wrapper {
    padding-top: 34rpx;
    padding-left: 34rpx;
    .value {
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      display: inline-block;
      vertical-align: middle;
      max-width: 400rpx;
    }
    .value.valueLong {
      max-width: 300rpx;
    }
    .price {
      position: absolute;
      right: 34rpx;
    }
  }
  .title {
    font-weight: bold;
    margin-right: 10rpx;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    display: inline-block;
    vertical-align: middle;
    max-width: 120px;
    width: 120px;
  }
  .option_imageWrapper:first-of-type {
    margin-left: 34rpx;
  }
  .option_imageWrapper:last-of-type {
    margin-right: 34rpx;
  }
  .option_imageWrapper {
    width: 92rpx;
    border: 4rpx solid transparent;
    margin: auto;
    display: inline-flex;
    .option_image {
      width: 100%;
    }
    & + .option_imageWrapper {
      margin-left: 20rpx;
    }
  }
  .option_imageWrapper_active {
    border: 4rpx solid #fff;
    border-radius: 50%;
    box-shadow: 0 5px 9px 0 #0000002e;
    position: relative;
  }
  .option_imageWrapper_active::before {
    content: "";
    background-image: url("@/static/icon/icon-check.png");
    z-index: 1;
    position: absolute;
    background-position: center;
    background-size: 40rpx 28rpx;
    background-repeat: no-repeat;
    width: 100%;
    text-align: center;
    height: 100%;
  }
  .option_list {
    display: flex;
    white-space: nowrap;
    margin-top: 20rpx;
    /deep/.uni-scroll-view-content {
      padding-bottom: 16rpx;
    }
  }
}
</style>
