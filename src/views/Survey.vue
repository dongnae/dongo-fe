<template>
  <div class="survey-content">
    <h1 style="font-weight: 700;">{{ surveyInfo.name }}</h1>
    <hr style="border-top: rgba(0, 0, 0, .7) 1px; margin: 15px 0; height: 1px;">
    <div v-if="status === 0">
      <div
          v-for="({quest, ans, multiple, id}) in questions"
          :key="id"
      >
        <h3 style="font-weight: 500;">{{ quest }}</h3>
        <v-select
            v-model="selections[id]"
            :items="ans"
            :menu-props="{ maxHeight: '400' }"
            :label="quest"
            :multiple="multiple"
            hint=""
            persistent-hint

            style="margin-top: 10px;"
        ></v-select>
      </div>
    </div>

    <p v-else-if="status === 1">신청이 종료되었습니다.</p>
    <p v-else-if="status === 2">{{ `설문 시작까지 ${waitTime} 남았습니다.` }}</p>
    <p class="error--text" style="font-size: 12px;">{{ errorMessage }}</p>
    <v-btn
        color="primary"
        elevation="2"
        outlined
        style="margin-top: 20px; width: 100%;"
        @click="submit"
        :hidden="status !== 0"
    >제출하기
    </v-btn>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Survey",
  data() {
    return {
      surveyInfo: {},
      questions: [],
      selections: {},
      errorMessage: null,

      waitTime: "",
      waitId: null,
      status: 4
    };
  },
  computed: {
    id() {
      return this.$route.params.id;
    }
  },
  methods: {
    isProgressed() {
      return this.surveyInfo.startDate <= Date.now() && Date.now() <= this.surveyInfo.endDate;
    },
    isEnd() {
      return this.surveyInfo.endDate < Date.now();
    },
    isWait() {
      return this.surveyInfo.startDate > Date.now();
    },
    async submit() {
      let payload = {}, alertMsg = [];
      for (let obj of this.questions) {
        payload[obj.id] = this.selections[obj.id] || [];
        if (!Array.isArray(payload[obj.id])) payload[obj.id] = [payload[obj.id]];
        if (payload[obj.id].length > 0) alertMsg.push(`${obj.quest} : ${payload[obj.id].join(", ")}`);
        else alertMsg.push(`${obj.quest} : (없음)`);
      }
      if (!confirm(`설문을 제출하시겠습니까?\n\n- 설문 작성 내용 : \n${alertMsg.join("\n")}\n\n※ 한 번만 제출할 수 있습니다.`)) return;
      let ret = (await axios.post(`${location.origin}/api/survey/submit`, JSON.stringify({
        id: this.id,
        data: payload
      }))).data;
      if (typeof ret !== "object") {
        this.errorMessage = "오류가 발생했습니다.";
        return;
      }
      if (ret.result !== 0) {
        this.errorMessage = ret.result_data || "오류가 발생했습니다.";
        return;
      }

      this.$store.commit('setSurveyList');
      alert("설문을 제출하였습니다.");
      await this.$router.push({
        name: 'Home'
      });
    },
    runAlarm() {
      if (this.id) clearInterval(this.id);
      this.id = setInterval(() => {
        if (this.isProgressed()) clearInterval(this.id);
        let sec = parseInt((this.surveyInfo.startDate - Date.now()) / 1000);
        let ret = "";
        if (parseInt(sec / 3600)) ret += `${parseInt(sec / 3600)}시간 `;
        if (parseInt((sec % 3600) / 60)) ret += `${parseInt((sec % 3600) / 60)}분 `;
        if (sec % 60) ret += `${parseInt(sec % 60)}초 `;

        if (this.isProgressed()) this.status = 0;
        if (this.isEnd()) this.status = 1;
        if (this.isWait()) this.status = 2;

        this.waitTime = ret;
      }, 1000);
    }
  },
  async created() {
    let find = this.$store.getters.surveyList.filter(({url, name}) => url === this.id);
    if (find.length !== 1) {
      await this.$router.push({
        name: 'Home'
      });
      return;
    }
    this.surveyInfo = find.shift();

    let data = (await axios.get(`${location.origin}/api/survey/detail?id=${encodeURI(this.id)}`)).data;
    if (data.result === 0) {
      this.questions = data.result_data;
      this.runAlarm();
    } else {
      alert("설문지 로딩 실패\n새로고침합니다...");
      location.reload();
    }
  }
}
</script>

<style scoped>
.survey-content {
  width: 100%;
  overflow-y: scroll;
  padding: 50px 15%;
  overflow-x: hidden;
}


@media (max-width: 1000px) {

  .survey-content {
    padding-left: 5%;
    padding-right: 5%;
  }

}

</style>