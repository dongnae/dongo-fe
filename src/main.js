import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import '@mdi/font/css/materialdesignicons.css'
import VueCookies from 'vue-cookies';

import axios from "axios";

axios.interceptors.request.use(function (request) {
	if (Vue.$cookies.get('auth')) request.headers.Authorization = Vue.$cookies.get('auth');
	request.headers["Content-Type"] = "application/json; charset=utf-8";
	return request;
}, function (error) {
	return Promise.reject(error);
});
axios.interceptors.response.use(function (response) {
	return response;
}, function (error) {
	return error.response;
});

Vue.config.productionTip = false


new Vue({
	router,
	store,
	vuetify,
	VueCookies,
	render: h => h(App)
}).$mount('#app')
