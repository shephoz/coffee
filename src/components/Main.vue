<template>
  <div>
    <h1>Coffee Journal</h1>
    <Beans :beans="beans" :shops="shops" @refresh="fetchData()" />
    <Bottles :bottles="bottles" :brewings="brewings" />
    <Brewings
      :brewings="brewings"
      :availableBeans="beans.filter((bean) => !bean.usedUpAt)"
      @refresh="fetchData()"
    />
  </div>
</template>

<script>
import Bottles from "@/components/Bottles.vue";
import Brewings from "@/components/Brewings.vue";
import Beans from "@/components/Beans.vue";

import BeansRepository from "@/repository/beans.js";
import BrewingRepository from "@/repository/brewings.js";
import BottlesRepository from "@/repository/bottles.js";
import ShopsRepository from "@/repository/shops.js";

export default {
  name: "Main",
  components: {
    Bottles,
    Brewings,
    Beans,
  },
  data: () => ({
    beans: [],
    brewings: [],
    bottles: new Map([
      ["blue", [null, null]],
      ["black", [null, null]],
      ["white", [null, null]],
    ]),
    shops: [],
  }),
  async created() {
    await this.fetchData();
  },
  methods: {
    async fetchData() {
      try {
        this.beans = await BeansRepository.getBeans();
        this.bottles = await BottlesRepository.getBottles();
        this.brewings = await BrewingRepository.getBrewings();
        this.shops = await ShopsRepository.getShops();
      } catch (error) {
        alert("Request Error: " + JSON.stringify(error));
      }
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
table {
  margin: 40px auto;
}
th {
  padding: 20px 60px;
}
</style>
