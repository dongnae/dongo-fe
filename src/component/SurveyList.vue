<template>
  <div class="body-content" data-app>
    <h3 class="body-content-header">설문 목록</h3>
    <div style="width: 100%;">
      <div v-for="({name, url, disabled, error}, key) in $store.getters.surveyList" :key="key">
        <v-tooltip v-if="disabled" bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-list-item v-bind="attrs" v-on="on" style="color: rgba(0, 0, 0, 0.38) !important;">
              <v-list-item-title v-text="name"></v-list-item-title>
              <v-list-item-icon>
                <v-icon v-text="'mdi-arrow-right'"></v-icon>
              </v-list-item-icon>
            </v-list-item>
          </template>
          <span>{{ error }}</span>
        </v-tooltip>

        <v-list-item v-else link :to="`/survey/${url}`">
          <v-list-item-title v-text="name"></v-list-item-title>
          <v-list-item-icon>
            <v-icon v-text="'mdi-arrow-right'"></v-icon>
          </v-list-item-icon>
        </v-list-item>
      </div>
    </div>
    <div v-if="$store.getters.auth.isAdmin">
      <v-list-item link to="/admin">
        <v-list-item-title>관리 페이지</v-list-item-title>
        <v-list-item-icon>
          <v-icon v-text="'mdi-arrow-right'"></v-icon>
        </v-list-item-icon>
      </v-list-item>
    </div>
  </div>
</template>

<script>
export default {
  name: "SurveyList",
  data() {
    return {};
  },
}
</script>

<style scoped>

</style>