<template>
  <login v-if="!$store.getters.auth.isLogin"></login>
  <div v-else>
    <v-select v-model="sort_by"
              :items="[{text: '답변 기준 정렬', value: 0},{text: '반별 정렬', value: 1},/*{text: '미답변자만 보기', value: 2}*/]"
              :menu-props="{ maxHeight: '400' }"
              label="정렬 기준을 선택하세요."
              style="margin: 10px 0;">
    </v-select>
    <v-expansion-panels v-if="sort_by === 0" style="width: 110%;">
      <v-expansion-panel v-for="({id, name, quest}) in Object.values(survey.ans_by)" :key="id">
        <v-expansion-panel-header><h1 style="font-weight: bold;">{{ name }}</h1></v-expansion-panel-header>
        <v-expansion-panel-content>
          <table style="table-layout: auto;">
            <thead>
            <tr>
              <td style="width: 30%">이름</td>
              <td style="width: 30%">모집 현황</td>
              <td style="width: 40%">학생 목록</td>
            </tr>
            </thead>
            <tbody>
            <tr v-for="{value, count, students} of Object.values(quest)">
              <td style="width: 30%;">{{ value }}</td>
              <td style="width: 30%;">{{ count === -1 ? "∞" : (count > 0 ? `${count}명 남음` : `마감됨`) }}</td>
              <td style="width: 40%; padding: 0;">
                <table style="border-collapse: collapse;">
                  <tbody>
                  <tr v-for="student of students">
                    <td>{{ student.num }}</td>
                    <td>{{ student.name }}</td>
                  </tr>
                  </tbody>
                </table>
              </td>
            </tr>
            </tbody>
          </table>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
    <v-expansion-panels v-else-if="sort_by === 1" style="width: 110%;">
      <v-expansion-panel v-for="({id, name, group}) in Object.values(survey.group_by)" :key="id">
        <v-expansion-panel-header><h1 style="font-weight: bold;">{{ name }}</h1></v-expansion-panel-header>
        <v-expansion-panel-content>
          <table style="table-layout: auto;">
            <thead>
            <tr>
              <td style="width: 15%">반</td>
              <td style="width: 85%; padding: 0;">
                <table style="border-collapse: collapse;">
                  <thead>
                  <tr>
                    <td style="width: 25%;">학번</td>
                    <td style="width: 25%;">이름</td>
                    <td style="width: 50%;">답변</td>
                  </tr>
                  </thead>
                </table>
              </td>
            </tr>
            </thead>
            <tbody>
            <tr v-for="{value, students} of Object.values(group)">
              <td style="width: 15%;">{{ value }}</td>
              <td style="width: 85%; padding: 0;">
                <table style="border-collapse: collapse;">
                  <tbody>
                  <tr v-for="student of students">
                    <td style="width: 25%;">{{ student.num }}</td>
                    <td style="width: 25%;">{{ student.name }}</td>
                    <td style="width: 50%;">{{ student.ans }}</td>
                  </tr>
                  </tbody>
                </table>
              </td>
            </tr>
            </tbody>
          </table>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>

</template>

<script>
import Login from "@/component/Login";

export default {
  name: "Admin",
  components: {Login},
  data() {
    return {
      sort_by: 0, //0: group by, 1: class by, 2: 미신청자
    };
  },
  computed: {
    survey() {
      return this.$store.getters.surveyResult;
    },
    auth() {
      return this.$store.getters.auth;
    }
  },
  created() {
    if (this.$store.getters.auth.isLogin && !this.$store.getters.auth.isAdmin) {
      alert('권한이 부족합니다.');
      this.$router.push({
        name: 'Home'
      });
    }
  },
  watch: {
    auth() {
      if (this.$store.getters.auth.isLogin && !this.$store.getters.auth.isAdmin) {
        alert('권한이 부족합니다.');
        this.$router.push({
          name: 'Home'
        });
      }
    }
  },
}
</script>

<style>
.container {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.unregister {
  width: 30%;
}

.register {
  width: 65%;
}

table {
  border-collapse: collapse;
  width: 100%;
}

th, td {
  border: 1px solid #ddd;
  text-align: left;
  padding: 15px;
}

.unregister th, .unregister td {
  padding: 10px;
}

.register table table th, .register table table td {
  border: 0;
}

.register table table td {
  border-right: 1px solid #ddd;
  border-bottom: 1px solid #ddd;
}

.register table table tr td:nth-last-child(1) {
  border-right: 0;
}

.register table table tr:nth-last-child(1) td {
  border-bottom: 0;
}

.v-expansion-panel-content__wrap {
  padding: 0 !important;
}

@media only screen and (max-width: 1280px) {
  .container {
    flex-direction: column;
    justify-content: center;
  }

  .container > * {
    width: 100%;
  }

  .register {
    margin-bottom: 40px;
  }
}
</style>