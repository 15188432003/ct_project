const model = {
	namespaced: true, // 开启命名空间
	state: {
		colorInfo: {},
		defaultLensInfo: {},
		lensesList: {},
		lensList: [],
		sampleInfo: {},
		dotStatus: false,
		dotTrue: false,
		rate: {
			value: 1,
			code: "USD",
			symbol: "$",
		},
		catergories: {},
		options: [],
		configuration: {},
		tabIndex: -1,
		checkID: "",
		optionSpec: [],
		currencyList: [],
		currency: {},
		delivery_date: "",
		glassesInscribe: {
			isInscribe: "No",
			text: "",
		}, //眼镜刻字
		mirrorBox: {
			isInscribe: "No",
			text: "ROKiT|EYE Q",
		}, //镜盒 
		isInscribe: [], //刻字内容
		engravingIndex: null,
		caseIndex: null,
	},
	mutations: {
		SET_RATE: (state, info) => {
			let data = Object.assign({}, state.rate, info);
			state.rate = data;
		},
		SET_COLOR_INFO: (state, info) => {
			// const colorList = [...state.colorList]
			// let isHasName = false
			// colorList.forEach(item => {
			// 	if (item.name === row.name) {
			// 		item.value = row.value
			// 		item.parameterDispalyImage = row.parameterDispalyImage
			// 		isHasName = true
			// 	}
			// })
			// if (!isHasName) {
			// 	colorList.push(row)
			// }
			state.colorInfo = info;
		},
		SET_DEFAULT_LENS: (state, info) => {
			state.defaultLensInfo = info;
		},
		SET_LENS_LIST: (state, list) => {
			state.lensList = list;
		},
		SET_LENSES_LIST: (state, list) => {
			state.lensesList = list;
		},
		SET_SAMPLE_INFO: (state, info) => {
			state.sampleInfo = info;
		},
		SET_DOT_STATUS: (state, status) => {
			state.dotStatus = status;
		},
		SET_DOT_TRUE: (state, status) => {
			state.dotTrue = status;
		},
		setCatergories(state, val) {
			state.catergories = val;
		},
		setOptions(state, val) {
			state.options = val;
		},
		setConfiguration(state, val) {
			state.configuration = val;
		},
		setTabIndex(state, val) {
			state.tabIndex = val;
		},
		setCheckID(state, val) {
			state.checkID = val;
		},
		setOptionSpec(state, val) {
			state.optionSpec = val;
		},
		setCurrencyList(state, val) {
			state.currencyList = val;
		},
		setCurrency(state, val) {
			state.currency = val;
		},
		setDelivery_date(state, val) {
			state.delivery_date = val;
		},
		setInscribe(state, val) {
			state.glassesInscribe = val
		},
		setMirrorBox(state, val) {
			state.mirrorBox = val
		},
		setIsInscribe(state, val) {
			state.isInscribe = val;
		},
		setEngravingIndex(state, val) {
			state.engravingIndex = val;
		},
		setCaseIndex(state, val) {
			state.caseIndex = val;
		},
	},
	actions: {},
};

export default model;
