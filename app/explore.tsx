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

  // ===== GROEPEN =====
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

  // ✅ SAFE LOAD (fix voor startup crash)
  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      try {
        const ownedIds = await loadOwnedIds();

        if (!mounted) return;

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
      } catch (e) {
        console.error("Explore load crash prevented:", e);

        if (mounted) {
          setData(INITIAL_DATA);
          setHydrated(true);
        }
      }
    };

    // ✅ delay voorkomt race condition bij app start
    setTimeout(loadData, 100);

    return () => {
      mounted = false;
    };
  }, []);

  // ✅ SAVE (debounced en veilig)
  useEffect(() => {
    if (!hydrated) return;

    const ownedIds: string[] = [];

    data.forEach((s) => {
      for (let i = 0; i < (s.count || 0); i++) {
        ownedIds.push(s.id);
      }
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

  const showSearch = isWeb || (isMobilePortrait && searchOpen);

  useEffect(() => {
    if (isMobileLandscape) {
      setSearchOpen(false);
      setQuery("");
    }
  }, [isMobileLandscape]);

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

  const columns = isMobilePortrait ? 1 : 2;

  return (
    <View style={styles.container}>
      <View style={styles.header} {...(panResponder?.panHandlers ?? {})}>
        <Text style={styles.title}>Verzameling ⚽</Text>

        {isMobilePortrait && (
          <Pressable
            onPress={() => setSearchOpen((prev) => !prev)}
            style={styles.searchToggle}
          >
            <FontAwesome name="search" size={18} />
          </Pressable>
        )}
      </View>

      {showSearch && (
        <View style={styles.searchWrap}>
          <SearchBar value={query} onChange={setQuery} />
        </View>
      )}

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
  },

  title: { fontSize: 22, fontWeight: "bold" },

  searchToggle: {
    padding: 8,
    backgroundColor: "#fff",
    borderRadius: 8,
  },

  searchWrap: { marginVertical: 10 },
});
