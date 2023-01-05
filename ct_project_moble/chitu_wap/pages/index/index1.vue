<template>
	<view class="container" scroll-y="true">
		<view class="header-wrap">
			<!-- 打开其他眼镜弹窗 -->
			<view class="nav-wrap">
				<!-- <u-icon name="home" size="38"></u-icon> -->
				<image class="icon-home" src="@/static/icon/icon-home.png" @click="linkTohome"></image>

				<u-image src="@/static/icon/rokitlife.png" class="logo" :width="135" :height="76">
					<u-loading slot="loading"></u-loading>

					<view slot="error">
						<u-image src="@/static/icon/photo.jpg" :width="244" :height="244"></u-image>
					</view>
				</u-image>

				<u-select confirm-color="#001D7C" confirm-text="Confirm" cancel-text="Cancel" v-model="isShowRate"
					:list="currencyList" value-name="code" label-name="code" @confirm="confirmRate"></u-select>

				<!-- <view @click="() => (isShowClassesModal = true)">
          <text class="u-m-r-24">CHANGE STYLE</text>
          <u-icon name="arrow-up"></u-icon>
        </view> -->
				<view v-if="currencyList.length > 0" class="rateButton" @click="() => (isShowRate = true)">
					<text class="u-m-r-24">{{ currency.code }}</text>
					<u-icon name="arrow-up"></u-icon>
				</view>
			</view>

			<view class="u-flex u-row-between header-content">
				<!-- 命中样本名 -->
				<view class="specs">
					<text class="text">{{ configuration.variantName || "-" }}</text>
					<!-- <text>{{ sampleInfo.sampleDescription }}</text> -->
				</view>

				<view class="operation-wrap">
					<!-- 查看详细信息 -->
					<view class="btn" @click="() => (isShowSelectedModal = true)">
						<u-badge bgColor="#DF5641" :is-dot="true" v-if="dotStatus" :offset="[-0, -0]">
						</u-badge>
						<image src="@/static/icon/icon-btn-edit.png" mode=""></image>
					</view>
				</view>
			</view>

			<view v-if="currencyList.length > 0" class="u-flex u-row-between header-content priceContent">
				<view class="specs">
					<text class="text price"> {{ currency["symbol"] }}{{ price }}</text>
				</view>

				<!-- 点击移动镜框 -->
				<view class="operation-wrap">
					<view class="btn" @click="GoLens" v-if="configuration.lensSeparation === '是'">
						<image src="@/static/icon/icon-lens.png" mode=""></image>
					</view>
				</view>
			</view>

			<view v-if="currencyList.length > 0" class="u-flex u-row-between header-content">
				<view class="specs">
					<text class="text vat">VAT & Duty included.</text>
				</view>
			</view>
		</view>

		<view class="delivery">
			<text>{{ delivery_date }}</text>
		</view>

		<view class="scene" id="scene">
			<view id="scenes">
				<view class="point_fixed" v-if="engravingIndex">
					<view class="label">
						<div class="ponit_flashing"></div>
					</view>
					<view class="text"> Lettering position </view>
				</view>
			</view>
			<view id="mirror_box">
				<image class="mirror_box_img" v-show="!MirrorBoxTextShow" src="../../static/Mirrorbox.png"></image>
				<image class="mirror_box_img" v-show="MirrorBoxTextShow" src="../../static/Mirrorbox_space.png"></image>
				<div v-show="MirrorBoxTextShow" class="mirror_box_cover">
					<p style="white-space: pre" class="mirror_box_text">
						{{ MirrorBoxText }}
					</p>
				</div>
			</view>
		</view>
		<!-- 初始化加载等待页 -->
		<!-- !progressInfo.isReady -->
		<view class="model-progress" v-if="!progressInfo.isReady">
			<view class="" v-if="progressInfo.progressNum < 10">
				<u-loading mode="circle" size="100" color="#000"></u-loading>
			</view>
			<view class="u-flex u-flex load-wrap" v-if="progressInfo.progressNum > 10">
				<image class="img-loading" src="./../../static/loading.gif"></image>
				<u-line-progress striped striped-active active-color="#000" :percent="progressInfo.progressNum">
				</u-line-progress>
			</view>
			<!-- <view style="height: 50rpx">
        <view
          class="u-m-t-10"
          v-if="!progressInfo.isReady && progressInfo.progressNum == 100"
        >
          正在添加到场景中
        </view>
      </view> -->
		</view>
		<!-- 展示页 -->
		<template v-else>
			<action-sheet ref="actionSheet" :basicId="basicId" :base3d="base3d" />
			<button v-if="tabIndex == -1" @click="buyGlasses" class="buyButton">
				BUY NOW
			</button>
			<button v-else @click="okHandle" class="okButton">OK</button>
		</template>

		<!-- 切换其他眼镜弹窗组件 -->
		<glasses-modal v-model="isShowClassesModal" @initModal="init" />
		<!-- 详细信息弹窗组件 -->
		<selected-modal v-model="isShowSelectedModal" />
	</view>
