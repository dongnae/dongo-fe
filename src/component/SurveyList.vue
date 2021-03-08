<template>
  <div class="body-content" data-app>
    <h3 class="body-content-header">설문 목록</h3>
    <div style="width: 100%;">
      <div v-for="({name, url, disabled}, key) in $store.getters.surveyList" :key="key">
        <v-tooltip v-if="disabled" bottom @click="alert('이미 제출한 설문입니다.');">
          <template v-slot:activator="{ on, attrs }">
            <v-list-item v-bind="attrs" v-on="on" style="color: rgba(0, 0, 0, 0.38) !important;">
              <v-list-item-title v-text="name"></v-list-item-title>
              <v-list-item-icon>
                <v-icon v-text="'mdi-arrow-right'"></v-icon>
              </v-list-item-icon>
            </v-list-item>
          </template>
          <span>이미 제출한 설문입니다.</span>
        </v-tooltip>

        <v-list-item v-else link :to="`/survey/${url}`">
          <v-list-item-title v-text="name"></v-list-item-title>
          <v-list-item-icon>
            <v-icon v-text="'mdi-arrow-right'"></v-icon>
          </v-list-item-icon>
        </v-list-item>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SurveyList",
  data() {
    return {};
  },
  created() {
    this.$store.commit('setSurveyList');
  }
}
</script>

<style scoped>

</style>