import React, { memo } from "react";
import { StyleSheet, View } from "react-native";

type Props = {
  team: string;
  size?: "sm" | "md";
};

const W = { sm: 18, md: 22 };
const H = { sm: 12, md: 14 };

function HStripes({
  colors,
  ratios,
}: {
  colors: string[];
  ratios?: number[];
}) {
  const r = ratios ?? colors.map(() => 1);
  const sum = r.reduce((a, b) => a + b, 0);
  return (
    <View style={styles.fill}>
      {colors.map((c, i) => (
        <View key={i} style={{ flex: r[i] / sum, backgroundColor: c }} />
      ))}
    </View>
  );
}

function VStripes({
  colors,
  ratios,
}: {
  colors: string[];
  ratios?: number[];
}) {
  const r = ratios ?? colors.map(() => 1);
  const sum = r.reduce((a, b) => a + b, 0);
  return (
    <View style={[styles.fill, styles.row]}>
      {colors.map((c, i) => (
        <View key={i} style={{ flex: r[i] / sum, backgroundColor: c }} />
      ))}
    </View>
  );
}

function Cross({
  base,
  cross,
}: {
  base: string;
  cross: string;
}) {
  return (
    <View style={[styles.fill, { backgroundColor: base }]}>
      <View style={[styles.abs, { left: "42%", width: "16%", height: "100%", backgroundColor: cross }]} />
      <View style={[styles.abs, { top: "42%", height: "16%", width: "100%", backgroundColor: cross }]} />
    </View>
  );
}

function NordicCross({
  base,
  cross,
  border,
}: {
  base: string;
  cross: string;
  border?: string;
}) {
  // eenvoudige Nordic cross: border (wit) + inner cross (blauw)
  return (
    <View style={[styles.fill, { backgroundColor: base }]}>
      {!!border && (
        <>
          <View style={[styles.abs, { left: "28%", width: "18%", height: "100%", backgroundColor: border }]} />
          <View style={[styles.abs, { top: "40%", height: "20%", width: "100%", backgroundColor: border }]} />
        </>
      )}
      <View style={[styles.abs, { left: "31%", width: "12%", height: "100%", backgroundColor: cross }]} />
      <View style={[styles.abs, { top: "43%", height: "14%", width: "100%", backgroundColor: cross }]} />
    </View>
  );
}

function CircleFlag({
  base,
  circle,
}: {
  base: string;
  circle: string;
}) {
  return (
    <View style={[styles.fill, { backgroundColor: base }]}>
      <View style={[styles.abs, styles.centerCircle, { backgroundColor: circle }]} />
    </View>
  );
}

function CantonStripesUS() {
  return (
    <View style={styles.fill}>
      {/* stripes */}
      <View style={styles.fill}>
        {Array.from({ length: 7 }).map((_, i) => (
          <View key={i} style={{ flex: 1, backgroundColor: i % 2 === 0 ? "#B22234" : "#FFFFFF" }} />
        ))}
      </View>
      {/* blue canton */}
      <View style={[styles.abs, { left: 0, top: 0, width: "45%", height: "55%", backgroundColor: "#3C3B6E" }]} />
    </View>
  );
}

function BrazilSimple() {
  return (
    <View style={[styles.fill, { backgroundColor: "#009B3A" }]}>
      <View style={[styles.abs, styles.diamond, { backgroundColor: "#FFDF00" }]} />
      <View style={[styles.abs, styles.centerCircle, { backgroundColor: "#002776" }]} />
    </View>
  );
}

function PanamaSimple() {
  return (
    <View style={[styles.fill, styles.wrap]}>
      <View style={[styles.abs, { left: 0, top: 0, width: "50%", height: "50%", backgroundColor: "#FFFFFF" }]} />
      <View style={[styles.abs, { left: "50%", top: 0, width: "50%", height: "50%", backgroundColor: "#D21034" }]} />
      <View style={[styles.abs, { left: 0, top: "50%", width: "50%", height: "50%", backgroundColor: "#005293" }]} />
      <View style={[styles.abs, { left: "50%", top: "50%", width: "50%", height: "50%", backgroundColor: "#FFFFFF" }]} />
    </View>
  );
}