</template>

<script>
	import Bus from "@/utils/bus";
	import GlassesModal from "@/components/GlassesModal.vue";
	import SelectedModal from "@/components/SelectedModal.vue";
	import ActionSheet from "@/components/ActionSheet.vue";
	import Base3d from "@/utils/Base3d.js";
	import {
		toDecimal,
		changeDecimal,
		findProduct,
		name2Url,
		calculate_delivery_time,
	} from "@/utils/utils.js";
	import BigNumber from "bignumber.js";
	import {
		exchangeRateList,
		tax,
		exchangeRate,
		countryList,
	} from "../../api/third";
	import {
		getCategory,
		getProductList,
		getProductInfo,
		purchase,
		getCurrency,
	} from "@/api/common.js";
	import {
		mapState,
		mapMutations
	} from "vuex";
	import productCalculator from "@/utils/product-options-calculator.1.0.0.es.js";

	export default {
		components: {
			ActionSheet,
			GlassesModal,
			SelectedModal,
		},
		data() {
			return {
				CatergoriesList: [],
				exchangeRateList: [],
				configurationList: {},
				glassesList: [],
				isShowRate: false,
				isShowClassesModal: false,
				isShowSelectedModal: false,
				title: "Hello",
				basicstyleConfigurationInfo: {},
				defaultSampleInfo: {},
				goodsList: [],
				base3d: null,
				basicId: "",
				symbol: "$",

				isNeedInit: false,

				randomBgIndex: "",
				randomLensesIndex: "",
				randomLensesIndexTwo: "",

				sampleInfo: {},
				progressInfo: {
					isReady: false,
					progressNum: 0,
				},
				oldRandomLensesIndex: "",
				oldRandomBgIndx: "",
				configurationId: "",
				MirrorBoxText: "",
				MirrorBoxTextShow: false,
				name: undefined,
			};
		},

		onShow() {
			this.isNeedInit = true;
			// if (isInit) {
			// 	// uni.reLaunch({
			// 	//     url: 'pages/index/index'
			// 	// });

			// 	window.location.reload();
			// }
			// this.isInit = true
		},
		onHide() {
			this.isNeedInit = false;
		},
		computed: {
			...mapState({
				dotStatus: (state) => state.model.dotStatus,
				rate: (state) => state.model.rate,
				configuration: (state) => state.model.configuration,
				options: (state) => state.model.options,
				tabIndex: (state) => state.model.tabIndex,
				optionSpec: (state) => state.model.optionSpec,
				checkID: (state) => state.model.checkID,
				currencyList: (state) => state.model.currencyList,
				currency: (state) => state.model.currency,
				delivery_date: (state) => state.model.delivery_date,
				glassesInscribe: (state) => state.model.glassesInscribe,
				mirrorBox: (state) => state.model.mirrorBox,
				engravingIndex: (state) => state.model.engravingIndex,
				isInscribe: (state) => state.model.isInscribe,
				caseIndex: (state) => state.model.caseIndex,
			}),
			price: function() {
				if (this.options.price) {
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
						.plus(price)
						.toNumber(),
						2
					);
				} else {
					return 0;
				}
			},
		},
		methods: {
			...mapMutations("model", [
				"SET_RATE",
				"setCatergories",
				"setOptions",
				"setConfiguration",
				"setTabIndex",
				"setCheckID",
				"setOptionSpec",
				"setCurrencyList",
				"setCurrency",
				"setDelivery_date",
				"setIsInscribe",
				"setEngravingIndex",
				"setCaseIndex",
			]),
			async initCurrency() {
				const res = await getCurrency();
				console.log(res);
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
			async buyGlasses() {
				let arrList = [];
				if (this.isInscribe.length && this.isInscribe.length > 0) {
					this.isInscribe.forEach((item) => {
						if (item.isChoose.toLowerCase() == "yes" && !item.text) {
							arrList.push(item.indexName);
						}
					});
				}

				if (arrList.length == 0) {
					let ecp_vid_shopify = "";
					this.configuration.variants.forEach((item) => {
						if (
							JSON.stringify(item.options) ===
							JSON.stringify(this.options.options)
						) {
							ecp_vid_shopify = item.ecp_vid.shopify;
						}
					});
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
					uni.showLoading({
						title: "loading",
					});
					const res = await purchase(parameter);
					try {
						if (res.code === 0) {
							if (
								res.data.checkout_url === "" ||
								res.data.checkout_url === undefined ||
								res.data.checkout_url === null
							) {
								// this.$message.error("跳转失败");
								uni.showToast({
									icon: "none",
									title: "error",
								});
							} else {
								window.location.href = res.data.checkout_url;
							}
						} else {
							uni.showToast({
								icon: "none",
								title: res.Message,
							});
						}
					} finally {
						uni.hideLoading();
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
			poCalc(options) {
				// 根据变体和矩阵生成可选项目
				// 默认放开  看每个选项有无 越界值 index===length  有越界值用-1
				let user_options = options ?
					Object.assign([], options.options) :
					Object.assign([], this.options.options);
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
			okHandle() {
				document
					.querySelector(".action-sheet-wrap_scroll")
					.classList.remove("scroll_autoHeight");
				this.setTabIndex(-1);
				document.querySelector("html").scrollTop;
				if (this.checkID !== this.configuration.id) {
					let product = this.glassesList.find((item) => {
						return item.id === this.checkID;
					});
					// 解决 url ?变成 %3F
					window.location.href = `./#/products/${name2Url(product.name.en)}?id=${
          product.id
        }`;
					// this.$Router.push({
					//   name: "products",
					//   params: {
					//     name: `${product.name.en}?id=${product.id}`,
					//   },
					// });
				}
				//window.location.href = "./products/";
			},
			confirmRate(e) {
				let currency = this.currencyList.find((item) => {
					return item.code === e[0].value;
				});
				this.setCurrency(Object.assign({}, currency));
			},
			linkTohome() {
				window.location.href = "https://rokittechnology.com/";
				// window.open('https://rokittechnology.com/')
			},
			setSampleInfo(sampleInfo) {
				this.sampleInfo = {
					...sampleInfo,
				};
			},
			handleChangeColor(json) {
				this.$nextTick(() => {
					this.base3d.changeColor(json);
				});
				// this.base3d.changeImage()
			},
			handleChangeLens(json, parameterName) {
				this.$nextTick(() => {
					this.base3d.changeLens(json);
					const loading = document.getElementsByClassName("Loading")[0];
				});
			},
			// 加载模型
			initThree() {
				// this.base3d = null
				// this.base3d = new Base3d("#scene", this.basicstyleConfigurationInfo.modeFileUrl, this.LoadingFinish)
				// const modeFileUrl = `${this.basicstyleConfigurationInfo.modeFileUrl.split("cn/")[1]}`
				let url3D = this.configuration.three_d_model.file;

				if (!this.base3d) {
					this.base3d = new Base3d(
						"#scenes",
						url3D,
						this.LoadingFinish,
						this.name
					);
				} else {
					this.base3d.addMesh(url3D);
				}
				this.base3d.total_actions =
					this.configuration.three_d_model.actions || [];
				// this.base3d.changeLens()
				this.base3d.onProgress((progressInfo) => {
					this.progressInfo = progressInfo;
				});
			},
			// 模型加载完成的回调
			LoadingFinish() {
				Bus.$emit("optionButton", this.configuration.variants[0]);
			},
			// 初始化加载执行方法
			async init(id) {
				this.basicId = id;
				console.log(id);
				const res = await getProductInfo({
					id: id,
				});

				if (res.code === 0) {
					console.log(res.data);
					// 整合配置项的数据
					this.configurationList = res.data;

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

					// 最长交期
					if (res.data.attributes && res.data.attributes.length > 0) {
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
						console.log(attribute_lensSeparation, res.data.attributes);

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
					this.setCheckID(res.data.id);
					this.initThree();
				} else {
					if (res.code === 110) {
						// 跳转404页面 带参数
						sessionStorage.setItem("mode", 1);
						uni.redirectTo({
							url: "/pages/NotFound/NotFound", // 404 页面的路径
						});
						return;
						// this.$message.error("Error");
					} else {
						sessionStorage.setItem("mode", 1);
						uni.redirectTo({
							url: "/pages/NotFound/NotFound", // 404 页面的路径
						});
						return;

						//this.$message.error(res.Message);
					}
				}
				//const res = await getConfiguration({ id: this.basicId });
			},
			// 监听窗口切换地址
			resizeScreen() {
				if (window.innerWidth < 1200) {
					// window.location.href = "http://36.156.138.127:85/mobile"; //http://36.156.138.127:85/mobile  http://design-your-own.rokitlife.com/mobile
				} else {
					window.location.href = window.location
						.origin; //http://36.156.138.127:85  http://design-your-own.rokitlife.com
				}
				// window.onresize = () => {
				// 	if (window.innerWidth < 1200) {
				// 		window.location.href = "http://localhost:8080/";
				// 	} else {
				// 		window.location.href = "http://design-your-own.rokitlife.com";
				// 	}
				// };
			},
			// 眼镜片脱离
			GoLens() {
				this.base3d.shiftOutLens();
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
						sessionStorage.setItem("mode", 2);
						uni.redirectTo({
							url: "/pages/NotFound/NotFound", // 404 页面的路径
						});
						return;
					}
					if (res.data && !res.data.products) {
						// 跳转404页面 带参数
						sessionStorage.setItem("mode", 2);
						uni.redirectTo({
							url: "/pages/NotFound/NotFound", // 404 页面的路径
						});
						return;
					}
					// 给产品归类

					this.glassesList = res.data.products;
					// 提取产品图片
					// this.glassesList.forEach((item, index) => {
					//   this.glassesList[index].productImage = item.attributes.find(
					//     (item) => {
					//       return item.tag === "product_images";
					//     }
					//   ).value.images[0];
					// });
					// todo 暂时商定 属性:商品图片 商品单位 商品交期 商品重量 海关编码 眼镜
					// 如果没有属性字段都设为空
					this.glassesList.forEach((item, index) => {
						if (item.attributes) {
							let attribute_image = item.attributes.find((item1) => {
								return item1.tags && item1.tags[0] === "product_image";
							});

							let image = "";
							//产品图
							if (
								attribute_image &&
								attribute_image.values.length > 0 &&
								attribute_image.values[0] &&
								attribute_image.values[0].images.length > 0
							) {
								image = attribute_image.values[0].images[0];
							}

							this.glassesList[index].productImage = image;
						} else {
							this.glassesList[index].productImage = "";
						}
					});

					let glassyListTemp = JSON.parse(JSON.stringify(this.glassesList));

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

				let productId = this.$route.query.basicstyleid ?
					this.$route.query.basicstyleid :
					this.$route.query.id;
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
							sessionStorage.setItem("mode", 1);
							uni.redirectTo({
								url: "/pages/NotFound/NotFound", // 404 页面的路径
							});
					}
					product = this.glassesList.find((item) => {
						return item.id === productId;
					});
					history.replaceState(
						"",
						"",
						`./#/products/${name2Url(product.name.en)}?id=${product.id}`
					);
				} else if (this.$route.query.id) {
					product = this.glassesList.find((item) => {
						return item.id === productId;
					});
				}

				if (
					(productId === null || productId === undefined || productId === "") &&
					!product
				) {
					if (this.configurationId === "") {
						sessionStorage.setItem("mode", 2);
						uni.redirectTo({
							url: "/pages/NotFound/NotFound", // 404 页面的路径
						});
						return;
					}
					if (process.env.NODE_ENV === "prod") {
						gtag("event", "page_view", {
							url: `${window.location.href}`,
							name: `${product.name.en}`,
							id: `${product.id}`,
						});
					}
					this.init(this.configurationId);
				} else {
					if (!product) {
						sessionStorage.setItem("mode", 1);
						uni.redirectTo({
							url: "/pages/NotFound/NotFound", // 404 页面的路径
						});
						return;
					}
					if (process.env.NODE_ENV === "prod") {
						gtag("event", "page_view", {
							url: `${window.location.href}`,
							name: `${product.name.en}`,
							id: `${product.id}`,
						});
					}
					this.init(product.id);
				}
			},
			async initCatergories() {
				const res = await getCategory();
				if (res.code === 0) {
					if (!res.data) {
						// 跳转404页面 带参数
						sessionStorage.setItem("mode", 2);
						uni.redirectTo({
							url: "/pages/NotFound/NotFound", // 404 页面的路径
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
			colorButton(val) {
				//判断是否用渐变材质
				if (val.json.indexOf("MeshPhysicalMaterial") >= 0) {
					this.base3d.changeLens(val.json);
				} else {
					this.base3d.changeColor(val.moduleTag, val.json);
				}
			},
			mounted() {
				// this.SET_CONFIGURATION(id)
				// const route = this.$route.query.basicstyleid;
				// if (route === null || route === undefined || route === "") {
				//   this.init(this.configurationId);
				// } else {
				//   this.init(route);
				// }
				Bus.$on("textChange", (val) => {
					// console.log(this.base3d.addLettering);
					this.base3d.addLettering(val);
				});
				Bus.$on("changMirrorBoxShow", (val) => {
					this.MirrorBoxTextShow = val;
				});
				Bus.$on("changMirrorBox", (val) => {
					this.MirrorBoxText = val;
				});

				Bus.$on("optionButton", (options) => {
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
								let i = 0; i < this.configuration.three_d_model.actions.length; i++
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
													[argsItem.module_name]: JSON.parse(
														argsItem.value),
												}),
											};
											this.colorButton(obj);
										}
									);
								}
							}
						});
					}
				});

				if (
					(productId === null || productId === undefined || productId === "") &&
					!product
				) {
					if (this.configurationId === "") {
						sessionStorage.setItem("mode", 2);
						uni.redirectTo({
							url: "/pages/NotFound/NotFound", // 404 页面的路径
						});
						return;
					}
					if (process.env.NODE_ENV === "prod") {
						gtag("event", "page_view", {
							url: `${window.location.href}`,
							name: `${product.name.en}`,
							id: `${product.id}`,
						});
					}
					this.init(this.configurationId);
				} else {
					if (!product) {
						sessionStorage.setItem("mode", 1);
						uni.redirectTo({
							url: "/pages/NotFound/NotFound", // 404 页面的路径
						});
						return;
					}
					if (process.env.NODE_ENV === "prod") {
						gtag("event", "page_view", {
							url: `${window.location.href}`,
							name: `${product.name.en}`,
							id: `${product.id}`,
						});
					}
					this.init(product.id);
				}
			},
			async initCatergories() {
				const res = await getCategory();
				if (res.code === 0) {
					if (!res.data) {
						// 跳转404页面 带参数
						sessionStorage.setItem("mode", 2);
						uni.redirectTo({
							url: "/pages/NotFound/NotFound", // 404 页面的路径
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
			colorButton(val) {
				//判断是否用渐变材质
				if (val.json.indexOf("MeshPhysicalMaterial") >= 0) {
					this.base3d.changeLens(val.json);
				} else {
					this.base3d.changeColor(val.moduleTag, val.json);
				}
			},
		},
		mounted() {
			// this.SET_CONFIGURATION(id)
			// const route = this.$route.query.basicstyleid;
			// if (route === null || route === undefined || route === "") {
			//   this.init(this.configurationId);
			// } else {
			//   this.init(route);
			// }
			Bus.$on("textChange", (val) => {
				// console.log(this.base3d.addLettering);
				this.base3d.addLettering(val);
			});
			Bus.$on("changMirrorBoxShow", (val) => {
				this.MirrorBoxTextShow = val;
			});
			Bus.$on("changMirrorBox", (val) => {
				this.MirrorBoxText = val;
			});

			Bus.$on("optionButton", (options) => {
				this.base3d.action_initial();
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
							let i = 0; i < this.configuration.three_d_model.actions.length; i++
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
												[argsItem.module_name]: JSON.parse(argsItem
													.value),
											}),
										};
										this.colorButton(obj);
									}
								);
							}
						}
					});
				}
			});

			Bus.$on("colorButton", (data) => {
				this.colorButton(data);
			});
			// 获取产品基本款总列表
			this.initCatergories();
			this.exchangeRateList = exchangeRateList;
			window.addEventListener("resize", this.resizeScreen.bind(this));
		},
	};
