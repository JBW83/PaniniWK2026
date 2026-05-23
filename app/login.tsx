import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Platform,
} from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";

import {
  signIn,
  signOut,
  signUp,
  getSession,
  onAuthStateChange,
} from "../src/lib/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [mode, setMode] = useState<"login" | "signup">("login");

  const [statusEmail, setStatusEmail] = useState<string | null>(null);
  const [message, setMessage] = useState<string>("");

  const canSubmit = useMemo(() => {
    return email.trim().length > 3 && password.length >= 6;
  }, [email, password]);

  useEffect(() => {
    (async () => {
      try {
        const session = await getSession();
        setStatusEmail(session?.user?.email ?? null);
      } catch {
        setStatusEmail(null);
      }
    })();

    const unsub = onAuthStateChange((sessionEmail) => {
      setStatusEmail(sessionEmail);
      setMessage("");
    });

    return unsub;
  }, []);

  const handleSubmit = async () => {
    setMessage("");

    try {
      if (mode === "login") {
        await signIn(email.trim(), password);
        setMessage("✅ Ingelogd!");
      } else {
        await signUp(email.trim(), password);
        setMessage("✅ Account aangemaakt!");
      }
    } catch (e: any) {
      const errMsg = e?.message ? String(e.message) : "Onbekende fout";
      setMessage(`❌ ${errMsg}`);
    }
  };

  const handleLogout = async () => {
    setMessage("");
    try {
      await signOut();
      setMessage("✅ Uitgelogd");
    } catch (e: any) {
      const errMsg = e?.message ? String(e.message) : "Onbekende fout";
      setMessage(`❌ ${errMsg}`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Account</Text>

      <View style={styles.statusCard}>
        <Text style={styles.statusLabel}>Ingelogd als</Text>
        <Text style={styles.statusValue}>
          {statusEmail ? statusEmail : "Niet ingelogd"}
        </Text>

        {statusEmail && (
          <Pressable onPress={handleLogout} style={styles.logoutBtn}>
            <FontAwesome name="sign-out" size={16} color="#fff" />
            <Text style={styles.logoutTxt}>Uitloggen</Text>
          </Pressable>
        )}
      </View>

      {!statusEmail && (
        <View style={styles.card}>
          <View style={styles.modeRow}>
            <Pressable
              onPress={() => setMode("login")}
              style={[styles.modeBtn, mode === "login" && styles.modeBtnActive]}
            >
              <Text style={styles.modeTxt}>Login</Text>
            </Pressable>

            <Pressable
              onPress={() => setMode("signup")}
              style={[styles.modeBtn, mode === "signup" && styles.modeBtnActive]}
            >
              <Text style={styles.modeTxt}>Signup</Text>
            </Pressable>
          </View>

          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="E-mail"
            style={styles.input}
          />

          <View style={styles.passwordRow}>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Wachtwoord"
              secureTextEntry={!passwordVisible}
              style={styles.input}
            />

            <Pressable
              onPress={() => setPasswordVisible((v) => !v)}
              style={styles.eyeBtn}
            >
              <FontAwesome
                name={passwordVisible ? "eye-slash" : "eye"}
                size={16}
              />
            </Pressable>
          </View>

          <Pressable
            onPress={handleSubmit}
            disabled={!canSubmit}
            style={styles.primaryBtn}
          >
            <Text style={styles.primaryTxt}>
              {mode === "login" ? "Inloggen" : "Account maken"}
            </Text>
          </Pressable>

          {!!message && <Text style={styles.message}>{message}</Text>}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 22, fontWeight: "bold" },

  statusCard: { marginBottom: 10 },

  statusLabel: { fontSize: 12 },
  statusValue: { fontSize: 14, fontWeight: "bold" },

  logoutBtn: { marginTop: 10, backgroundColor: "red", padding: 10 },
  logoutTxt: { color: "white" },

  card: { marginTop: 10 },

  modeRow: { flexDirection: "row", marginBottom: 10 },

  modeBtn: { flex: 1, padding: 10, backgroundColor: "#ccc" },
  modeBtnActive: { backgroundColor: "blue" },

  modeTxt: { textAlign: "center", color: "white" },

  input: { borderWidth: 1, marginBottom: 10, padding: 8 },

  passwordRow: { flexDirection: "row", alignItems: "center" },
  eyeBtn: { position: "absolute", right: 10 },

  primaryBtn: { backgroundColor: "black", padding: 12 },
  primaryTxt: { color: "white", textAlign: "center" },

  message: { marginTop: 10 },
});