import React, { useMemo } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

type Props = {
  value: string;
  onChange: (text: string) => void;
  placeholder?: string;
  onSubmit?: () => void;
};

export default function SearchBar({
  value,
  onChange,
  placeholder = "Zoek…",
  onSubmit,
}: Props) {
  const showClear = useMemo(() => value.trim().length > 0, [value]);

  return (
    <View style={styles.wrap}>
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        autoCorrect={false}
        autoCapitalize="none"
        returnKeyType="search"
        onSubmitEditing={onSubmit}
        accessibilityLabel="Zoekveld"
        style={styles.input}
      />

      {showClear && (
        <Pressable
          onPress={() => onChange("")}
          accessibilityRole="button"
          accessibilityLabel="Wis zoektekst"
          style={({ pressed }) => [styles.clearBtn, pressed && styles.pressed]}
        >
          <Text style={styles.clearTxt}>×</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: "relative",
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingLeft: 12,
    paddingRight: 40, // ruimte voor clear knop
    paddingVertical: 10,
  },
  input: {
    fontSize: 16,
  },
  clearBtn: {
    position: "absolute",
    right: 8,
    top: 6,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  clearTxt: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    lineHeight: 18,
  },
  pressed: {
    opacity: 0.7,
  },
});