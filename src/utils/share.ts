// === BEGIN FILE: share.ts ===

import { Linking, Alert } from "react-native";

export const shareCombinedWhatsApp = async (text: string) => {
  try {
    const url = `whatsapp://send?text=${encodeURIComponent(text)}`;

    const supported = await Linking.canOpenURL(url);

    if (!supported) {
      Alert.alert(
        "WhatsApp niet gevonden",
        "Installeer WhatsApp om deze functie te gebruiken."
      );
      return;
    }

    await Linking.openURL(url);
  } catch (error) {
    Alert.alert("Fout", "Delen via WhatsApp mislukt.");
  }
};

// === END FILE ===