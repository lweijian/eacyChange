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
		userName: "未登录",
		avatarUrl:"",
		univerifyErrorMsg: "",
		hideUniverify: true
	},
	mutations: {
		login(state, userName,avatarUrl) {
			state.userName = userName || '新用户';
			state.hasLogin = true;
			state.avatarUrl=avatarUrl|| '';
		},
		logout(state) {
			state.userName = "";
			state.hasLogin = false;
		},
		setUniverifyErrorMsg(state, payload = '') {
			state.univerifyErrorMsg = payload
		},
		setHideUniverify(state, payload = false) {
			state.hideUniverify = payload
		}
	}
})

export default store