function QatarSimple() {
  return (
    <View style={[styles.fill, styles.row]}>
      <View style={{ flex: 2, backgroundColor: "#FFFFFF" }} />
      <View style={{ flex: 3, backgroundColor: "#8D1B3D" }} />
    </View>
  );
}

function CzechiaSimple() {
  return (
    <View style={[styles.fill, { backgroundColor: "#FFFFFF" }]}>
      <View style={[styles.abs, { left: 0, top: "50%", width: "100%", height: "50%", backgroundColor: "#D7141A" }]} />
      <View style={[styles.abs, styles.triangleLeft, { borderRightColor: "#11457E" }]} />
    </View>
  );
}

function CongoDRSimple() {
  return (
    <View style={[styles.fill, { backgroundColor: "#4AADD6" }]}>
      <View style={[styles.abs, styles.diagonalRed]} />
      <View style={[styles.abs, styles.diagonalYellowBorder]} />
    </View>
  );
}

function SouthAfricaVerySimple() {
  // sterk vereenvoudigd: groen (midden), rood (boven), blauw (onder), zwart links
  return (
    <View style={[styles.fill, { backgroundColor: "#FFFFFF" }]}>
      <View style={[styles.abs, { top: 0, left: 0, width: "100%", height: "50%", backgroundColor: "#E03C31" }]} />
      <View style={[styles.abs, { top: "50%", left: 0, width: "100%", height: "50%", backgroundColor: "#002395" }]} />
      <View style={[styles.abs, { top: "35%", left: 0, width: "100%", height: "30%", backgroundColor: "#007A4D" }]} />
      <View style={[styles.abs, { top: 0, left: 0, width: "22%", height: "100%", backgroundColor: "#000000" }]} />
      <View style={[styles.abs, { top: "35%", left: "22%", width: "10%", height: "30%", backgroundColor: "#FFB612" }]} />
    </View>
  );
}

function UruguaySimple() {
  return (
    <View style={styles.fill}>
      {Array.from({ length: 9 }).map((_, i) => (
        <View key={i} style={{ flex: 1, backgroundColor: i % 2 === 0 ? "#FFFFFF" : "#0038A8" }} />
      ))}
    </View>
  );
}

function CapeVerdeSimple() {
  // blauw met witte/rode band (vereenvoudigd)
  return (
    <View style={[styles.fill, { backgroundColor: "#003893" }]}>
      <View style={[styles.abs, { top: "62%", height: "18%", width: "100%", backgroundColor: "#FFFFFF" }]} />
      <View style={[styles.abs, { top: "68%", height: "6%", width: "100%", backgroundColor: "#D21034" }]} />
    </View>
  );
}

function CuracaoSimple() {
  return (
    <View style={[styles.fill, { backgroundColor: "#002B7F" }]}>
      <View style={[styles.abs, { top: "50%", height: "18%", width: "100%", backgroundColor: "#F9E814" }]} />
      <View style={[styles.abs, { top: "56%", height: "6%", width: "100%", backgroundColor: "#FFFFFF" }]} />
    </View>
  );
}

function KoreaSimple() {
  return (
    <View style={[styles.fill, { backgroundColor: "#FFFFFF" }]}>
      <View style={[styles.abs, styles.centerCircle, { backgroundColor: "#CD2E3A" }]} />
      <View style={[styles.abs, { ...styles.centerCircle, top: "50%", height: "25%", backgroundColor: "#0047A0", borderTopLeftRadius: 0, borderTopRightRadius: 0 }]} />
    </View>
  );
}

