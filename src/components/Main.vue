<template>
  <div>
    <p>{{ msg }}</p>
    <table border="1">
      <tr v-for="[color, brewing] in bottles" :key="color">
        <td :style="{ width: '30px', backgroundColor: color }"></td>
        <td>
          {{ brewing ? `${brewing.bean}(${brewing.brewedAt})` : "なし" }}
        </td>
      </tr>
    </table>

    <table border="1">
      <thead>
        <tr>
          <th>抽出日</th>
          <th>豆</th>
          <th>挽目</th>
          <th>水温</th>
          <th>量</th>
          <th>コメント</th>
          <th>評価</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="brewing in brewings" :key="brewing.id">
          <td>{{ brewing.brewedAt }}</td>
          <td>{{ brewing.bean }}</td>
          <td>{{ brewing.grind }}</td>
          <td>{{ brewing.temperature }}</td>
          <td>{{ brewing.amount }}</td>
          <td style="width: 400px">{{ brewing.comment }}</td>
          <td>{{ brewing.rating }}</td>
        </tr>
      </tbody>
    </table>

    <table border="1">
      <thead>
        <tr>
          <th>購入日</th>
          <th>名前</th>
          <th>購入店</th>
          <th>量</th>
          <th>単価</th>
          <th>煎り</th>
          <th>使い切った</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="bean in beans" :key="bean.id">
          <td>{{ bean.boughtAt }}</td>
          <td>{{ bean.name }}</td>
          <td>{{ bean.shop }}</td>
          <td>{{ bean.amount }}</td>
          <td>{{ bean.price }}</td>
          <td>{{ bean.roast }}</td>
          <td>{{ bean.usedUpAt }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { getBrewings } from "@/repository/brewings.js";
import { getBottles } from "@/repository/bottles.js";
import { getBeans } from "@/repository/beans.js";

export default {
  name: "Main",
  props: {
    msg: String,
  },
  data: () => ({
    brewings: [],
    beans: [],
    bottles: new Map(),
  }),
  async created() {
    await this.fetchData();
  },
  methods: {
    async fetchData() {
      try {
        this.bottles = await getBottles();
        this.brewings = await getBrewings();
        this.beans = await getBeans();
      } catch (error) {
        alert("Request Error: " + JSON.stringify(error));
      }
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
table {
  margin: 40px auto;
}
th {
  padding: 20px 60px;
}
</style>
