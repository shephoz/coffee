import supabase from "@/repository/supabase";

export default class BottlesRepository {
  static async getBottles() {
    const { data, error } = await supabase
      .from("bottles")
      .select(
        "color, brewing(id, brewed_at, bean(name)), nextup(id, brewed_at, bean(name))"
      );
    if (error) {
      throw error;
    }
    return new Map(
      data.map((bottle) => [
        bottle.color,
        [
          this.convertBrewing(bottle.brewing),
          this.convertBrewing(bottle.nextup),
        ],
      ])
    );
  }

  static async setBottle(color, brewingId, nextBrewingId) {
    const { data, error } = await supabase
      .from("bottles")
      .update({ brewing: brewingId, nextup: nextBrewingId })
      .eq("color", color);
    if (error) {
      throw error;
    }
    return data;
  }

  static convertBrewing(brewing) {
    return brewing
      ? {
          id: brewing.id,
          brewedAt: brewing.brewed_at,
          bean: brewing.bean.name,
        }
      : null;
  }
}
