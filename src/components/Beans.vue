<template>
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
        <td>{{ roastView(bean.roast) }}</td>
        <td>{{ bean.usedUpAt }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import BeansRepository from "@/repository/beans.js";

export default {
  name: "Beans",
  data: () => ({}),
  props: {
    beans: Array,
  },
  async created() {},
  methods: {
    roastView(roast) {
      return BeansRepository.roastMap[roast];
    },
  },
};
</script>
