const state = {
  color: {},
  colorList: {},
  lens: [],
  lensList: {},
  lensesList: {},
  configuration: {},
  pageNumber: 0,
  moneys: 0,
  bottom: {},
  parameter: "",
  additionalList: [],
  detailsImg: {},
  infoIcon: false,
  parameterName: "",
  lensJson: "",
  LensColorButton: "",
  catergories: {},
  options: [],
  preViewData: {},
  glassList: [],
  model: {
    //从哪个页面进来 1是赤菟定制页面 2是商品中心
    source: 1,
    // 是否显示VR
    isShowAR: false,
  },
  optionSpec: {},
  currencyList: [],
  currency: {},
  delivery_date: "",
  isInscribe: [], //刻字内容
  engravingIndex: null,
  caseIndex: null,
};

const mutations = {
  setLensColorButton(state, val) {
    state.LensColorButton = val;
  },
  setLensJson(state, val) {
    state.lensJson = val;
  },
  setParameterName(state, val) {
    state.parameterName = val;
  },
  setColorList(state, val) {
    state.colorList = val;
  },
  setColor(state, val) {
    state.color = val;
  },
  setLens(state, val) {
    state.lens = val;
  },
  setParameterList(state, val) {
    state.lensesList = val;
  },
  setLensList(state, val) {
    state.lensList = val;
  },
  setConfiguration(state, val) {
    state.configuration = val;
  },
  setOptions(state, val) {
    state.options = val;
  },
  setDetailsImg(state, val) {
    state.detailsImg = val;
  },
  setPageNumber(state, val) {
    state.pageNumber = val;
  },
  setInfoIcon(state, val) {
    state.infoIcon = val;
  },
  setMoneys(state, val) {
    state.moneys = val;
  },
  setBottom(state, val) {
    state.bottom = val;
  },
  setParameter(state, val) {
    state.parameter = val;
  },
  setadditionalList(state, val) {
    state.additionalList = val;
  },
  //new add
  // 分类菜单
  setCatergories(state, val) {
    state.catergories = val;
  },
  // 产品详情
  setPreViewData(state, val) {
    state.preViewData = val;
  },
  setModel(state, val) {
    state.model = val;
  },
  setOptionSpec(state, val) {
    state.optionSpec = val;
  },
  setGlassLIst(state, val) {
    state.glassList = val;
  },
  setDelivery_date(state, val) {
    state.delivery_date = val;
  },
  setCurrencyList(state, val) {
    state.currencyList = val;
  },
  setCurrency(state, val) {
    state.currency = val;
  },

  setEngravingIndex(state, val) {
    state.engravingIndex = val;
  },
  setCaseIndex(state, val) {
    state.caseIndex = val;
  },
  setIsInscribe(state, val) {
    state.isInscribe = val;
  },
};
export default {
  namespaced: true,
  state,
  mutations,
};