</script>

<style scoped lang="scss">
	* {
		font-family: PoppinsRegular;
	}

	.logo {
		margin: auto;
		text-align: center;
		left: 0;
		right: 0;
		position: absolute;
	}

	.rateButton {
		position: relative;
		left: -36rpx;
		border: 1rpx solid #e2e4e8;
		padding: 0 8rpx;
	}

	.container {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		display: block;
		background-color: #f2f2f2;
		// max-width: 1400rpx;
		// margin: 0 auto;
		width: 100%;
		height: 100vh;
		box-sizing: border-box;

	}

	.model-progress {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		width: 100%;
		height: 100%;
		padding: 0 10%;
		background-color: #fff;
		// background-color: #f2f2f2;
		z-index: 99999;

		.load-wrap {
			position: relative;
			top: -2%;
			flex-direction: column;
			width: 75%;

			.img-loading {
				width: 200rpx;
				height: 200rpx;
				margin-bottom: 40rpx;
			}
		}
	}

	#scene {
		// position: absolute;
		// top: 10vh;
		// margin-top: 119rpx;
		margin-top: 84rpx;
		width: 100vw;
		// height: 626rpx;
		height: 65vh;
		background-color: #f2f2f2;

		background: url("~@/static/bg-model.png") center no-repeat;
		background-size: contain;
		background-position: 0 calc(50%);
		position: relative;
		// background-size:cover;
		// background-position: center 35%;

		// .bg-model-image {
		// 	width: 100%;
		// 	height: 60vh;
		// 	background: url("~@/static/bg-model.png") center no-repeat;
		// 	background-size: 100%;
		// }
		#scenes {
			height: 100%;
			width: 100%;
		}

		#mirror_box {
			width: 1600rpx;
			height: 1000rpx;

			display: none;
			position: absolute;
			left: 53%;
			top: 50%;
			transform: translate(-50%, -50%);

			image {
				width: 100%;
				height: 100%;
			}

			.mirror_box_text {
				position: absolute;
				left: 50%;
				top: 50%;
				transform: translate(-50%, -50%);
				z-index: 10;
				color: #000;
				font-family: "Poppinsbold";
				font-size: 24rpx;
			}

			.mirror_box_cover {
				position: absolute;
				left: 50%;
				transform: translateX(-54%);
				z-index: 999;
				top: 46%;
				width: 30%;
				height: 3.2%;
			}
		}
	}

	.delivery {
		position: absolute;
		text-align: center;
		width: 100%;
		font-size: 15px;
		color: #2d2d2d;
		pointer-events: none;
		z-index: 10;
	}

	.header-wrap {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		//
		box-sizing: border-box;

		.nav-wrap {
			display: flex;
			justify-content: space-between;
			align-items: center;
			width: 100%;
			height: 85rpx;
			background-color: #fff;
			padding: 0 42rpx 0 33rpx;
			font-weight: 400;

			.icon-home {
				width: 35rpx;
				height: 37rpx;
			}
		}

		.priceContent {
			height: 56rpx;
		}

		.header-content {
			padding: 34rpx 30rpx 0 33rpx;
			align-items: flex-start;
		}

		.specs {
			display: flex;
			flex-direction: column;
			min-width: 337rpx;
			font-size: 24rpx;
			color: #666666;
			padding-right: 50rpx;
			font-weight: 400;
			max-width: 300px;
			overflow: hidden;
			text-overflow: ellipsis;
			display: -webkit-box;
			-webkit-line-clamp: 3;
			-webkit-box-orient: vertical;
			z-index: 99;
			pointer-events: none;

			.text {
				font-family: Poppinsbold;
				font-size: 36rpx;
				color: #2d2d2d;
				margin-bottom: -30rpx;
				pointer-events: none;
			}

			.price {
				color: #001d7c;
				pointer-events: none;
			}

			.vat {
				font-family: Poppinsregular;
				font-size: 18rpx;
				color: #aaa;
				pointer-events: none;
			}
		}

		.operation-wrap {
			display: flex;
			flex-direction: column;
			z-index: 999;

			.btn {
				position: relative;
				display: flex;
				justify-content: center;
				align-items: center;
				width: 66rpx;
				height: 66rpx;
				background-color: #fff;
				border-radius: 50%;
				margin-bottom: 20rpx;

				image {
					width: 100%;
					height: 100%;
				}
			}
		}
	}

	.u-load-more-wrap {
		position: absolute;
		left: 50%;
		top: 32%;
		margin-left: -60px;
		margin-top: -25px;
	}

	.buyButton {
		background: #001d7c;
		line-height: 100rpx;
		color: #fff;
		border-radius: 0;
		height: calc(100rpx + constant(safe-area-inset-bottom));
		height: calc(100rpx + env(safe-area-inset-bottom));
	}

	.okButton {
		border: 1rpx solid #001d7c;
		color: #001d7c;
		line-height: 100rpx;
		background: #fbfbfb;
		border-radius: 0;
		height: calc(100rpx + constant(safe-area-inset-bottom));
		height: calc(100rpx + env(safe-area-inset-bottom));
	}

	.point_fixed {
		position: absolute;
		top: 50%;
		left: 50%;
		z-index: 10;

		.label {
			position: absolute;
			top: -8px;
			left: -18px;
			width: 40rpx;
			height: 40rpx;
			border-radius: 50%;
			background: #35343477;
			border: 1px solid #ffffff77;
			color: #ffffff;
			text-align: center;
			line-height: 40rpx;
			font-weight: 100;
			font-size: 14rpx;
			cursor: help;
			transform: scale(0, 0);
			transition: transform 0.3s;

			.ponit_flashing {
				position: absolute;
				top: 0;
				right: 0;
				bottom: 0;
				left: 0;
				margin: auto;
				width: 20rpx;
				height: 20rpx;
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
			font-size: 14rpx;
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
