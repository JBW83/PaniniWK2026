import React, { memo } from "react";
import { StyleSheet, Text, View } from "react-native";

type Props = {
  size?: "sm" | "md";
};

/**
 * Eenvoudig "Panini" icoon voor Specials.
 * (Gele achtergrond + rode rand + PANINI tekst)
 * Werkt stabiel op web en mobiel.
 */
function PaniniIconRectBase({ size = "sm" }: Props) {
  const dims = size === "md" ? styles.md : styles.sm;

  return (
    <View style={[styles.box, dims]}>
      <View style={styles.inner}>
        <Text style={[styles.text, size === "md" ? styles.textMd : styles.textSm]}>
          PANINI
        </Text>
      </View>
    </View>
  );
}

export default memo(PaniniIconRectBase);

const styles = StyleSheet.create({
  box: {
    borderWidth: 1,
    borderColor: "#B91C1C",
    borderRadius: 3,
    overflow: "hidden",
    backgroundColor: "#FACC15",
    alignItems: "center",
    justifyContent: "center",
  },
  inner: {
    width: "100%",
    height: "100%",
    borderWidth: 2,
    borderColor: "#DC2626",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "#7F1D1D",
    fontWeight: "900",
    letterSpacing: 0.4,
  },
  textSm: {
    fontSize: 7,
    lineHeight: 10,
  },
  textMd: {
    fontSize: 8,
    lineHeight: 12,
  },
  sm: {
    width: 18,
    height: 12,
  },
  md: {
    width: 22,
    height: 14,
  },
});