function FlagRectBase({ team, size = "sm" }: Props) {
  const width = W[size];
  const height = H[size];

  return (
    <View style={[styles.flag, { width, height }]}>
      {/* Specials / onbekend */}
      {team === "Specials" && <View style={[styles.fill, { backgroundColor: "#E5E7EB" }]} />}

      {/* Europe */}
      {team === "Netherlands" && <HStripes colors={["#AE1C28", "#FFFFFF", "#21468B"]} />}
      {team === "Germany" && <HStripes colors={["#000000", "#DD0000", "#FFCE00"]} />}
      {team === "France" && <VStripes colors={["#0055A4", "#FFFFFF", "#EF4135"]} />}
      {team === "Belgium" && <VStripes colors={["#000000", "#FFD100", "#EF3340"]} />}
      {team === "Sweden" && <NordicCross base="#006AA7" border="#FECC00" cross="#FECC00" />}
      {team === "Norway" && <NordicCross base="#BA0C2F" border="#FFFFFF" cross="#00205B" />}
      {team === "Switzerland" && <Cross base="#D52B1E" cross="#FFFFFF" />}
      {team === "England" && <Cross base="#FFFFFF" cross="#CE1126" />}
      {team === "Scotland" && (
        <View style={[styles.fill, { backgroundColor: "#0065BD" }]}>
          <View style={[styles.abs, styles.saltireA, { backgroundColor: "#FFFFFF" }]} />
          <View style={[styles.abs, styles.saltireB, { backgroundColor: "#FFFFFF" }]} />
        </View>
      )}
      {team === "Portugal" && <VStripes colors={["#006600", "#FF0000"]} ratios={[2, 3]} />}
      {team === "Spain" && <HStripes colors={["#AA151B", "#F1BF00", "#AA151B"]} ratios={[1, 2, 1]} />}
      {team === "Austria" && <HStripes colors={["#ED2939", "#FFFFFF", "#ED2939"]} />}
      {team === "Czechia" && <CzechiaSimple />}
      {team === "Croatia" && <HStripes colors={["#FF0000", "#FFFFFF", "#171796"]} />}
      {team === "Bosnia" && (
        <View style={[styles.fill, { backgroundColor: "#002395" }]}>
          <View style={[styles.abs, styles.diagYellow, { backgroundColor: "#FCD116" }]} />
        </View>
      )}
      {team === "Turkey" && <View style={[styles.fill, { backgroundColor: "#E30A17" }]} />}

      {/* Americas */}
      {team === "USA" && <CantonStripesUS />}
      {team === "Canada" && <VStripes colors={["#D52B1E", "#FFFFFF", "#D52B1E"]} />}
      {team === "Mexico" && <VStripes colors={["#006847", "#FFFFFF", "#CE1126"]} />}
      {team === "Argentina" && <HStripes colors={["#74ACDF", "#FFFFFF", "#74ACDF"]} />}
      {team === "Brazil" && <BrazilSimple />}
      {team === "Colombia" && <HStripes colors={["#FCD116", "#003893", "#CE1126"]} ratios={[2, 1, 1]} />}
      {team === "Ecuador" && <HStripes colors={["#FCD116", "#003893", "#CE1126"]} ratios={[2, 1, 1]} />}
      {team === "Paraguay" && <HStripes colors={["#D52B1E", "#FFFFFF", "#0038A8"]} />}
      {team === "Uruguay" && <UruguaySimple />}
      {team === "Panama" && <PanamaSimple />}
      {team === "Curacao" && <CuracaoSimple />}

      {/* Africa */}
      {team === "Morocco" && <View style={[styles.fill, { backgroundColor: "#C1272D" }]} />}
      {team === "Tunisia" && <View style={[styles.fill, { backgroundColor: "#E70013" }]} />}
      {team === "Senegal" && <VStripes colors={["#00853F", "#FDEF42", "#E31B23"]} />}
      {team === "Ghana" && <HStripes colors={["#CE1126", "#FCD116", "#006B3F"]} />}
      {team === "Egypt" && <HStripes colors={["#CE1126", "#FFFFFF", "#000000"]} />}
      {team === "Ivory Coast" && <VStripes colors={["#F77F00", "#FFFFFF", "#009E60"]} />}
      {team === "South Africa" && <SouthAfricaVerySimple />}
      {team === "DR Congo" && <CongoDRSimple />}
      {team === "Cape Verde" && <CapeVerdeSimple />}

      {/* Asia/Oceania */}
      {team === "Japan" && <CircleFlag base="#FFFFFF" circle="#BC002D" />}
      {team === "South Korea" && <KoreaSimple />}
      {team === "Iran" && <HStripes colors={["#239F40", "#FFFFFF", "#DA0000"]} />}
      {team === "Iraq" && <HStripes colors={["#CE1126", "#FFFFFF", "#000000"]} />}
      {team === "Jordan" && (
        <View style={[styles.fill, { backgroundColor: "#FFFFFF" }]}>
          <View style={[styles.abs, { top: 0, height: "33.33%", width: "100%", backgroundColor: "#000000" }]} />
          <View style={[styles.abs, { top: "66.66%", height: "33.34%", width: "100%", backgroundColor: "#007A3D" }]} />
          <View style={[styles.abs, styles.triangleLeft, { borderRightColor: "#CE1126" }]} />
        </View>
      )}
      {team === "Algeria" && <VStripes colors={["#006233", "#FFFFFF"]} />}
      {team === "Qatar" && <QatarSimple />}
      {team === "Saudi Arabia" && <View style={[styles.fill, { backgroundColor: "#006C35" }]} />}
      {team === "Australia" && <View style={[styles.fill, { backgroundColor: "#00008B" }]} />}
      {team === "New Zealand" && <View style={[styles.fill, { backgroundColor: "#00247D" }]} />}
      {team === "Uzbekistan" && (
        <View style={styles.fill}>
          <HStripes colors={["#0099B5", "#FFFFFF", "#1EB53A"]} ratios={[2, 2, 2]} />
          <View style={[styles.abs, { top: "33.33%", height: 2, width: "100%", backgroundColor: "#CE1126" }]} />
          <View style={[styles.abs, { top: "66.66%", height: 2, width: "100%", backgroundColor: "#CE1126" }]} />
        </View>
      )}
    </View>
  );
}

