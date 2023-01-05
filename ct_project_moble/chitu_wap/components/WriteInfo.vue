<template>
	<view class="write_info">
		<text class="title">{{data.name.en}}</text>
		<view class="write_or">
			<view class="write_option" v-for="(item,index) in values" @click="writeOn(index)"
				:class="{ active:index == page }">
				<text>{{ item.text.en }}</text>
				<text v-if="item.price && item.price[currency.code]" class="write_money">+ {{ currency.symbol
              }}{{ changeDecimal(item.price[currency.code]) }}</text>
				<u-icon v-show="index == page" name="checkmark" color="#000" size="50"></u-icon>
			</view>

			<template v-if="page == 1">
				<text class="title">Write your engraving</text>
				<view class="write_here" :class="{ written_warning: showInfo }">
					<input v-model="writeContent" type="text" @blur="focusChange"
						:placeholder="showInfo ? 'Please input the engraving text.' : ''">
					<u-icon class="icons" v-show="showInfo" name="info-circle" color="red" size="28"></u-icon>
					<text v-if="carving" class="write_length">{{writeContent.length}}/12</text>
					<text v-else class="write_length">{{writeContent.length}}/11</text>
				</view>
				<view class="write_hint">
					<u-icon name="info-circle" color="#c3c3c3" size="30"></u-icon>
					You can only enter numbers, letters, special characters or spaces in the middle
				</view>

			</template>

		</view>
	</view>
</template>

<script>
	import Bus from "@/utils/bus";
	import {
		changeDecimal,
		calculate_delivery_time
	} from "@/utils/utils.js";
	import {
		mapMutations,
		mapState
	} from "vuex"
	export default {
		name: "WriteInfo",
		data() {
			return {
				writeShow: false,
				writeContent: '',
				time: null,
				showInfo: false,
				values: [],
				page: 0,
				carving: true,
				carvingIndex: 0
			};
		},
		props: {
			data: {
				type: Object,
				default: () => {
					return {}
				}
			},
			pages: Number
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

			if (this.isInscribe[this.carvingIndex].isChoose.toLowerCase() == "yes") {
				this.page = 1,
					this.writeContent = this.isInscribe[this.carvingIndex].text
			}
		},
		computed: {
			...mapState({
				tabIndex: (state) => state.model.tabIndex,
				glassesInscribe: (state) => state.model.glassesInscribe,
				mirrorBox: (state) => state.model.mirrorBox,
				isInscribe: (state) => state.model.isInscribe,
				engravingIndex: (state) => state.model.engravingIndex,
				caseIndex: (state) => state.model.caseIndex,
				currency: (state) => state.model.currency,
				options: (state) => state.model.options,
				configuration: (state) => state.model.configuration,
			})
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

		methods: {
			...mapMutations('model', ["setOptions",
				"setDelivery_date",
				"setIsInscribe",
			]),
			writeOn(index) {

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
					this.writeContent = "";
				} else {
					const newIsInscribe = this.isInscribe;
					newIsInscribe[this.carvingIndex].isChoose = "Yes";
					newIsInscribe[this.carvingIndex].text = "";
					if (!this.carving) {
						Bus.$emit("changMirrorBoxShow", true);
					}
					this.setIsInscribe(newIsInscribe);
				}
				this.page = index;
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
			},
			changeDecimal(number, bitNum) {
				return changeDecimal(number, bitNum);
			},
			ltrim(s) {
				return s.replace(/(^\s*)/g, "");
			},
			focusChange() {
				this.writeContent = this.writeContent.trim()
			}
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
			writeContent(newVal, oldVal) {
				let regText;
				if (this.carving) {
					regText =
						/^[A-Za-z0-9`~!@#$%^&*()_\-+=<>?:"|./;'\\·~@#￥%……&*[\]\s——\-+=|《》{}？：“”、；‘'，。、]{0,12}$/g;
				} else {
					regText =
						/^[A-Za-z0-9`~!@#$%^&*()_\-+=<>?:"|./;'\\·~@#￥%……&*[\]\s——\-+=|《》{}？：“”、；‘'，。、]{0,11}$/g;
				}
				let textTest = regText.test(newVal);
				if (!textTest) {
					this.$nextTick(() => {
						this.writeContent = oldVal
					})
				} else {
					//判断未填写警告
					if (this.showInfo) {
						if (newVal) {
							this.showInfo = false
						}
					}
					if (this.time) {
						clearTimeout(this.time)
					}
					this.time = setTimeout(() => {
						if (this.page == 1 && this.writeContent != this.isInscribe[this.carvingIndex].text) {
							this.writeContent = this.ltrim(newVal)
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
			}
		},
		beforeDestroy() {
			Bus.$off("showInfo")
		}
	}
</script>

<style lang="scss">
	.write_info {
		padding: 22rpx 38rpx;

		.write_or {
			margin-top: 30rpx;

			.write_option {
				height: 100rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;
				border: 1px solid rgba(170, 170, 170, 1);
				border-radius: 10rpx;
				position: relative;
				word-wrap: break-word;
				background: #fff;
				margin-bottom: 20rpx;
				padding: 6rpx 20rpx 6rpx 20rpx;

				.write_money {
					position: absolute;
					right: 20rpx;
				}
			}

			.write_here {
				height: 100rpx;
				margin: 30rpx 0 20rpx 0;
				position: relative;

				input {
					box-sizing: border-box;
					padding: 6rpx 4rpx 6rpx 20rpx;
					height: 100%;
					width: 100%;
					border: 1px solid rgba(170, 170, 170, 1);
					border-radius: 10rpx;
					font-size: 28rpx;
				}

				.icons {
					position: absolute;
					left: 11rpx;
					top: 50%;
					transform: translateY(-50%);
					display: none;
					font-size: 28rpx !important;
				}

				.write_length {
					position: absolute;
					right: 30rpx;
					top: 50%;
					transform: translateY(-50%);
					color: #c3c3c3;
				}
			}

			.written_warning {
				input {
					padding: 6rpx 4rpx 6rpx 50rpx;
					border-color: red;
				}

				.icons {
					display: block;
				}
			}

			.write_hint {
				color: #c3c3c3;
				padding: 0 0 0 6rpx;

			}
		}

		.title {
			font-weight: bold;
			color: #000;
			margin-bottom: 20rpx;
		}
	}

	.active {
		.write_money {
			right: 100rpx !important;
		}
	}
</style>
