<template>
  <div>
    <h1 style="font-weight: 700;">{{ surveyInfo.name }}</h1>
    <hr style="border-top: rgba(0, 0, 0, .7) 1px; margin: 15px 0; height: 1px;">
    <div v-if="cantSubmitted !== null">
      {{ cantSubmitted }}
    </div>
    <div v-else-if="status === 0">
      <div v-if="questions.filter(({unique}) => unique).length > 0">
        <p>{{ questions.filter(({unique}) => unique).map(({quest}) => `"${quest}"`).join(", ") }}에 대한 답변은 서로 달라야 합니다.</p>
        <hr style="margin: 10px 0; border-top: 1px rgba(0, 0, 0, 0.7);">
      </div>

      <div
          v-for="({quest, ans, multiple, id}) in questions"
          :key="id"
      >
        <div style="width: 100%; display: flex; justify-content: space-between">
          <h3 style="font-weight: 500;">{{ quest }}</h3>
          <v-btn icon color="black" @click="selections[id] = null;">
            <v-icon>mdi-refresh</v-icon>
          </v-btn>
        </div>
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
    <p v-else-if="status === 1">설문이 종료되었습니다.</p>
    <p v-else-if="status === 2">{{ `설문 시작까지 ${waitTime} 남았습니다.` }}</p>
    <p class="error--text" style="font-size: 12px;">{{ errorMessage }}</p>
    <v-btn
        v-if="status === 0"
        color="primary"
        elevation="2"
        outlined
        style="margin-top: 20px; width: 100%;"
        @click="submit"
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
      cantSubmitted: null,

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
      let payload = {}, alertMsg = [], used = {};
      for (let obj of this.questions) {
        payload[obj.id] = this.selections[obj.id] || [];
        if (!Array.isArray(payload[obj.id])) payload[obj.id] = [payload[obj.id]];
        if (payload[obj.id].length > 0) {
          if (obj.unique) {
            for (let s of payload[obj.id]) {
              let id = obj.ans.filter(a => a.value === s);
              if (id.length !== 1) {
                alert("오류가 발생했습니다.");
                return;
              }
              id = id.shift().id;
              if (used[id] !== undefined) {
                alert(`"${obj.quest}"에 대한 답변 "${id}"이(가) 중복되었습니다.`);
                return;
              } else used[id] = true;
            }
          }
          alertMsg.push(`${obj.quest} : ${payload[obj.id].join(", ")}`);
        } else {
          if (obj.required) {
            alert(`"${obj.quest}"에 대한 답변을 선택하세요.`);
            return;
          }
          alertMsg.push(`${obj.quest} : (없음)`);
        }
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
        if (parseInt(sec / 3600) > 0) ret += `${parseInt(sec / 3600)}시간 `;
        if (parseInt((sec % 3600) / 60) > 0) ret += `${parseInt((sec % 3600) / 60)}분 `;
        if (sec % 60 > 0) ret += `${parseInt(sec % 60)}초 `;

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
    if (typeof this.surveyInfo.error === "string") {
      //this.cantSubmitted = this.surveyInfo.error;
      alert(this.surveyInfo.error);
      await this.$router.push({
        name: 'Home'
      });
      return;
    }

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
