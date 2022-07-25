import supabase from "@/repository/supabase";

const roastMap = {
  1: "浅煎り",
  2: "中煎り",
  3: "深煎り",
  4: "極深煎り",
};

export async function getBeans() {
  const { data, error } = await supabase
    .from("beans")
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
      roast: roastMap[bean.roast],
      usedUpAt: bean.used_up_at,
    }))
    .sort((b1, b2) => (b1.boughtAt < b2.boughtAt ? 1 : -1));
}
