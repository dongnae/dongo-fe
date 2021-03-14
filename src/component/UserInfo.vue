<template>
  <div style="position: fixed; top: 20px; right: 20px; display: flex; justify-content: center; color: white;">
    <p style="display: inline-block; padding: 0 5px;">{{ $store.getters.auth.num === "admin" ? "관리자" : `${$store.getters.auth.name} (${$store.getters.auth.num})님` }} | </p>
    <p @click="logout" style="font-weight: bold; text-decoration: underline; cursor: pointer;">로그아웃</p>
  </div>
</template>

<script>
import axios from "axios";
import Vue from "vue";

export default {
  name: "UserInfo",
  methods: {
    async logout() {
      let surveyList = (await axios.get(`${location.origin}/api/auth/logout`)).data;
      Vue.$cookies.remove("auth");
      if (surveyList.result === 0) alert("로그아웃하였습니다.");
      location.reload();
    },
  }
}
</script>

<style scoped>

</style>