import React, { useEffect, useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { stickers as INITIAL_DATA, Sticker } from "../src/data/stickers";
import { loadOwnedIds } from "../src/utils/storage";

export default function Home() {
  const [data, setData] = useState<Sticker[]>([]);

  useEffect(() => {
    (async () => {
      const ownedIds = await loadOwnedIds();
      const setIds = new Set(ownedIds);

      const updated = INITIAL_DATA.map((s) => ({
        ...s,
        owned: setIds.has(s.id),
      }));

      setData(updated);
    })();
  }, []);

  const stats = useMemo(() => {
    const total = data.length;
    const ownedTotal = data.filter((s) => s.owned).length;

    const teams = data.filter((s) => s.team !== "Specials");
    const specials = data.filter((s) => s.team === "Specials");

    const ownedTeams = teams.filter((s) => s.owned).length;
    const ownedSpecials = specials.filter((s) => s.owned).length;

    const totalProgress =
      total === 0 ? 0 : Math.round((ownedTotal / total) * 100);

    const teamProgress =
      teams.length === 0
        ? 0
        : Math.round((ownedTeams / teams.length) * 100);

    const specialsProgress =
      specials.length === 0
        ? 0
        : Math.round((ownedSpecials / specials.length) * 100);

    return {
      total,
      ownedTotal,
      totalProgress,
      teamsCount: teams.length,
      ownedTeams,
      teamProgress,
      specialsCount: specials.length,
      ownedSpecials,
      specialsProgress,
    };
  }, [data]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>WK 2026 Panini Collection Tracker ⚽</Text>

      {/* ✅ MAIN PROGRESS */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Totaal</Text>

        <Text style={styles.bigNumber}>
          {stats.totalProgress}%
        </Text>

        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${stats.totalProgress}%` },
            ]}
          />
        </View>

        <Text style={styles.count}>
          {stats.ownedTotal} / {stats.total}
        </Text>
      </View>

      {/* ✅ BREAKDOWN */}
      <View style={styles.row}>
        {/* Teams */}
        <View style={styles.smallCard}>
          <Text style={styles.cardTitle}>Teams</Text>

          <Text style={styles.smallNumber}>
            {stats.teamProgress}%
          </Text>

          <View style={styles.progressBarSmall}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${stats.teamProgress}%`,
                  backgroundColor: "#3B82F6",
                },
              ]}
            />
          </View>

          <Text style={styles.smallText}>
            {stats.ownedTeams} / {stats.teamsCount}
          </Text>
        </View>

        {/* Specials */}
        <View style={styles.smallCard}>
          <Text style={styles.cardTitle}>FWC</Text>

          <Text style={styles.smallNumber}>
            {stats.specialsProgress}%
          </Text>

          <View style={styles.progressBarSmall}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${stats.specialsProgress}%`,
                  backgroundColor: "#F59E0B",
                },
              ]}
            />
          </View>

          <Text style={styles.smallText}>
            {stats.ownedSpecials} / {stats.specialsCount}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    padding: 20,
  },

  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    alignItems: "center",
  },

  smallCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 15,
    flex: 1,
    marginRight: 10,
  },

  row: {
    flexDirection: "row",
  },

  cardTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 8,
  },

  bigNumber: {
    fontSize: 52,
    fontWeight: "900",
    color: "#2563EB",
  },

  smallNumber: {
    fontSize: 22,
    fontWeight: "bold",
  },

  progressBar: {
    width: "100%",
    height: 14,
    backgroundColor: "#ddd",
    borderRadius: 7,
    overflow: "hidden",
    marginVertical: 10,
  },

  progressBarSmall: {
    width: "100%",
    height: 6,
    backgroundColor: "#ddd",
    borderRadius: 3,
    overflow: "hidden",
    marginVertical: 6,
  },

  progressFill: {
    height: "100%",
    backgroundColor: "#22C55E",
  },

  count: {
    fontSize: 16,
    color: "#333",
  },

  smallText: {
    fontSize: 11,
    color: "#555",
  },
});