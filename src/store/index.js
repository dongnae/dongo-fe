import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import VueCookies from 'vue-cookies';

Vue.use(Vuex);
Vue.use(VueCookies);

const setSurveyList = async (state) => {
	let surveyList = (await axios.get(`https://dnhs.me/api/survey/list`)).data;
	if (surveyList.result === 0) state.surveyList = surveyList.result_data;
	else {
		alert("설문 목록 로딩 실패\n새로고침합니다...");
		location.reload();
	}
};

export default new Vuex.Store({
	state: {
		auth: {
			jwt: "",
			num: "",
			name: "",
			isLogin: false,
			isAdmin: false,

			errorMessage: "",

			loading: true,
		},
		surveyList: [],
		surveyResult: [],
	},
	mutations: {
		async setSurveyList(state) {
			await setSurveyList(state);
		},
		async tryAuth(state, payload) {
			let auth = state.auth;
			if (payload === null) {
				auth.loading = false;
				return;
			}
			Vue.$cookies.remove('auth');
			let res = (await axios.post(`https://dnhs.me/api/auth/login`, JSON.stringify(payload))).data;

			if (typeof res !== "object" || res.result !== 0) {
				if (payload.jwt === undefined) auth.errorMessage = res && res.result_data ? res.result_data : '오류가 발생했습니다.';
			} else {
				res = res.result_data;
				Vue.$cookies.set('auth', res.jwt);

				await setSurveyList(state);

				auth.isLogin = true;
				auth.jwt = res.jwt;
				auth.num = res.num;
				auth.name = res.name;
				auth.isAdmin = res.isAdmin || false;

				if (auth.isAdmin) {
					let ret = (await axios.get(`https://dnhs.me/api/survey/result`)).data;
					if (ret.result !== 0) {
						alert('로딩 실패');
						await this.$router.push({
							name: 'Home'
						});
						return;
					}

					state.surveyResult = ret.result_data;
				}
			}
			auth.loading = false;
		}
	},
	actions: {
		tryAutoLogin({commit}) {
			let jwt = Vue.$cookies.get("auth");
			commit('tryAuth', jwt ? {
				jwt: jwt
			} : null);
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
		surveyResult(state) {
			return state.surveyResult;
		},
	}
})
