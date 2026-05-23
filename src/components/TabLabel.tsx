import React from "react";
import { View, Text, StyleSheet } from "react-native";

type Props = {
  title: string;
  data: { count: number }[];
};

export default function TabLabel({ title, data }: Props) {
  const total = data.length;
  const owned = data.filter((x) => x.count > 0).length;
  const percentage = total === 0 ? 0 : owned / total;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>

      <View style={styles.bar}>
        <View
          style={[
            styles.fill,
            { width: `${percentage * 100}%` },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    minWidth: 60,
  },
  title: {
    fontSize: 12,
    fontWeight: "600",
  },
  bar: {
    marginTop: 4,
    height: 4,
    width: "100%",
    backgroundColor: "#e5e7eb",
    borderRadius: 2,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    backgroundColor: "#22c55e",
  },
});
