<template>
  <div id="app">
    <div class="main-text">
      <div style="width: auto;">
        <h1 class="main-text-header">동래고등학교</h1>
        <h4 class="main-text-content">설문 페이지에 오신 것을 환영합니다.</h4>
      </div>
    </div>
    <div class="body" data-app>
      <v-progress-circular
          v-if="$store.getters.auth.loading"
          indeterminate
          color="primary"
      ></v-progress-circular>
      <router-view v-else-if="!$store.getters.auth.isLogin"></router-view>

      <user-info v-if="$store.getters.auth.isLogin"></user-info>
    </div>
    <div class="bg-ellipse">
    </div>
  </div>
</template>

<script>
import UserInfo from "@/component/UserInfo";
export default {
  components: {UserInfo},
  data() {
    return {};
  },
  created() {
    this.$store.dispatch('tryAutoLogin');
  }
};
</script>

<style lang="scss">
@font-face {
  font-family: 'S-CoreDream';
  src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_six@1.2/S-CoreDream-9Black.woff') format('woff');
  font-weight: 900;
  font-style: normal;
}

@font-face {
  font-family: 'S-CoreDream';
  src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_six@1.2/S-CoreDream-8Heavy.woff') format('woff');
  font-weight: 800;
  font-style: normal;
}

@font-face {
  font-family: 'S-CoreDream';
  src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_six@1.2/S-CoreDream-7ExtraBold.woff') format('woff');
  font-weight: 700;
  font-style: normal;
}

@font-face {
  font-family: 'S-CoreDream';
  src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_six@1.2/S-CoreDream-6Bold.woff') format('woff');
  font-weight: 600;
  font-style: normal;
}

@font-face {
  font-family: 'S-CoreDream';
  src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_six@1.2/S-CoreDream-5Medium.woff') format('woff');
  font-weight: 500;
  font-style: normal;
}

@font-face {
  font-family: 'S-CoreDream';
  src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_six@1.2/S-CoreDream-4Regular.woff') format('woff');
  font-weight: 400;
  font-style: normal;
}

@font-face {
  font-family: 'S-CoreDream';
  src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_six@1.2/S-CoreDream-3Light.woff') format('woff');
  font-weight: 300;
  font-style: normal;
}

@font-face {
  font-family: 'S-CoreDream';
  src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_six@1.2/S-CoreDream-2ExtraLight.woff') format('woff');
  font-weight: 200;
  font-style: normal;
}

@font-face {
  font-family: 'S-CoreDream';
  src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_six@1.2/S-CoreDream-1Thin.woff') format('woff');
  font-weight: 100;
  font-style: normal;
}

html, head, body {
  margin: 0;
  padding: 0;
  overflow: hidden !important;
}

* {
  font-family: "S-CoreDream", sans-serif;
  font-weight: 400;
}

::selection {
  background: #b3d4fc;
  text-shadow: none;
}

.error--text {
  color: #ff5252 !important;
}

body {
  height: 100vh;
  width: 100vw;
  background: linear-gradient(116.82deg, #4286F4 0%, #56E1FF 100%);
}

#app {
  display: flex;
  align-items: center;

  width: 100%;
  height: 100%;
}

#app > * {
  flex: 1;

  display: inline-flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  text-align: left;
}

.main-text {
  height: 100vh;
  width: auto;
  color: white;
  filter: drop-shadow(0px 4px 0px rgba(0, 0, 0, 0.25));

}

.main-text-header {
  font-weight: 800;
  font-size: 60px;
  animation: appear-bottom 0.6s ease;
}

.main-text-content {
  font-weight: 500;
  font-size: 20px;
  animation: appear-bottom 0.8s ease;
}

.body {
  height: 70%;
  background: #FFFFFF;
  box-shadow: 0 6px 0 rgba(0, 0, 0, 0.25);
  border-radius: 48px 0 0 48px;
}

.bg-ellipse {
  flex: 0 1 0 !important;
  position: fixed;
  z-index: -99999;
  background: rgba(255, 255, 255, 0.3);
  width: max(100vw, 100vh);
  height: max(100vw, 100vh) !important;
  box-shadow: rgb(255 255 255 / 25%) 0 0 62px 20px;
  border-radius: max(100vw, 100vh);
  margin-left: -20vw;

  animation: appear-left 0.4s ease;
}

@media (max-width: 1000px) {

  #app {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;

    width: 100%;
    height: 100%;
  }

  #app > * {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    text-align: center;
  }

  .main-text {
    height: 100vh;
    width: auto;
    color: white;
    filter: drop-shadow(0px 2px 0px rgba(0, 0, 0, 0.25));

    flex: 1 !important;
  }

  .main-text-header {
    font-weight: 800;
    font-size: 40px;
    animation: appear-top 0.6s ease;
  }

  .main-text-content {
    font-weight: 500;
    font-size: 15px;
    animation: appear-top 0.4s ease;
  }

  .body {
    height: 70%;
    background: #FFFFFF;
    box-shadow: 6px 0 0 rgba(0, 0, 0, 0.25);
    border-radius: 48px 48px 0 0;
    width: 85%;

    flex: 2 !important;
  }

  .bg-ellipse {
    flex: 0 1 0 !important;
    position: fixed;
    z-index: -99999;
    background: rgba(255, 255, 255, 0.3);
    width: max(125vw, 125vh);
    height: max(125vw, 125vh) !important;
    box-shadow: rgb(255 255 255 / 25%) 0 0 62px 20px;
    border-radius: max(125vw, 125vh);
    margin: min(-70vw, -70vh) auto 0 auto;

    animation: appear-top 0.4s ease;
  }

}


@keyframes appear-left {
  0% {
    opacity: 0;
    transform: translateX(-40vw) translateY(0);
  }
  100% {
    opacity: 1;
    transform: translateX(0) translateY(0);
  }
}

@keyframes appear-top {
  0% {
    opacity: 0;
    transform: translateX(0) translateY(-40vw);
  }
  100% {
    opacity: 1;
    transform: translateX(0) translateY(0);
  }
}

@keyframes appear-bottom {
  0% {
    opacity: 0;
    transform: translateX(0) translateY(10vw);
  }
  100% {
    opacity: 1;
    transform: translateX(0) translateY(0);
  }
}
</style>
