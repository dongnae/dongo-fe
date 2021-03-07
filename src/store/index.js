import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import VueCookies from 'vue-cookies';

Vue.use(Vuex);
Vue.use(VueCookies);

export default new Vuex.Store({
	state: {
		auth: {
			jwt: "",
			num: "",
			name: "",
			isLogin: false,

			errorMessage: "",

			loading: true,
		},
		surveyList: [],
	},
	mutations: {
		async tryAuth(state, payload) {
			let auth = state.auth;
			if (payload === null) {
				auth.loading = false;
				return;
			}
			let res = (await axios.post(`${location.origin}/api/auth/login`, JSON.stringify(payload))).data;

			Vue.$cookies.remove('auth');
			if (typeof res !== "object" || res.result !== 0) {
				auth.errorMessage = res && res.result_data ? res.result_data : '오류가 발생했습니다.';
			} else {
				res = res.result_data;
				Vue.$cookies.set('auth', res.jwt);

				let surveyList = (await axios.get(`${location.origin}/api/survey/list`)).data;
				if (surveyList.result === 0) state.surveyList = surveyList.result_data;
				else {
					alert("설문 목록 로딩 실패\n새로고침합니다...");
					location.reload();
					return;
				}

				auth.isLogin = true;
				auth.jwt = res.jwt;
				auth.num = res.num;
				auth.name = res.name;
			}
			auth.loading = false;
		}
	},
	actions: {
		tryAutoLogin({commit}) {
			let jwt = Vue.$cookies.get("auth");
			setTimeout(() => {
				commit('tryAuth', jwt ? {
					jwt: jwt
				} : null);
			}, 1000);
		},
		tryLogin({commit}, {num, name}) {
			commit('tryAuth', {
				num: num,
				name: name
			});
		}
	},
	getters: {
		auth(state) {
			return state.auth;
		},
		surveyList(state) {
			return state.surveyList;
		},
	}
})
