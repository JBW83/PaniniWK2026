// === BEGIN FILE: app/missing.tsx ===

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

export default function Missing() {
  const [data, setData] = useState<Sticker[]>(INITIAL_DATA as Sticker[]);

  // ✅ WK GROEPEN (zelfde als Verzameling)
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

  // ✅ LOAD counts
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

  // ✅ Missing list
  const missing = useMemo(() => {
    return data.filter((s) => (s.count || 0) === 0);
  }, [data]);

  const totalMissing = missing.length;

  // ✅ Sections: Specials + Groep A..L
  const sections: SectionType[] = useMemo(() => {
    const result: SectionType[] = [];

    const specials = missing
      .filter((s) => s.team === "Specials")
      .sort((a, b) => a.id.localeCompare(b.id));

    result.push({ title: "Specials", data: specials });

    groupOrder.forEach((g) => {
      const items = missing
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

    // Specials alleen tonen als er items zijn, of altijd? -> hier: altijd tonen
    return result;
  }, [missing]);

  // ✅ Copy ONLY missing list (expo-clipboard)
  const handleCopyMissingOnly = async () => {
    const text =
      `🎯 Ontbrekend:\n` +
      missing.map((s) => `- ${s.id} ${s.name} (${s.team})`).join("\n");

    try {
      await Clipboard.setStringAsync(text);
      Alert.alert("Gekopieerd", "Ontbrekend-lijst staat in je klembord ✅");
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

        <Text style={styles.missingText}>Ontbreekt</Text>
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
      <Text style={styles.title}>Ontbrekend 📌</Text>
      <Text style={styles.subtitle}>{totalMissing} stickers nog te verzamelen</Text>

      <Pressable onPress={handleCopyMissingOnly} style={styles.copyBtn}>
        <Text style={styles.copyText}>Kopieer Ontbrekend</Text>
      </Pressable>

      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        renderSectionHeader={renderHeader}
        stickySectionHeadersEnabled={false}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        contentContainerStyle={missing.length === 0 ? styles.emptyContainer : undefined}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>Geen ontbrekende stickers 🎉</Text>
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
    backgroundColor: "#10B981",
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  copyText: { color: "#fff", textAlign: "center", fontWeight: "bold" },

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

  missingText: { fontSize: 11, color: "#EF4444", fontWeight: "bold" },

  emptyContainer: { flexGrow: 1, justifyContent: "center" },
  empty: { alignItems: "center", paddingVertical: 24 },
  emptyText: { color: "#6B7280" },
});

// === END FILE: app/missing.tsx ===
