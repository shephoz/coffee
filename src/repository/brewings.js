import supabase from "@/repository/supabase";

export const ratingMap = {
  1: "☆",
  2: "☆☆",
  3: "☆☆☆",
};

export const temperatureMap = {
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
      temperature: brewing.temperature,
      amount: brewing.amount,
      comment: brewing.comment,
      rating: brewing.rating,
    }))
    .sort((b1, b2) => (b1.brewedAt < b2.brewedAt ? 1 : -1));
}

export async function setBrewingRating(id, rating) {
  const { data, error } = await supabase
    .from("brewings")
    .update({ rating })
    .match({ id });
  if (error) {
    throw error;
  }
  return data;
}

export async function setBrewingComment(id, comment) {
  const { data, error } = await supabase
    .from("brewings")
    .update({ comment })
    .match({ id });
  if (error) {
    throw error;
  }
  return data;
}

export async function createBrewing(newBrewing) {
  const { data, error } = await supabase.from("brewings").insert(newBrewing);
  if (error) {
    throw error;
  }
  return data;
}
