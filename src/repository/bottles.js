import supabase from "@/repository/supabase";

export async function getBottles() {
  const { data, error } = await supabase
    .from("bottles")
    .select(`color, brewing(brewed_at, bean(name))`);
  if (error) {
    throw error;
  }
  return new Map(
    data.map((bottle) => [
      bottle.color,
      bottle.brewing
        ? {
            brewedAt: bottle.brewing.brewed_at,
            bean: bottle.brewing.bean.name,
          }
        : null,
    ])
  );
}
