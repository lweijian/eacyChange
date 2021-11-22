import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		/**
		 * 是否需要强制登录
		 */
		forcedLogin: false,
		hasLogin: false,
		userInfo:{},
		uniIdToken:"",
		univerifyErrorMsg: "",
		hideUniverify: true
	},
	mutations: {
		login(state, userInfo,uniIdToken) {
			state.userInfo=userInfo
			state.uniIdToken = uniIdToken;
				state.hasLogin = true;
		},
		logout(state) {
			state.nickName = "";
			state.hasLogin = false;
		},
		setUniverifyErrorMsg(state, payload = '') {
			state.univerifyErrorMsg = payload
		},
		setHideUniverify(state, payload = false) {
			state.hideUniverify = payload
		}
	},
	getters:{
		getUserInfo:state=>{
			return state.userInfo;
		},
		getUniIdToken:state=>{
			return state.uniIdToken;
		},
		
	}
})

export default store
