// === BEGIN FILE: app/trades.tsx ===
import React, { useEffect, useMemo, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  SectionList,
  Pressable,
  Alert,
} from "react-native";
import * as Clipboard from "expo-clipboard";

import { stickers as INITIAL_DATA } from "../src/data/stickers";
import { loadOwnedIds } from "../src/utils/storage";
import FlagRect from "../src/components/FlagRect";
import PaniniIconRect from "../src/components/PaniniIconRect";

type Sticker = {
  id: string;
  name: string;
  team: string;
  count: number;
  owned?: boolean;
};

type SectionType = {
  title: string;
  data: Sticker[];
};

export default function Trades() {
  const [data, setData] = useState<Sticker[]>(INITIAL_DATA as Sticker[]);

  // ✅ WK GROEPEN (zelfde indeling als Ontbrekend) [1](https://onedrive.live.com/?id=5fd2ccd1-21ea-493c-9fbb-7f211ca1fb93&cid=20ecc9f75eade624&web=1)
  const groups: Record<string, string[]> = {
    A: ["Mexico", "South Africa", "South Korea", "Czechia"],
    B: ["Canada", "Bosnia", "Qatar", "Switzerland"],
    C: ["Brazil", "Morocco", "Haiti", "Scotland"],
    D: ["USA", "Paraguay", "Australia", "Turkey"],
    E: ["Germany", "Curacao", "Ivory Coast", "Ecuador"],
    F: ["Netherlands", "Japan", "Tunisia", "Sweden"],
    G: ["Belgium", "Egypt", "Iran", "New Zealand"],
    H: ["Spain", "Cape Verde", "Saudi Arabia", "Uruguay"],
    I: ["France", "Senegal", "Iraq", "Norway"],
    J: ["Argentina", "Algeria", "Austria", "Jordan"],
    K: ["Portugal", "Congo DR", "Uzbekistan", "Colombia"],
    L: ["England", "Croatia", "Ghana", "Panama"],
  };

  const groupOrder = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"];

  const getGroup = (team: string) => {
    for (const g of groupOrder) {
      if (groups[g].includes(team)) return g;
    }
    return "";
  };

  // ✅ LOAD counts (ownedIds may include duplicates) [2](https://onedrive.live.com/?id=5eade624-c9f7-20ec-8020-cb4a00000000&cid=20ecc9f75eade624&web=1)
  useEffect(() => {
    (async () => {
      const ownedIds = await loadOwnedIds();

      const counts: Record<string, number> = {};
      ownedIds.forEach((id) => {
        counts[id] = (counts[id] || 0) + 1;
      });

      setData(
        (INITIAL_DATA as Sticker[]).map((s) => {
          const count = counts[s.id] || 0;
          return { ...s, count, owned: count > 0 };
        })
      );
    })();
  }, []);

  // ✅ Only doubles (count > 1) [2](https://onedrive.live.com/?id=5eade624-c9f7-20ec-8020-cb4a00000000&cid=20ecc9f75eade624&web=1)
  const duplicates = useMemo(() => {
    return data.filter((s) => (s.count || 0) > 1);
  }, [data]);

  const totalDoubles = duplicates.length;

  // ✅ Sections: Specials + Groep A..L (zelfde headeropmaak als Ontbrekend) [1](https://onedrive.live.com/?id=5fd2ccd1-21ea-493c-9fbb-7f211ca1fb93&cid=20ecc9f75eade624&web=1)
  const sections: SectionType[] = useMemo(() => {
    const result: SectionType[] = [];

    const specials = duplicates
      .filter((s) => s.team === "Specials")
      .sort((a, b) => a.id.localeCompare(b.id));

    if (specials.length > 0) {
      result.push({ title: "Specials", data: specials });
    }

    groupOrder.forEach((g) => {
      const items = duplicates
        .filter((s) => s.team !== "Specials" && getGroup(s.team) === g)
        .sort((a, b) => {
          const teamCmp = a.team.localeCompare(b.team);
          if (teamCmp !== 0) return teamCmp;
          return a.id.localeCompare(b.id);
        });

      if (items.length > 0) {
        result.push({ title: `Groep ${g}`, data: items });
      }
    });

    return result;
  }, [duplicates]);

  // ✅ Copy ONLY doubles
  const doublesOnlyText = useMemo(() => {
    const lines = duplicates
      .slice()
      .sort((a, b) => {
        // Specials eerst, dan groep A..L, dan land, dan id (stabiel voor klembord)
        const aSpecial = a.team === "Specials";
        const bSpecial = b.team === "Specials";
        if (aSpecial && !bSpecial) return -1;
        if (!aSpecial && bSpecial) return 1;

        const ga = aSpecial ? "" : getGroup(a.team);
        const gb = bSpecial ? "" : getGroup(b.team);
        if (ga !== gb) return ga.localeCompare(gb);

        const teamCmp = a.team.localeCompare(b.team);
        if (teamCmp !== 0) return teamCmp;

        return a.id.localeCompare(b.id);
      })
      .map((s) => {
        const doubles = (s.count || 0) - 1;
        return `- ${s.id} ${s.name} (${s.team}) (+${doubles} dubbel)`;
      });

    return `🔁 Dubbelen:\n${lines.join("\n")}`;
  }, [duplicates]);

  const handleCopy = async () => {
    try {
      await Clipboard.setStringAsync(doublesOnlyText);
      Alert.alert("Gekopieerd", "Dubbelenlijst staat in je klembord ✅");
    } catch {
      Alert.alert("Kopiëren mislukt", "Clipboard is niet beschikbaar.");
    }
  };

  const renderItem = ({ item }: { item: Sticker }) => {
    const isSpecial =
      item.team === "Specials" || item.id === "00" || item.id.startsWith("FWC");

    return (
      <View style={styles.row}>
        <View style={styles.icon}>
          {isSpecial ? <PaniniIconRect /> : <FlagRect team={item.team} />}
        </View>

        <View style={styles.middle}>
          <Text style={styles.name} numberOfLines={1}>
            {item.id} - {item.name}
          </Text>
          <Text style={styles.meta} numberOfLines={1}>
            {isSpecial ? "Specials" : item.team}
          </Text>
        </View>

        {/* ✅ Alleen dubbelen-indicator (geen +/- controls meer) */}
        <Text style={styles.duplicateText}>+{item.count - 1}</Text>
      </View>
    );
  };

  const renderHeader = ({ section }: { section: SectionType }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{section.title}</Text>
      <Text style={styles.sectionCount}>{section.data.length}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dubbelen 🔁</Text>
      <Text style={styles.subtitle}>
        {totalDoubles === 0
          ? "Nog geen dubbelen gevonden."
          : `${totalDoubles} stickers met dubbelen`}
      </Text>

      <Pressable onPress={handleCopy} style={styles.copyBtn}>
        <Text style={styles.copyText}>Kopieer dubbelen</Text>
      </Pressable>

      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        renderSectionHeader={renderHeader}
        stickySectionHeadersEnabled={false}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        contentContainerStyle={
          totalDoubles === 0 ? styles.emptyContainer : undefined
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>Nog geen dubbelen gevonden.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5", padding: 16 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 4 },
  subtitle: { fontSize: 12, color: "#666", marginBottom: 10 },

  copyBtn: {
    backgroundColor: "#2563EB",
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  copyText: { color: "#fff", textAlign: "center", fontWeight: "bold" },

  // ✅ header in lijn met Ontbrekend: titel links, count rechts [1](https://onedrive.live.com/?id=5fd2ccd1-21ea-493c-9fbb-7f211ca1fb93&cid=20ecc9f75eade624&web=1)
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    paddingHorizontal: 2,
  },
  sectionTitle: { fontWeight: "bold" },
  sectionCount: { fontSize: 12, color: "#666" },

  row: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  icon: { marginRight: 10 },
  middle: { flex: 1 },
  name: { fontWeight: "bold", color: "#111827" },
  meta: { fontSize: 11, color: "#666", marginTop: 2 },

  duplicateText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#F59E0B",
    marginLeft: 10,
  },

  emptyContainer: { flexGrow: 1, justifyContent: "center" },
  empty: { alignItems: "center", paddingVertical: 24 },
  emptyText: { color: "#6B7280" },
});
// === END FILE ===