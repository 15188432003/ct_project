<template>
  <div class="qs_qs" style="height: 100%">
    <!-- color和lens的配置选项 -->
    <div class="nav_detail scrollbar" style="height: 100%" v-show="isDetail">
      <!-- 头部 -->
      <div class="flex space-between align-center padding-tb-15 header">
        <!-- <div class="Poppins-Bold font-size-26">Customize</div> -->
        <!-- <div v-if="model.source == 1" class="infoIcon">
          <a-popover
            overlayClassName="design_tip"
            v-if="isDetail"
            placement="bottom"
          >
            <template slot="content">
              <span>Current Design</span>
            </template>
            <a-badge :dot="infoIcon">
              <img
                src="../../assets/img/choice.png"
                alt=""
                @click="clickDetails"
              />
            </a-badge>
          </a-popover>
        </div> -->
      </div>
      <!-- 左右切换选择 -->
      <div v-if="model.source === 1 && page === -1">
        <span class="font-size-16">FRAMES</span>
        <template v-for="item in catergories">
          <glasses-type
            :node="item"
            :key="item.id"
            @configurationId="configurationId"
          ></glasses-type>
        </template>
      </div>

      <template
        v-if="
          model.source == 1
            ? configuration.option_groups &&
              configuration.option_groups.length > 0
            : preViewData.lists && preViewData.lists.length > 0
        "
      >
        <template
          v-for="(item, listsIndex) in model.source == 1
            ? configuration.option_groups
            : preViewData.lists"
        >
          <div class="groups" v-show="page == listsIndex" :key="item.id">
            <div class="groups_content scrollbar">
              <Option
                v-for="(item1, termlistsIndex) in model.source == 1
                  ? item.options
                  : item.termlists"
                :data="item1"
                :key="item1.id"
                :optionIndex="computeOptionIndex(listsIndex, termlistsIndex)"
              ></Option>
              <template
                v-if="model.source == 1 ? ifPurchased(listsIndex) : false"
              >
                <!-- 最后一个规格组里面 显示加购项目 -->
                <a-divider
                  v-if="
                    model.source == 1
                      ? configuration.related_variants &&
                        configuration.related_variants.length > 0
                      : true
                  "
                />
                <div
                  v-if="
                    configuration.related_variants &&
                    configuration.related_variants.length > 0
                  "
                >
                  <!-- title标题 -->
                  <div class="title-Additional margin-bottom-27">
                    You may also need
                  </div>
                  <div class="">
                    <!-- 眼镜片多个 -->
                    <div
                      v-for="(item, index) in configuration.related_variants"
                      :key="item.id"
                    >
                      <div class="flex space-between margin-tb-25">
                        <!-- 眼镜片展示图 -->
                        <div class="Lens">
                          <!-- todo -->
                          <img
                            class="Lens"
                            :src="item.attribute_image"
                            alt=""
                          />
                        </div>
                        <div class="weight-normal color-666666">
                          <!-- 眼镜片名称 -->
                          <div
                            class="ellipsis font-size-16 lensName"
                            :title="item.name.en"
                          >
                            {{ item.name.en }}
                          </div>
                          <div>
                            <!-- 眼镜片价格 -->
                            <span
                              v-if="
                                item.price &&
                                typeof item.price[`${currency.code}`] !==
                                  'undefined' &&
                                item.price[`${currency.code}`] !== null
                              "
                              class="color-red font-size-18"
                              >{{ currency.symbol
                              }}{{
                                typeof item.price[`${currency.code}`] ===
                                "undefined"
                                  ? "-"
                                  : item.price[`${currency.code}`]
                              }}</span
                            >
                            <!-- 眼镜片单位 -->
                            <span
                              class="color-grey font-size-14 weight-normal margin-left-5"
                            >
                              /{{ item.attribute_unit }}
                            </span>
                          </div>
                        </div>
                        <!-- 加购的数量 -->
                        <div>
                          <a-input-number
                            v-model="item.number"
                            :min="0"
                            :precision="0"
                            class="input-number"
                            @change="UpChange($event, index)"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
            </div>
          </div>
        </template>
      </template>
      <!-- <div class="groups" v-show="page == -4">
        <div class="groups_content scrollbar">
          <glasses-custom
            :pages="page"
            name="Lenses Engraving"
          ></glasses-custom>
        </div>
      </div>
      <div class="groups" v-show="page == -5">
        <div class="groups_content scrollbar">
          <glasses-custom :pages="page" name="Case Engraving"></glasses-custom>
        </div>
      </div> -->
      <!-- engraving,case 内容页 -->

      <template
        v-if="
          model.source == 1
            ? configuration.option_groups &&
              configuration.option_groups.length > 0
            : preViewData.lists && preViewData.lists.length > 0
        "
      >
      </template>
    </div>

    <!-- 查看配置的信息 -->
    <glasses-details
      v-if="model.source == 1"
      class="details"
      style="width: 75%; position: relative; background: #fff"
      v-show="!isDetail"
      :additional-lens="additionalLensList"
      :lens-name="parameterLensName"
      @back-off="backOff"
    ></glasses-details>

    <div class="nav_right" style="position: relative; width: 25%">
      <ul class="nav_rigit_ul">
        <li
          v-if="model.source == 1"
          :class="{ active: page === -1 }"
          @click="tabToggle(-1)"
        >
          <img src="../../assets/img/Frame.png" class="glasses" />
          <span>FRAMES</span>
        </li>
        <template
          v-if="
            model.source == 1
              ? configuration.option_groups &&
                configuration.option_groups.length > 0
              : preViewData.lists && preViewData.lists.length > 0
          "
        >
          <li
            :class="{ active: page === listsIndex }"
            @click="tabToggle(listsIndex)"
            v-for="(item, listsIndex) in model.source == 1
              ? configuration.option_groups
              : preViewData.lists"
            :key="listsIndex"
          >
            <img
              :src="model.source == 1 ? item.icon : item.image"
              class="glasses"
            />
            <span
              :title="model.source == 1 ? item.name.en : item.name"
              class="name"
              >{{ model.source == 1 ? item.name.en : item.name }}</span
            >
          </li>
        </template>
      </ul>
      <div class="design" @click="tabToggle(-2)" v-if="model.source == 1">
        <span> My Design ></span>
      </div>
    </div>
  </div>
