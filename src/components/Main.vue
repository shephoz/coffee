<template>
  <div>
    <p>{{ msg }}</p>
    <table border="1">
      <tr v-for="[color, brewing] in bottles" :key="color">
        <td :style="{ width: '30px', backgroundColor: color }"></td>
        <td>
          {{ labelOfBrewingInBottle(brewing[0]) }}
        </td>
        <td>
          {{ labelOfBrewingInBottle(brewing[1]) }}
        </td>
        <td>
          <button v-if="brewing" @click="drinkUp(color)">飲んだ</button>
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
        <tr>
          <td><input v-model="newBrewing.brewedAt" /></td>
          <td>
            <select v-model="newBrewing.bean">
              <option
                v-for="bean in beansAvailable"
                :key="bean.id"
                :value="bean.id"
              >
                {{ bean.name }}
              </option>
            </select>
          </td>
          <td><input v-model="newBrewing.grind" /></td>
          <td><input v-model="newBrewing.temperature" /></td>
          <td><input v-model="newBrewing.amount" /></td>
          <td>
            <textarea style="width: 400px" v-model="newBrewing.comment" />
          </td>
          <td><input v-model="newBrewing.rating" /></td>
          <td>
            <label>
              <input
                type="radio"
                v-model="newBrewing.bottleColor"
                name="botle-color"
                value="black"
              />black
            </label>
            <label>
              <input
                type="radio"
                v-model="newBrewing.bottleColor"
                name="botle-color"
                value="white"
              />white
            </label>
            <label>
              <input
                type="radio"
                v-model="newBrewing.bottleColor"
                name="botle-color"
                value="blue"
              />blue
            </label>
            <button @click="addBrewing()">作成</button>
          </td>
        </tr>
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
import { getBrewings, createBrewing } from "@/repository/brewings.js";
import { getBottles, setBottle } from "@/repository/bottles.js";
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
    newBrewing: {
      brewedAt: `${new Date().getFullYear()}-${(new Date().getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${new Date().getDate().toString().padStart(2, "0")}`,
      bean: "",
      grind: 11,
      temperature: 2,
      amount: 1000,
      comment: "",
      rating: null,
      bottleColor: null,
    },
  }),
  async created() {
    await this.fetchData();
  },
  computed: {
    beansAvailable() {
      return this.beans.filter((bean) => !bean.usedUpAt);
    },
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
    labelOfBrewingInBottle(brewing) {
      return brewing ? `${brewing.bean}(${brewing.brewedAt})` : "なし";
    },
    async drinkUp(color) {
      if (!confirm(`Drinked up ${color} bottle?`)) return;
      try {
        const [{ brewing, nextup }] = await setBottle(
          color,
          this.bottles.get(color)[1]?.id || null,
          null
        );
        this.bottles.set(color, [brewing, nextup]);
      } catch (error) {
        alert("Request Error: " + JSON.stringify(error));
      }
    },
    async addBrewing() {
      try {
        const {
          brewedAt,
          bean,
          grind,
          temperature,
          amount,
          comment,
          rating,
          bottleColor,
        } = this.newBrewing;
        const data = await createBrewing({
          brewed_at: brewedAt,
          bean,
          grind,
          temperature,
          amount,
          comment,
          rating,
        });
        const beanName = this.beans.find((el) => el.id === bean).name;
        this.brewings.unshift({
          brewedAt,
          bean: beanName,
          grind,
          temperature,
          amount,
          comment,
          rating,
        });
        await setBottle(bottleColor, data[0].id);
        this.bottles.set(bottleColor, {
          brewedAt,
          bean: beanName,
        });
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
