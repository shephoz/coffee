<template>
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
              v-for="bean in availableBeans"
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
        <td>{{ temperatureView(brewing.temperature) }}</td>
        <td>{{ brewing.amount }}</td>
        <td style="width: 400px">{{ brewing.comment }}</td>
        <td>{{ ratingView(brewing.rating) }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import BrewingRepository from "@/repository/brewings.js";
import BottlesRepository from "@/repository/bottles.js";

function refreshedNewBrewing() {
  return {
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
  };
}

export default {
  name: "Brewings",
  data: () => ({
    newBrewing: refreshedNewBrewing(),
  }),
  props: {
    availableBeans: Array,
    brewings: Array,
  },
  async created() {},
  computed: {},
  methods: {
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
        const data = await BrewingRepository.createBrewing({
          brewed_at: brewedAt,
          bean,
          grind,
          temperature,
          amount,
          comment,
          rating,
        });
        await BottlesRepository.addBottle(bottleColor, data[0].id);
      } catch (error) {
        alert("Request Error: " + JSON.stringify(error));
      }
      this.newBrewing = refreshedNewBrewing();
      this.$emit("refresh");
    },
    ratingView(rating) {
      return BrewingRepository.ratingMap[rating];
    },
    temperatureView(temperature) {
      return BrewingRepository.temperatureMap[temperature];
    },
  },
};
</script>
