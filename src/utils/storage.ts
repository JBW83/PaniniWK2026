import { supabase } from "../lib/supabase";
import { getUser } from "../lib/auth";

const TABLE = "user_stickers";

type StickerRow = {
  user_id: string;
  sticker_id: string;
  count: number;
};

// ✅ LOAD (SAFE VERSION)
export async function loadOwnedIds(): Promise<string[]> {
  try {
    // ⛔ BELANGRIJK: eerst proberen user te halen, maar veilig afvangen
    const user = await getUser();

    if (!user || !user.id) {
      return [];
    }

    const { data, error } = await supabase
      .from(TABLE)
      .select("sticker_id,count")
      .eq("user_id", user.id);

    if (error) {
      console.error("Load error:", error);
      return [];
    }

    const ids: string[] = [];

    (data ?? []).forEach((row: any) => {
      const stickerId = String(row?.sticker_id ?? "");
      const count = Number(row?.count ?? 0);

      for (let i = 0; i < count; i++) {
        if (stickerId) ids.push(stickerId);
      }
    });

    return ids;
  } catch (e) {
    console.error("loadOwnedIds crash prevented:", e);
    return [];
  }
}

// ✅ SAVE (SAFE VERSION)
export async function saveOwnedIds(ids: string[]): Promise<void> {
  try {
    const user = await getUser();

    if (!user || !user.id) {
      return;
    }

    const counts: Record<string, number> = {};

    ids.forEach((id) => {
      counts[id] = (counts[id] || 0) + 1;
    });

    const { error: deleteError } = await supabase
      .from(TABLE)
      .delete()
      .eq("user_id", user.id);

    if (deleteError) {
      console.error("Delete error:", deleteError);
      return;
    }

    const rows: StickerRow[] = Object.entries(counts).map(
      ([sticker_id, count]) => ({
        user_id: user.id,
        sticker_id,
        count,
      })
    );

    if (rows.length === 0) return;

    const { error: insertError } = await supabase
      .from(TABLE)
      .insert(rows);

    if (insertError) {
      console.error("Insert error:", insertError);
    }
  } catch (e) {
    console.error("saveOwnedIds crash prevented:", e);
  }
}