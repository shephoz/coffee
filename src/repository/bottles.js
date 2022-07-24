import supabase from "@/repository/supabase";

export async function getBottles() {
  const bottles = await supabase
    .from("bottles")
    .select(`color, brewing(brewed_at, bean:bean(name))`);

  return new Map(
    bottles.data.map((bottle) => [
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
