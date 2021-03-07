<template>
  <div class="survey-content">
    <h1 style="font-weight: 700;">{{ surveyInfo.name }}</h1>
    <hr style="border-top: rgba(0, 0, 0, .7) 1px; margin: 15px 0; height: 1px;">
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
    <p class="error--text" style="font-size: 12px;">{{ errorMessage }}</p>
    <v-btn
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
    };
  },
  computed: {
    id() {
      return this.$route.params.id;
    }
  },
  methods: {
    async submit() {
      let payload = {}, alertMsg = [];
      for (let obj of this.questions) {
        payload[obj.id] = this.selections[obj.id] || [];
        if (payload[obj.id].length > 0) alertMsg.push(`${obj.quest} : ${payload[obj.id].join(", ")}`);
        else alertMsg.push(`${obj.quest} : (없음)`);
      }
      if (!confirm(`설문을 제출하시겠습니까?\n\n- 설문 작성 내용 : \n${alertMsg.join("\n")}\n\n※ 한 번만 제출할 수 있습니다.`)) return;
      console.log(this.selections, payload);
      let ret = (await axios.post(`${location.origin}/api/survey/submit`, JSON.stringify({
        id: this.id,
        data: payload
      }))).data;
      if (typeof ret !== "object") {
        this.errorMessage = "오류가 발생했습니다.";
        return;
      }
      if (ret.result) {
        this.errorMessage = ret.result_data || "오류가 발생했습니다.";
        return;
      }

      alert("설문을 제출하였습니다.");
      await this.$router.push({
        name: 'Home'
      });
    }
  },
  async created() {
    let find = this.$store.getters.surveyList.filter(({url, name}) => url === this.id);
    if (find.length !== 1) {
      this.$router.push({
        name: 'Home'
      });
      return;
    }
    this.surveyInfo = find.shift();

    this.questions = (await axios.get(`${location.origin}/api/survey/detail?id=${encodeURI(this.id)}`)).data;
    this.questions = [
      {
        quest: "신청할 과목을 선택하세요. (월요일)",
        ans: [
          {text: "국어 (마감됨)", disabled: true, value: '국어'},
          {text: "수학1 (10명 신청 가능)", disabled: false, value: '수학1'},
        ],
        multiple: true,
        id: 0
      },
      {
        quest: "신청할 과목을 선택하세요. (화요일)",
        ans: [
          {text: "수학2 (3명 신청 가능)", disabled: false, value: '수학2'},
          {text: "과학 (2명 신청 가능)", disabled: false, value: '과학'},
        ],
        multiple: true,
        id: 1
      },
    ];
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