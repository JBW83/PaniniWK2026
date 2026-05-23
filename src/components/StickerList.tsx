import React, { useMemo } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";

import FlagRect from "./FlagRect";
import PaniniIconRect from "./PaniniIconRect";

export type StickerItem = {
  id: string;
  name: string;
  team?: string;
  count: number;
  owned?: boolean;
};

type Props = {
  data: StickerItem[];
  onChangeCount: (id: string, delta: number) => void;
  columns?: number;
};

// ===== HELPERS =====

function extractNumber(id: string): number {
  if (id === "00") return 0;
  const matches = id.match(/\d+/g);
  if (!matches) return 999;
  return Number(matches[matches.length - 1]);
}

function isFWCItem(item: StickerItem) {
  return (
    item.team === "Specials" ||
    item.id === "00" ||
    item.id.toUpperCase().startsWith("FWC")
  );
}

function stripLeadingCode(name: string, id: string) {
  const prefix = `${id} - `;
  return name.startsWith(prefix) ? name.slice(prefix.length) : name;
}

function interleave<T>(left: T[], right: T[]) {
  const out: T[] = [];
  const max = Math.max(left.length, right.length);
  for (let i = 0; i < max; i++) {
    if (left[i]) out.push(left[i]);
    if (right[i]) out.push(right[i]);
  }
  return out;
}

// ===== ROW =====

function Row({
  item,
  onChangeCount,
}: {
  item: StickerItem;
  onChangeCount: (id: string, delta: number) => void;
}) {
  const cleanName = stripLeadingCode(item.name, item.id);
  const isSpecial = isFWCItem(item);
  const duplicates = item.count > 1;
  const inCollection = item.count > 0;

  return (
    <View style={styles.row}>
      {/* ICON */}
      <View style={styles.icon}>
        {isSpecial ? <PaniniIconRect /> : <FlagRect team={item.team ?? ""} />}
      </View>

      {/* TEXT */}
      <View style={styles.middle}>
        <View style={styles.nameRow}>
          <Text style={styles.name} numberOfLines={1}>
            {cleanName}
          </Text>

          <Text style={styles.code}>{item.id}</Text>
        </View>

        {duplicates && (
          <Text style={styles.dup}>+{item.count - 1} dubbel</Text>
        )}
      </View>

      {/* STATUS */}
      <View style={styles.status}>
        {inCollection ? (
          <View style={[styles.statusBadge, styles.statusOwned]}>
            <FontAwesome name="check" size={11} color="#fff" />
          </View>
        ) : (
          <View style={[styles.statusBadge, styles.statusMissing]}>
            <FontAwesome name="times" size={11} color="#fff" />
          </View>
        )}
      </View>

      {/* CONTROLS */}
      <View style={styles.controls}>
        <Pressable
          onPress={() => onChangeCount(item.id, -1)}
          style={styles.btn}
        >
          <Text style={styles.btnText}>-</Text>
        </Pressable>

        <Text style={styles.count}>{item.count}</Text>

        <Pressable
          onPress={() => onChangeCount(item.id, +1)}
          style={styles.btn}
        >
          <Text style={styles.btnText}>+</Text>
        </Pressable>
      </View>
    </View>
  );
}

// ===== MAIN =====

export default function StickerList({
  data,
  onChangeCount,
  columns = 2,
}: Props) {
  const finalData = useMemo(() => {
    if (!data || data.length === 0) return [];

    const isPureFWC = data.every((s) => isFWCItem(s));
    const teams = Array.from(new Set(data.map((s) => s.team ?? "")));
    const isSingleTeam = teams.length === 1;
    const onlyTeam = teams[0];

    // ===== 1 KOLOM =====
    if (columns === 1) {
      return [...data].sort((a, b) => extractNumber(a.id) - extractNumber(b.id));
    }

    // ===== 2 KOLOMMEN =====

    // FWC verdeling
    if (isPureFWC) {
      const sorted = [...data].sort((a, b) => extractNumber(a.id) - extractNumber(b.id));

      const left = sorted.filter((s) => extractNumber(s.id) <= 9);
      const right = sorted.filter((s) => extractNumber(s.id) >= 10);

      return interleave(left, right);
    }

    // 1 land actief
    if (isSingleTeam && onlyTeam !== "Specials") {
      const sorted = [...data].sort((a, b) => extractNumber(a.id) - extractNumber(b.id));

      const left = sorted.filter((s) => {
        const n = extractNumber(s.id);
        return n >= 1 && n <= 10;
      });

      const right = sorted.filter((s) => {
        const n = extractNumber(s.id);
        return n >= 11 && n <= 20;
      });

      return interleave(left, right);
    }

    // alles/groepen
    return [...data].sort((a, b) => {
      const aFWC = isFWCItem(a);
      const bFWC = isFWCItem(b);

      if (aFWC && !bFWC) return 1;
      if (!aFWC && bFWC) return -1;

      const teamCompare = (a.team ?? "").localeCompare(b.team ?? "");
      if (teamCompare !== 0) return teamCompare;

      return extractNumber(a.id) - extractNumber(b.id);
    });
  }, [data, columns]);

  return (
    <FlatList
      key={`stickers-${columns}`}
      data={finalData}
      keyExtractor={(item) => item.id}
      numColumns={columns}
      columnWrapperStyle={columns === 2 ? styles.columnWrapper : undefined}
      renderItem={({ item }) => (
        <View style={columns === 2 ? styles.cell : undefined}>
          <Row item={item} onChangeCount={onChangeCount} />
        </View>
      )}
    />
  );
}

// ===== STYLES =====

const styles = StyleSheet.create({
  columnWrapper: {
    paddingHorizontal: 8,
  },

  cell: {
    flex: 1,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    backgroundColor: "#fff",
    marginBottom: 4,
    borderRadius: 8,
  },

  icon: {
    marginRight: 8,
  },

  middle: {
    flex: 1,
    paddingRight: 6,
  },

  nameRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  name: {
    flex: 1,
    fontWeight: "bold",
    fontSize: 13,
    marginRight: 6,
  },

  code: {
    width: 44,
    textAlign: "right",
    fontSize: 12,
    fontWeight: "600",
    color: "#555",
    marginRight: 8,
  },

  dup: {
    fontSize: 10,
    color: "#F59E0B",
  },

  status: {
    marginRight: 8,
  },

  statusBadge: {
    width: 16,
    height: 16,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
  },

  statusOwned: {
    backgroundColor: "#16A34A",
  },

  statusMissing: {
    backgroundColor: "#DC2626",
  },

  controls: {
    flexDirection: "row",
    alignItems: "center",
  },

  btn: {
    width: 24,
    padding: 4,
    backgroundColor: "#ddd",
    borderRadius: 4,
    alignItems: "center",
  },

  btnText: {
    fontSize: 12,
  },

  count: {
    marginHorizontal: 6,
    fontWeight: "bold",
    fontSize: 13,
  },
});