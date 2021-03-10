<template>
  <login v-if="!$store.getters.auth.isLogin"></login>
  <div v-else style="width: 110%;">
    <div v-for="({id, name, quest}) in Object.values(survey)" :key="id">
      <h1 style="font-weight: bold;">{{ name }}</h1>
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
    </div>

  </div>
</template>

<script>
import Login from "@/component/Login";

export default {
  name: "Admin",
  components: {Login},
  data() {
    return {
    };
  },
  computed: {
      survey() {
        return this.$store.getters.surveyResult;
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
  beforeDestroy() {
    this.unwatch();
  }
}
</script>

<style scoped>
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