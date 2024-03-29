import supabase from "@/repository/supabase";
export default class BeansRepository {
  static roastMap = {
    1: "浅煎り",
    2: "中煎り",
    3: "深煎り",
    4: "極深煎り",
  };

  static async getBeans() {
    const { data, error } = await supabase
      .from("coffee_beans")
      .select(
        `id, name, bought_at, shop(name), amount, price, roast, used_up_at`
      );
    if (error) {
      throw error;
    }
    return data
      .map((bean) => ({
        id: bean.id,
        name: bean.name,
        boughtAt: bean.bought_at,
        shop: bean.shop.name,
        amount: bean.amount,
        price: bean.price,
        roast: bean.roast,
        usedUpAt: bean.used_up_at,
      }))
      .sort((b1, b2) => (b1.boughtAt < b2.boughtAt ? 1 : -1));
  }

  static async usedUp(id, date) {
    const { data, error } = await supabase
      .from("coffee_beans")
      .update({ used_up_at: date })
      .match({ id });
    if (error) {
      throw error;
    }
    return data;
  }

  static async createBean(bean) {
    const { data, error } = await supabase.from("coffee_beans").insert(bean);
    if (error) {
      throw error;
    }
    return data;
  }
}
