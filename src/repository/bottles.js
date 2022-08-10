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

  static async addBottle(color, brewingId) {
    const {
      data: [{ brewing: curBrewing, nextup: curNextUp }],
      error: error1,
    } = await supabase
      .from("bottles")
      .select("brewing, nextup")
      .match({ color });
    if (error1) {
      throw error1;
    }

    const { data, error: error2 } = await supabase
      .from("bottles")
      .update({
        brewing: curNextUp || curBrewing || brewingId,
        nextup: curBrewing ? brewingId : null,
      })
      .match({ color });
    if (error2) {
      throw error2;
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
