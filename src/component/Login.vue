<template>
  <div class="body-content">
    <h3 class="body-content-header">로그인</h3>
    <div style="width: 100%;">
      <v-text-field
          ref="num"
          v-model="login_input.num"
          :rules="[
              value => (value && value.length) ? true : '필수 항목입니다.',
              value => (value && value.length === 5) ? true : '학번을 정확하게 입력하세요.',
          ]"
          label="학번"
          counter="5"
          hide-details="auto"
          hint="5자리 학번을 입력하세요."
          class="num-field"
          filled
          maxlength="5"
          required
          style="margin-top: 20px;"
      ></v-text-field>
      <v-text-field
          ref="name"
          v-model="login_input.name"
          :rules="[
              value => (value && value.length) ? true : '필수 항목입니다.',
              value => (value && value.length >= 2) ? true : '이름을 정확하게 입력하세요.',
          ]"
          :type="login_input.num === 'admin' ? 'password' : 'text'"
          :label="login_input.num === 'admin' ? '비밀번호' : '이름'"
          counter="0"
          :hint="(login_input.num === 'admin' ? '비밀번호를' : '이름을') + ' 입력하세요,'"
          hide-details="auto"
          filled
          maxlength="4"
          required
          style="margin-top: 20px;"
      ></v-text-field>
      <p class="error--text" style="font-size: 12px;">{{ $store.getters.auth.errorMessage }}</p>
      <v-btn
          color="primary"
          elevation="2"
          outlined
          style="margin-top: 20px; width: 100%;"
          @click="$store.dispatch('tryLogin', {
            num: login_input.num,
            name: login_input.name,
          })"
      >로그인</v-btn>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      login_input: {
        num: "",
        name: ""
      },
    };
  }
}
</script>

<style scoped>

</style>