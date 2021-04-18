<template>
  <login v-if="!$store.getters.auth.isLogin"></login>
  <survey-list v-else></survey-list>
</template>

<script>
import Login from "@/component/Login";
import SurveyList from "@/component/SurveyList";

export default {
  name: 'Home',
  components: {Login, SurveyList}
}
</script>

<style>
.v-text-field .v-input__control .v-input__slot {
  min-height: auto !important;
  display: flex !important;
  align-items: center !important;
}

.body-content {
  display: flex;
  width: 40%;
  flex-direction: column;
  align-items: center;
}

.body-content-header {
  font-weight: 600;
  font-size: 35px;
  text-align: left;
  width: 100%;
}


@media (max-width: 1000px) {

  .body-content {
    display: flex;
    justify-content: center;
    width: 80%;
    max-width: 300px;
    /* min-width: 200px; */
    flex-direction: column;
    align-items: center;
  }

  .body-content-header {
    font-weight: 600;
    font-size: 30px;
    text-align: center;
    width: 100%;
  }

}
</style>
