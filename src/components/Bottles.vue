<template>
  <table border="1">
    <tr v-for="[color, brewing] in bottles" :key="color">
      <td :style="{ width: '30px', backgroundColor: color }"></td>
      <td>
        {{ labelOfBrewingInBottle(brewing[0]) }}
      </td>
      <td>
        <div v-if="brewing[0]">
          <label v-for="(label, val) in ratingMap()" :key="val">
            <input
              type="radio"
              :name="'rating-' + color"
              :value="val"
              :checked="isRatingChecked(brewing[0].id, val)"
              @change="setRating(brewing[0].id, val)"
            />
            {{ label }} </label
          ><br />
          <textarea
            @input="setComment(brewing[0].id, $event.target.value)"
            :value="getComment(brewing[0].id)"
          ></textarea>
        </div>
      </td>
      <td>
        {{ labelOfBrewingInBottle(brewing[1]) }}
      </td>
      <td>
        <button v-if="brewing[0]" @click="drinkUp(color)">飲んだ</button>
      </td>
    </tr>
  </table>
</template>

<script>
import BrewingRepository from "@/repository/brewings.js";
import BottlesRepository from "@/repository/bottles.js";

export default {
  name: "Bottles",
  data: () => ({}),
  props: {
    bottles: Object,
    brewings: Array,
  },
  async created() {},
  computed: {},
  methods: {
    labelOfBrewingInBottle(brewing) {
      return brewing ? `${brewing.bean}(${brewing.brewedAt})` : "なし";
    },
    async drinkUp(color) {
      if (!confirm(`Drinked up ${color} bottle?`)) return;
      try {
        const [{ brewing, nextup }] = await BottlesRepository.setBottle(
          color,
          this.bottles.get(color)[1]?.id || null,
          null
        );
        this.bottles.set(color, [brewing, nextup]);
      } catch (error) {
        alert("Request Error: " + JSON.stringify(error));
      }
    },
    ratingView(rating) {
      return BrewingRepository.ratingMap[rating];
    },
    ratingMap() {
      return BrewingRepository.ratingMap;
    },
    isRatingChecked(brewingId, rating) {
      return this.brewings.find((b) => b.id === brewingId)?.rating == rating;
    },
    async setRating(brewingId, rating) {
      try {
        await BrewingRepository.setBrewingRating(brewingId, rating);
      } catch (e) {
        console.error(e);
      }
    },
    getComment(brewingId) {
      return this.brewings.find((b) => b.id === brewingId)?.comment;
    },
    async setComment(brewingId, comment) {
      try {
        await BrewingRepository.setBrewingComment(brewingId, comment);
      } catch (e) {
        console.error(e);
      }
    },
  },
};
</script>