export default memo(FlagRectBase);

const styles = StyleSheet.create({
  flag: {
    borderWidth: 1,
    borderColor: "#111827",
    borderRadius: 2,
    overflow: "hidden",
    backgroundColor: "#E5E7EB",
  },
  fill: { flex: 1 },
  row: { flexDirection: "row" },
  abs: { position: "absolute" },

  centerCircle: {
    left: "32%",
    top: "25%",
    width: "36%",
    height: "50%",
    borderRadius: 999,
  },
  diamond: {
    left: "22%",
    top: "20%",
    width: "56%",
    height: "60%",
    transform: [{ rotate: "45deg" }],
    borderRadius: 1,
  },

  triangleLeft: {
    left: 0,
    top: 0,
    width: 0,
    height: 0,
    borderTopWidth: 999,
    borderBottomWidth: 999,
    borderRightWidth: 999,
    borderTopColor: "transparent",
    borderBottomColor: "transparent",
    borderRightColor: "#000",
    transform: [{ scaleX: 0.03 }, { scaleY: 0.03 }],
  },

  // Scotland saltire (2 diagonals)
  saltireA: {
    left: "-25%",
    top: "45%",
    width: "150%",
    height: "12%",
    transform: [{ rotate: "25deg" }],
  },
  saltireB: {
    left: "-25%",
    top: "45%",
    width: "150%",
    height: "12%",
    transform: [{ rotate: "-25deg" }],
  },

  // Bosnia diagonal (simple band)
  diagYellow: {
    left: "55%",
    top: "-20%",
    width: "30%",
    height: "160%",
    transform: [{ rotate: "25deg" }],
  },

  // DR Congo diagonal band (simple)
  diagonalRed: {
    left: "-30%",
    top: "40%",
    width: "160%",
    height: "20%",
    backgroundColor: "#CE1126",
    transform: [{ rotate: "-20deg" }],
  },
  diagonalYellowBorder: {
    left: "-30%",
    top: "38%",
    width: "160%",
    height: "24%",
    backgroundColor: "transparent",
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderColor: "#FCD116",
    transform: [{ rotate: "-20deg" }],
  },

  wrap: { position: "relative" },
});