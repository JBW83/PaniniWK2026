import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  useWindowDimensions,
  Platform,
  PanResponder,
} from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";

import SearchBar from "../src/components/SearchBar";
import StickerList from "../src/components/StickerList";
import { stickers as INITIAL_DATA } from "../src/data/stickers";
import { loadOwnedIds, saveOwnedIds } from "../src/utils/storage";
import FlagRect from "../src/components/FlagRect";

export default function Explore() {
  const { width, height } = useWindowDimensions();

  const isWeb = Platform.OS === "web";
  const isPortrait = height >= width;
  const isMobilePortrait = !isWeb && isPortrait;
  const isMobileLandscape = !isWeb && !isPortrait;

  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);

  const [activeTab, setActiveTab] = useState("ALL");
  const [activeTeam, setActiveTeam] = useState<string | null>(null);

  const [data, setData] = useState(INITIAL_DATA);
  const [hydrated, setHydrated] = useState(false);

  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ===== GROEPEN (A–L) =====
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

  const tabs = ["ALL", "FWC", ...Object.keys(groups)];
  const currentTeams = groups[activeTab] ?? [];

  // ===== LOAD uit Supabase via storage.ts =====
  useEffect(() => {
    (async () => {
      const ownedIds = await loadOwnedIds();

      const counts: Record<string, number> = {};
      ownedIds.forEach((id) => {
        counts[id] = (counts[id] || 0) + 1;
      });

      setData(
        INITIAL_DATA.map((s) => {
          const count = counts[s.id] || 0;
          return { ...s, count, owned: count > 0 };
        })
      );

      setHydrated(true);
    })();
  }, []);

  // ===== SAVE naar Supabase (debounced) =====
  useEffect(() => {
  if (!hydrated) return;

    const ownedIds: string[] = [];
    data.forEach((s) => {
      for (let i = 0; i < (s.count || 0); i++) ownedIds.push(s.id);
    });

    if (saveTimer.current) clearTimeout(saveTimer.current);

    saveTimer.current = setTimeout(() => {
      saveOwnedIds(ownedIds);
    }, 250);
  }, [data, hydrated]);

  // ===== UPDATE count =====
  const changeCount = (id: string, delta: number) => {
    setData((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s;
        const newCount = Math.max(0, (s.count || 0) + delta);
        return { ...s, count: newCount, owned: newCount > 0 };
      })
    );
  };

  // ===== STATS =====
  const getStats = (items: typeof data) => {
    const total = items.length;
    const owned = items.filter((s) => (s.count || 0) > 0).length;
    const percentage = total === 0 ? 0 : owned / total;
    return { total, owned, percentage };
  };

  // ===== FILTER =====
  const filtered = useMemo(() => {
    let base = data;

    if (activeTab === "FWC") {
      base = data.filter((s) => s.team === "Specials");
    } else if (groups[activeTab]) {
      base = data.filter((s) => groups[activeTab].includes(s.team));
    }

    if (activeTeam) {
      base = base.filter((s) => s.team === activeTeam);
    }

    const term = query.trim().toLowerCase();
    if (!term) return base;

    return base.filter((s) =>
      `${s.id} ${s.name} ${s.team}`.toLowerCase().includes(term)
    );
  }, [data, query, activeTab, activeTeam]);

  // ===== SEARCH regels =====
  // Web: altijd zichtbaar
  // Mobile portrait: toggle
  // Mobile landscape: uit
  const showSearch = isWeb || (isMobilePortrait && searchOpen);

  // reset search als je naar landscape gaat
  useEffect(() => {
    if (isMobileLandscape) {
      setSearchOpen(false);
      setQuery("");
    }
  }, [isMobileLandscape]);

  // swipe down/up op mobile portrait om search open/dicht te zetten
  const panResponder = useMemo(() => {
    if (!isMobilePortrait) return undefined;
    return PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) =>
        Math.abs(g.dy) > 18 && Math.abs(g.dx) < 14,
      onPanResponderRelease: (_, g) => {
        if (g.dy > 25) setSearchOpen(true);
        if (g.dy < -25) setSearchOpen(false);
      },
    });
  }, [isMobilePortrait]);

  const tabBarHeight = isWeb ? 65 : isMobilePortrait ? 52 : 56;
  const teamBarHeight = isWeb ? 85 : isMobilePortrait ? 62 : 72;

  const columns = isMobilePortrait ? 1 : 2;

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header} {...(panResponder?.panHandlers ?? {})}>
        {!isMobilePortrait && (
          <Text style={styles.title}>Verzameling ⚽</Text>
        )}

        {isMobilePortrait && (
          <Pressable
            onPress={() => {
              const next = !searchOpen;
              setSearchOpen(next);
              if (!next) setQuery("");
            }}
            style={styles.searchToggle}
            accessibilityRole="button"
            accessibilityLabel={searchOpen ? "Sluit zoeken" : "Open zoeken"}
          >
            <FontAwesome
              name={searchOpen ? "times" : "search"}
              size={18}
              color="#111827"
            />
          </Pressable>
        )}
      </View>

      {/* SEARCH */}
      {showSearch && (
        <View style={styles.searchWrap}>
          <SearchBar value={query} onChange={setQuery} />
        </View>
      )}

      {/* GROUP TABS */}
      <View style={[styles.tabBar, { height: tabBarHeight }]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.row}>
            {tabs.map((tab) => {
              let tabData = data;

              if (tab === "FWC") {
                tabData = data.filter((s) => s.team === "Specials");
              } else if (groups[tab]) {
                tabData = data.filter((s) => groups[tab].includes(s.team));
              }

              const stats = getStats(tabData);

              return (
                <Pressable
                  key={tab}
                  onPress={() => {
                    setActiveTab(tab);
                    setActiveTeam(null);
                  }}
                  style={[styles.tab, activeTab === tab && styles.tabActive]}
                >
                  <Text style={styles.tabText} numberOfLines={1}>
                    {tab === "ALL"
                      ? "Alles"
                      : tab === "FWC"
                      ? "FWC"
                      : `Groep ${tab}`}
                  </Text>

                  {/* cijfers op web + landscape, niet op mobile portrait */}
                  {(isWeb || isMobileLandscape) && (
                    <Text style={styles.progressText}>
                      {stats.owned} / {stats.total}
                    </Text>
                  )}

                  {/* balk altijd zichtbaar */}
                  <View style={styles.progressBar}>
                    <View
                      style={[
                        styles.progressFill,
                        { width: `${stats.percentage * 100}%` },
                      ]}
                    />
                  </View>
                </Pressable>
              );
            })}
          </View>
        </ScrollView>
      </View>

      {/* TEAM TABS */}
      {groups[activeTab] && (
        <View style={[styles.teamBar, { height: teamBarHeight }]}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.row}>
              {currentTeams.map((team) => {
                const teamData = data.filter((s) => s.team === team);
                const stats = getStats(teamData);

                return (
                  <Pressable
                    key={team}
                    onPress={() =>
                      setActiveTeam(activeTeam === team ? null : team)
                    }
                    style={[styles.teamTab, activeTeam === team && styles.teamTabActive]}
                  >
                    <FlagRect team={team} />
                    <Text style={styles.teamText} numberOfLines={2}>
                      {team}
                    </Text>

                    {(isWeb || isMobileLandscape) && (
                      <Text style={styles.progressTextSmall}>
                        {stats.owned} / {stats.total}
                      </Text>
                    )}

                    <View style={styles.progressBarSmall}>
                      <View
                        style={[
                          styles.progressFill,
                          { width: `${stats.percentage * 100}%` },
                        ]}
                      />
                    </View>
                  </Pressable>
                );
              })}
            </View>
          </ScrollView>
        </View>
      )}

      {/* LIST */}
      <StickerList
        data={filtered}
        onChangeCount={changeCount}
        columns={columns}
        highlightTerm={query.trim()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#F5F5F5" },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },

  title: { fontSize: 22, fontWeight: "bold" },

  searchToggle: {
    padding: 8,
    borderRadius: 10,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  searchWrap: { marginBottom: 10 },

  row: { flexDirection: "row" },

  tabBar: { height: 65 },
  teamBar: { height: 85 },

  tab: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: "#ddd",
    borderRadius: 8,
    marginRight: 6,
    width: 100,
    alignItems: "center",
  },

  tabActive: { backgroundColor: "#2563EB" },

  tabText: { fontSize: 12, fontWeight: "bold", color: "#111827" },

  progressText: { fontSize: 10, marginTop: 2, marginBottom: 2, color: "#111827" },

  progressBar: {
    height: 4,
    backgroundColor: "#ccc",
    borderRadius: 2,
    overflow: "hidden",
    width: "100%",
  },

  progressFill: { height: "100%", backgroundColor: "#22C55E" },

  teamTab: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingHorizontal: 6,
    backgroundColor: "#eee",
    borderRadius: 8,
    marginRight: 6,
    width: 110,
    alignItems: "center",
    justifyContent: "flex-start",
  },

  teamTabActive: { backgroundColor: "#10B981" },

  teamText: {
    textAlign: "center",
    fontSize: 13,
    fontWeight: "600",
    minHeight: 34,
  },

  progressTextSmall: { fontSize: 10, marginTop: 2, marginBottom: 2, color: "#111827" },

  progressBarSmall: {
    height: 4,
    backgroundColor: "#ccc",
    borderRadius: 2,
    overflow: "hidden",
    width: "100%",
  },
});