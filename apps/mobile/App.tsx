import { StatusBar } from "expo-status-bar";
import { Pressable, StyleSheet, Text, useColorScheme, View } from "react-native";
import { DEFAULT_LOCALE, translator } from "@milhojas/core";

// Placeholder home. Onboarding (P4) and the "Hoy" tally (P7) replace it.
const tr = translator(DEFAULT_LOCALE);

const palette = {
  light: { bg: "#f2f4ef", ink: "#18302a", muted: "#5a6b64", accent: "#b8740f", surface: "#ffffff" },
  dark: { bg: "#111a17", ink: "#e4ebe6", muted: "#9aaba3", accent: "#e2a443", surface: "#18231f" },
};

export default function App() {
  const colors = useColorScheme() === "dark" ? palette.dark : palette.light;
  return (
    <View style={[styles.screen, { backgroundColor: colors.bg }]}>
      <Text style={[styles.title, { color: colors.ink }]}>{tr("app.name")}</Text>
      <Text style={[styles.tagline, { color: colors.muted }]}>{tr("app.tagline")}</Text>
      <Pressable
        accessibilityRole="button"
        style={[styles.button, { backgroundColor: colors.accent }]}
      >
        <Text style={styles.buttonText}>{tr("home.vendor_cta")}</Text>
      </Pressable>
      <Text style={[styles.note, { color: colors.muted }]}>{tr("home.coming_soon")}</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, justifyContent: "flex-end", padding: 24, paddingBottom: 48, gap: 16 },
  title: { fontSize: 40, fontWeight: "700" },
  tagline: { fontSize: 18 },
  // Large touch target: thumb-reachable at the bottom of the screen.
  button: { minHeight: 56, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  buttonText: { color: "#ffffff", fontSize: 18, fontWeight: "600" },
  note: { fontSize: 14 },
});
