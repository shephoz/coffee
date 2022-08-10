<template>
  <div>
    <h1>Coffee Journal</h1>
    <Bottles />
    <Brewings />
    <Beans />
  </div>
</template>

<script>
import Bottles from "@/components/Bottles.vue";
import Brewings from "@/components/Brewings.vue";
import Beans from "@/components/Beans.vue";

export default {
  name: "Main",
  components: {
    Bottles,
    Brewings,
    Beans,
  },
  async created() {},
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
