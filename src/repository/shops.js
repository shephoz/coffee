import supabase from "@/repository/supabase";
export default class ShopsRepository {
  static async getShops() {
    const { data, error } = await supabase
      .from("coffee_shops")
      .select(`id, name`);
    if (error) {
      throw error;
    }
    return data.map((shop) => ({
      id: shop.id,
      name: shop.name,
    }));
  }

  // static async usedUp(id, date) {
  //   const { data, error } = await supabase
  //     .from("coffee_beans")
  //     .update({ used_up_at: date })
  //     .match({ id });
  //   if (error) {
  //     throw error;
  //   }
  //   return data;
  // }
}
