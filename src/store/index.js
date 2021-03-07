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

			res = {
				result: 1,
				result_data: "존재하지 않는 학번 또는 이름입니다."
			};
			if (1)
				res = {
					result: 0,
					result_data: {
						jwt: '1',
						num: '30608',
						name: '박찬솔'
					},
				};


			Vue.$cookies.remove('auth');
			if (typeof res !== "object" || res.result !== 0) {
				auth.errorMessage = res.result_data ? res.result_data : '';
			} else {
				res = res.result_data;
				Vue.$cookies.set('auth', res.jwt);

				state.surveyList = (await axios.get(`${location.origin}/api/survey/list`)).data;
				state.surveyList = [
					{name: "테스트 (~3/10)", url: 'test', disabled: false},
					{name: "진로 체험", url: 'jinro', disabled: true},
				];

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
