import supabase from "@/repository/supabase";

const ratingMap = {
  1: "☆",
  2: "☆☆",
  3: "☆☆☆",
};

const temperatureMap = {
  1: "常温",
  2: "半氷",
  3: "氷出し",
};

export async function getBrewings() {
  const { data, error } = await supabase
    .from("brewings")
    .select(
      `id, brewed_at, bean:bean(name), grind, temperature, amount, comment, rating`
    );
  if (error) {
    throw error;
  }
  return data
    .map((brewing) => ({
      id: brewing.id,
      brewedAt: brewing.brewed_at,
      bean: brewing.bean.name,
      grind: brewing.grind,
      temperature: temperatureMap[brewing.temperature],
      amount: brewing.amount,
      comment: brewing.comment,
      rating: ratingMap[brewing.rating],
    }))
    .sort((b1, b2) => (b1.brewedAt < b2.brewedAt ? 1 : -1));
}
