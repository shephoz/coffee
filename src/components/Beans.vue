<template>
  <div>
    <table
      style="
        background-color: lightgray;
        width: 400px;
        margin: 30px auto;
        padding: 30px;
      "
    >
      <tr>
        <td>購入日</td>
        <td><input type="date" v-model="newBeanForm.boughtAt" /></td>
      </tr>
      <tr>
        <td>豆名</td>
        <td><input v-model="newBeanForm.name" /></td>
      </tr>

      <tr>
        <td>購入店</td>
        <td>
          <select v-model="newBeanForm.shop">
            <br />
            <option v-for="shop in shops" :key="shop.id" :value="shop.id">
              {{ shop.name }}
            </option>
          </select>
        </td>
      </tr>
      <tr>
        <td>量</td>
        <td><input type="number" v-model="newBeanForm.amount" /></td>
      </tr>
      <tr>
        <td>単価</td>
        <td><input type="number" v-model="newBeanForm.price" /></td>
      </tr>

      <tr>
        <td colspan="2">
          <label v-for="(label, val) in roastMap" :key="val">
            <input
              type="radio"
              :value="Number(val)"
              v-model="newBeanForm.roast"
            />{{ label }}</label
          >
        </td>
      </tr>
      <tr>
        <td colspan="2">
          <button @click="addBean()">作成</button>
        </td>
      </tr>
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
          <td>{{ roastView(bean.roast) }}</td>
          <td v-if="bean.usedUpAt">{{ bean.usedUpAt }}</td>
          <td v-else>
            <button
              v-if="!(usedUpForm.id && usedUpForm.id === bean.id)"
              @click="usedUpForm.id = bean.id"
            >
              使い切った
            </button>
            <div v-if="usedUpForm.id === bean.id">
              <input type="date" v-model="usedUpForm.date" />
              <button @click="beansRepositoryUsedUp(bean.id, usedUpForm.date)">
                OK
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import BeansRepository from "@/repository/beans.js";

function today() {
  return `${new Date().getFullYear()}-${(new Date().getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${new Date().getDate().toString().padStart(2, "0")}`;
}

export default {
  name: "Beans",
  data: () => ({
    newBeanForm: {
      boughtAt: today(),
      name: "",
      shop: "",
      amount: 0,
      price: 0,
      roast: 2,
    },
    usedUpForm: {
      id: null,
      date: today(),
    },
    roastMap: {},
  }),
  props: {
    beans: Array,
    shops: Array,
  },
  async created() {
    this.roastMap = BeansRepository.roastMap;
  },
  computed: {},
  methods: {
    roastView(roast) {
      return BeansRepository.roastMap[roast];
    },
    async beansRepositoryUsedUp(id, date) {
      await BeansRepository.usedUp(id, date);
      this.usedUpForm.id = null;
      this.$emit("refresh");
    },
    async addBean() {
      const { boughtAt, name, shop, amount, price, roast } = this.newBeanForm;
      try {
        await BeansRepository.createBean({
          bought_at: boughtAt,
          name,
          shop,
          amount,
          price,
          roast,
        });
      } catch (error) {
        alert("Request Error: " + JSON.stringify(error));
      }
      this.newBeanForm = {
        boughtAt: this.newBeanForm.boughtAt,
        name: "",
        shop: "",
        amount: 0,
        price: 0,
        roast: 2,
      };
      this.$emit("refresh");
    },
  },
};
</script>