</template>

<script>
import Bus from "@/utils/bus";
import GlassesDetails from "./GlassesDetails";
import Option from "./Option";
import { mapMutations, mapState } from "vuex";
import GlassesType from "./GlassesType.vue";
export default {
  components: { GlassesDetails, Option, GlassesType },
  props: {
    base3d: Object,
  },
  data() {
    return {
      isShow: true,
      isDetail: true,
      page: -1,
      datalist: {},
      glassesColor: [],
      Id: "404740ed8dea4cb5b17c03cce00332ad",
      additionalLensList: [],
      parameterLensName: "",
      dataId: "",
      isAnmate: false,
      sideChange: true,
    };
  },
  created() {},
  mounted() {
    //const route = this.$route.query.basicstyleid;
    // if (route === null || route === undefined || route === "") {
    //   // 获取加购商品列表
    //   this.additionalinit(this.Id);
    // } else {
    //   this.additionalinit(route);
    // }
    if (this.model.source === 1) {
      this.initHeight();
    }
    Bus.$on("changePage", (page, index) => {
      if (page == this.page) {
        Bus.$emit("showInfo", index);
      } else {
        this.tabToggle(page).then(() => {
          Bus.$emit("showInfo", index);
        });
      }
    });
    this.winsize();
    window.addEventListener("resize", () => {
      setTimeout(() => {
        this.winsize();
      }, 500);
    });
  },
  computed: {
    ...mapState("lens", [
      "infoIcon",
      "colorList",
      "lensList",
      "parameterList",
      "configuration",
      "catergories",
      "preViewData",
      "model",
      "optionSpec",
      "currency",
      "isInscribe",
      "engravingIndex",
      "caseIndex",
    ]),
  },
  watch: {
    page(val, oldVal) {
      // if (this.engravingIndex && this.caseIndex) {
      if (val == this.engravingIndex && !this.isAnmate) {
        this.isAnmate = true;
        this.base3d.animateBack();
        if (
          this.engravingIndex &&
          this.isInscribe[0].isChoose.toLowerCase() == "no"
        ) {
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

      if (val == -3) {
        if (oldVal == this.caseIndex) {
          this.sideChange = true;
        } else {
          this.sideChange = false;
        }
      } else {
        if (oldVal == -3) {
          if (this.sideChange) {
            if (val == this.caseIndex) {
              console.log("没有变化");
            } else {
              this.base3d.unAnimateShow();
            }
          } else {
            if (val !== this.caseIndex) {
              console.log("没有变化");
            } else {
              this.base3d.animateShow();
            }
          }
        } else {
          if (val == this.caseIndex) {
            this.base3d.animateShow();
          } else if (oldVal == this.caseIndex) {
            this.base3d.unAnimateShow();
            if (val == this.engravingIndex) {
              this.base3d.animateBack();
              if (
                this.engravingIndex &&
                this.isInscribe[0].isChoose.toLowerCase() == "no"
              ) {
                this.base3d.pointOpen = true;
                this.base3d.initPoint();
              } else {
                this.base3d.pointOpen = false;
              }
            } else {
              this.base3d.animateInit();
            }
          }
        }
      }
      // }
    },
    model: {
      deep: true,
      immediate: true,
      handler(val) {
        console.log(val);
        if (val.source == 1) {
          this.page = -1;
        } else if (val.source == 2) {
          this.page = 0;
        }
      },
    },
  },
  methods: {
    ...mapMutations("lens", [
      "setPageNumber",
      "setLens",
      "setParameter",
      "setLensList",
      "setLensJson",
      "setParameterList",
      "setBottom",
      "setInfoIcon",
      "setConfiguration",
      "setOptions",
    ]),
    winsize() {
      setTimeout(() => {
        // let groups = document.getElementsByClassName("groups");
        // [].forEach.call(groups, (item) => {
        //   if (item.clientHeight > 0) {
        //     console.log(item);
        //     let parent = item.parentNode;
        //     let content = item.querySelector(".groups_content");
        //     //item.style.height = parent.clientHeight - h1 + "px";
        //     let nextHeight = 0;
        //     let nextDom;
        //     [].forEach.call(document.querySelectorAll(".next"), (item) => {
        //       if (item.clientHeight > 0) {
        //         nextHeight = item.clientHeight;
        //         nextDom = item;
        //       }
        //     });
        //     // if (this.model.source == 1) {
        //     //   content.style.maxHeight =
        //     //     parent.clientHeight -
        //     //     content.offsetTop -
        //     //     parseInt(
        //     //       nextDom
        //     //         ? getComputedStyle(nextDom, null).getPropertyValue("bottom")
        //     //         : 0
        //     //     ) -
        //     //     document.querySelector(".position-absolute").clientHeight -
        //     //     nextHeight +
        //     //     "px";
        //     //   content.style.hegith = "auto";
        //     // } else {
        //     //   content.style.maxHeight =
        //     //     parent.clientHeight -
        //     //     content.offsetTop -
        //     //     parseInt(
        //     //       nextDom
        //     //         ? getComputedStyle(nextDom, null).getPropertyValue("bottom")
        //     //         : 0
        //     //     ) -
        //     //     nextHeight +
        //     //     "px";
        //     //   content.style.hegith = "auto";
        //     // }
        //   }
        // });
        // console.log(document.getElementsByClassName("groups"));
      }, 0);
      // const next = document.getElementsByClassName("next")[0];
      // // 初始化加载是根据屏幕的高度修改颜色选择卡的高度
      // if (window.innerHeight > 950) {
      //   next.style.bottom = "8%";
      // } else if (window.innerHeight > 900) {
      //   next.style.bottom = "9%";
      // } else if (window.innerHeight > 850) {
      //   next.style.bottom = "10%";
      // } else if (window.innerHeight > 800) {
      //   next.style.bottom = "10%";
      // } else if (window.innerHeight > 750) {
      //   next.style.bottom = "11%";
      // } else if (window.innerHeight > 700) {
      //   next.style.bottom = "12%";
      // } else if (window.innerHeight > 650) {
      //   next.style.bottom = "12%";
      // } else if (window.innerHeight > 600) {
      //   next.style.bottom = `14%`;
      // } else {
      //   next.style.bottom = "16%";
      // }
    },
    async init() {
      this.configuration.moduleList.map((item) => {
        this.glassesColor.push(item.moduleName);
      });
      this.setLensList(this.configuration.moduleList[1]);
    },
    // 左箭头按钮
    leftArrow() {
      if (this.page <= 0) {
        this.page =
          this.model.source == 1
            ? this.configuration.option_groups.length - 1
            : this.preViewData.lists.length - 1;
      } else {
        this.page--;
      }
    },
    // 右箭头按钮
    rightArrow() {
      if (
        this.page >=
        (this.model.source == 1
          ? this.configuration.option_groups.length - 1
          : this.preViewData.lists.length - 1)
      ) {
        this.page = 0;
      } else {
        this.page++;
      }
    },
    // 点击查看配置信息
    clickDetails() {
      this.isDetail = false;
      // 存储页数等配置信息页返回使用
      this.setPageNumber(this.page);
    },
    // 关闭查看配置信息页
    backOff(val) {
      this.isDetail = val.isTrue;
      this.page = val.number;
      this.winsize();
    },
    computeOptionIndex(listsIndex, termlistsIndex) {
      let optionIndex = 0;
      for (let i = 0; i < listsIndex; i++) {
        optionIndex +=
          this.model.source == 1
            ? this.configuration.option_groups[i].options.length
            : this.preViewData.lists[i].termlists.length;
      }

      optionIndex += termlistsIndex;

      return { listsIndex, termlistsIndex, optionIndex };
    },
    configurationId(val) {
      this.$emit("configurationId", val);
    },
    tabToggle(tabIndex) {
      return new Promise((reslove) => {
        this.isDetail = true;
        if (this.page === tabIndex) {
          this.page = -3;
          if (document.querySelector(".right-nav")) {
            document.querySelector(".right-nav").classList.add("close");
            Bus.$emit("resize", () => {});
            if (document.querySelector(".lensButton")) {
              document.querySelector(".lensButton").style.left =
                document.querySelector("#scene").clientWidth - 140 + "px";
            }
          }
        } else if (tabIndex == -2) {
          this.isDetail = !this.isDetail;
          this.page = tabIndex;
          if (
            document.querySelector(".right-nav") &&
            document.querySelector(".right-nav").classList.contains("close")
          ) {
            document.querySelector(".right-nav").classList.remove("close");
            Bus.$emit("resize", () => {});
            if (document.querySelector(".lensButton")) {
              document.querySelector(".lensButton").style.left = "";
            }
          }
        } else if (
          document.querySelector(".right-nav") &&
          document.querySelector(".right-nav").classList.contains("close")
        ) {
          this.page = tabIndex;
          document.querySelector(".right-nav").classList.remove("close");
          Bus.$emit("resize", () => {});
          if (document.querySelector(".lensButton")) {
            document.querySelector(".lensButton").style.left = "";
          }
        } else {
          this.page = tabIndex;
        }
        reslove("修改成功");
      });
    },

    modelBigger() {},
    // 随机色按钮点击事件
    randomNumber() {
      // 寻找一个随机的变体
      let configuration = Object.assign({}, this.configuration);
      var index = Math.floor(Math.random() * configuration.variants.length);
      this.setOptions(configuration.variants[index]);
      Bus.$emit("optionButton", configuration.variants[index]);
      if (
        this.configuration.three_d_model.actions &&
        this.configuration.three_d_model.actions.length >= 0
      ) {
        // 检查每个选项 如果越界就是空值 不发生动作
        configuration.variants[index].options.forEach((item, index) => {
          if (item < configuration.options[index].values.length) {
            for (
              let i = 0;
              i < this.configuration.three_d_model.actions.length;
              i++
            ) {
              if (
                this.configuration.three_d_model.actions[i].options[index] ===
                item
              ) {
                this.configuration.three_d_model.actions[i].args.forEach(
                  (item) => {
                    let obj = {
                      moduleTag: item.module_name,
                      json: JSON.stringify({
                        [item.module_name]: JSON.parse(item.value),
                      }),
                    };
                    Bus.$emit("colorButton", obj);
                  }
                );
              }
            }
          }
        });
      }

      // 传给父组件一个点击事件触发
      // const linkageModuleListLength =
      //   this.colorList.parameterTagList[0].parameterList[0].linkageModuleList
      //     .length;
      // if (linkageModuleListLength > 0) {
      //   this.$emit("randomColor");
      // } else {
      //   if (this.colorList.parameterTagList[0].parameterList.length > 1) {
      //     const lenslist = this.randomLensIndex();
      //     // 通过bus进行传参返回下标值
      //     Bus.$emit("randomLens", lenslist);
      //     this.$emit("randomColor");
      //   } else {
      //     const lenslist = this.randomLensIndex();
      //     // 通过bus进行传参返回下标值
      //     Bus.$emit("randomLens", lenslist);
      //     if (!this.$refs.RightLens) {
      //       this.RandomHit();
      //     }
      //   }
      // }
    },
    async RandomHit() {
      // 基本款颜色选配
      let moduleList = [];
      this.colorList.parameterTagList[0].parameterList.forEach((item) => {
        if (item.isDefault === true) {
          const itemid = {
            parameterId: item.parameterId,
          };
          const list = {
            moduleId: this.colorList.moduleId,
            parameterList: [],
          };
          list.parameterList.push(itemid);
          moduleList.push(list);
        }
      });
      this.lensList.parameterTagList.forEach((item) => {
        item.parameterList.forEach((item2) => {
          if (item2.isDefault) {
            const itemid = {
              parameterId: item2.parameterId,
            };
            const list = {
              moduleId: this.lensList.moduleId,
              parameterList: [],
            };
            list.parameterList.push(itemid);
            moduleList.push(list);
          }
        });
      });
    },
    randomLensIndex() {
      //随机数
      const random_length = this.lensList.parameterTagList.length - 1;
      const LensList = this.lensList;
      let randomBgIndex = Math.round(Math.random() * random_length);
      if (this.oldRandomBgIndx !== randomBgIndex) {
        this.oldRandomBgIndx = randomBgIndex;
      } else {
        randomBgIndex = Math.round(Math.random() * random_length);
      }
      if (LensList.parameterTagList[randomBgIndex].tagId) {
        if (this.$refs.rightLens) {
          this.$refs.rightLens.isTrue =
            LensList.parameterTagList[randomBgIndex].tagId;
        }
        for (
          let i = 0;
          i < this.lensList.parameterTagList[1].parameterList.length;
          i++
        ) {
          LensList.parameterTagList[1].parameterList[i].isDefault = false;
        }
        const Lens_length =
          LensList.parameterTagList[randomBgIndex].parameterList.length - 1;
        let randomBgIndex2 = Math.round(Math.random() * Lens_length);
        if (this.oldRandomBgIndx !== randomBgIndex2) {
          this.oldRandomBgIndx = randomBgIndex2;
        } else {
          randomBgIndex2 = Math.round(Math.random() * Lens_length);
        }
        LensList.parameterTagList[randomBgIndex].parameterList.forEach(
          (item2, index2) => {
            item2.isDefault = false;
            if (randomBgIndex2 === index2) {
              item2.isDefault = true;
              this.setLensJson(item2.json);
            }
          }
        );
      } else {
        LensList.parameterTagList[0].parameterList.forEach((item) => {
          item.isDefault = false;
        });
        if (this.$refs.rightLens) {
          this.$refs.rightLens.isTrue = "";
        }
        const Lens_length2 =
          LensList.parameterTagList[randomBgIndex].parameterList.length - 1;
        let randomBgIndex3 = Math.round(Math.random() * Lens_length2);
        if (this.oldRandomBgIndx !== randomBgIndex3) {
          this.oldRandomBgIndx = randomBgIndex3;
        } else {
          randomBgIndex3 = Math.round(Math.random() * Lens_length2);
        }
        // console.log(randomBgIndex3);
        LensList.parameterTagList[randomBgIndex].parameterList.forEach(
          (item2, index2) => {
            item2.isDefault = false;
            if (randomBgIndex3 === index2) {
              // console.log(item2);
              item2.isDefault = true;
              this.setLensJson(item2.json);
            }
          }
        );
      }
      // console.log(LensList);
      // const LensList = this.lensList;
      // // 选中某一个眼镜片样本
      // for (let i = 0; i < LensList.parameterTagList.length; i++) {
      //   LensList.parameterList[i].isDefault = false;
      //   if (randomBgIndex === i) {
      //     LensList.parameterList[i].isDefault = true;
      //     this.parameterName(LensList.parameterList[i].parameterName);
      //   }
      // }
      this.setParameterList(LensList);
      this.setInfoIcon(true);
      return LensList;
    },
    // 点击color色值的某一个按钮时触发
    colorButton(val) {
      this.$emit("colorButton", val);
    },
    parameterName(val) {
      this.parameterLensName = val;
    },
    parameterJson(val) {
      this.$emit("parameterJson", val);
    },
    // 点击加购按钮时改变底部导航栏的价格
    UpChange(e, index) {
      //e 加购量  //index 加购商品index
      if (!e) {
        e = 0;
      }
      let configuration = Object.assign({}, this.configuration);
      configuration["related_variants"][index].number = e;
      this.setConfiguration(configuration);
      // this.setadditionalList(this.additionalList);
      //configuration.tr
      // 交给vuex给底部导航栏的价格使用
      // this.setMoneys(moneys);
      // this.setInfoIcon(true);
    },
    //判断加购项
    ifPurchased(listsIndex) {
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
    initHeight() {
      const design = document.querySelector(".design");
      const right_nav = document.querySelector(".right-nav");
      let nav_rigit_uls =
        document.querySelector(".nav_rigit_ul") &&
        document.querySelector(".nav_rigit_ul").childNodes;
      nav_rigit_uls = [...nav_rigit_uls];
      let sum = nav_rigit_uls.reduce((res, item) => {
        return (res += item.clientHeight);
      }, 0);
      sum += design.clientHeight;
      if (sum) {
        right_nav.style.minHeight = sum + "px";
      }
    },
  },
  beforeDestroy() {
    Bus.$off("changePage");
  },
};
</script>

<style lang="less" scoped>
/deep/.ant-input-number-handler-wrap {
  opacity: 1 !important;
}

.nav_detail {
  // prettier-ignore
  width: 75%;
  padding: 15px;
  overflow: hidden auto;
  background: #fff;
}

ul {
  // prettier-ignore
  width: 100%;
  flex-direction: column;
  display: flex;
  height: 100%;
  list-style: none;
  // border: 1px solid #e2e4e8;
  background: #fff;
  li {
    width: 100%;
    // prettier-ignore
    aspect-ratio:1/1;
    height: auto;
    background: #fff;
    text-align: center;
    border-bottom: 1px solid #e2e4e8;
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    align-content: center;
    justify-content: center;
    text-align: center;
    align-items: center;
    background: #f7f7f7;
    font-size: 14px;
    img {
      width: 70%;
    }
    &.active {
      background: #fff;
    }
    &:hover {
      cursor: pointer;
    }
  }
}

.nav_right {
  display: flex;
  flex-direction: column;
  border: 1px solid #e2e4e8;
  background: #fff;
}

.nav_rigit_ul {
  margin: 0;
}
</style>

<style lang="less">
.frames_tab {
  font-size: 16px;
  ul,
  li {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  ul > div {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-box-orient: vertical;
    white-space: pre-line;
    /* autoprefixer: off */
  }
  .name {
    max-width: calc(100% - 100px);
  }
}

.details {
  padding-left: 40px;
  padding-right: 40px;
}

.design {
  width: 100%;
  text-align: center;
  padding-top: 16px;
  padding-bottom: 16px;
  font-size: 14px;
  &:hover {
    cursor: pointer;
  }
}

.ant-divider.ant-divider-horizontal {
  margin: 40px 0;
}
.position-divider {
  width: 80%;
  height: 1px;
  position: absolute;
  top: 0%;
  left: 50%;
  transform: translate(-50%, -6%);
}
.position-divider .ant-divider-horizontal {
  margin: 0 !important;
}
.position-absolute {
  width: 100%;
  position: absolute;
  bottom: 0%;
  left: 50%;
  transform: translate(-50%, 0%);
  height: 70px;
}
.next {
  background: #f1f2f8;
  color: #001d7c;
  width: 100px;
  border-radius: 4px;
  text-align: center;
  padding: 6px 0;
  position: absolute;
  bottom: 100px;
  cursor: pointer;
  font-weight: bold;
  font-size: 14px;
}

.preView {
  .next {
    bottom: 40px;
  }
}

.infoIcon {
  border-radius: 50%;
  width: 40px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  margin-right: -8px;
}
.infoIcon:hover {
  background-color: #f2f3f8;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  line-height: 40px;
  text-align: center;
}
.ant-popover-inner-content {
  background: #4c4c4c;
  border-radius: 6px;
  span {
    color: #fff;
  }
}
.ant-popover-placement-bottom > .ant-popover-content > .ant-popover-arrow,
.ant-popover-placement-bottomLeft > .ant-popover-content > .ant-popover-arrow,
.ant-popover-placement-bottomRight > .ant-popover-content > .ant-popover-arrow {
  border-top-color: #4c4c4c !important;
  border-left-color: #4c4c4c !important;
}

.image {
  width: 200px;
  height: 200px;
  margin: 20px auto;
}

.glasses {
  width: 200px;
}

.name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 90%;
}

.groups {
  height: 100%;
}

.groups_content {
  overflow-y: auto;
  overflow-x: hidden;
  height: 100%;
}

.groups_content > div > span {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-box-orient: vertical;
  white-space: pre-line;
  /* autoprefixer: off */
}

.Lens {
  width: 3vw;
  height: 6vh;
  /* background-color: #f2f2f2; */
}

.title-Additional {
  font-size: 18px;
  color: #000000;
}

.input-number.ant-input-number {
  width: 90px;
  height: 40px;
  .ant-input-number-input {
    height: auto;
    font-size: 14px;
    line-height: 40px;
  }
}
.design_tip {
  padding: 0;
  .ant-popover-inner-content {
    padding: 15px 10px;
    font-size: 20px;
  }
}
</style>
