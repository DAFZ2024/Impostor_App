import { AlienIcon } from "@/components/Icons";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import Animated, {
    FadeInDown,
    FadeInUp,
} from "react-native-reanimated";

const { width } = Dimensions.get("window");

export default function LoginScreen() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) return;
    setLoading(true);
    const success = await signIn(email.trim(), password);
    setLoading(false);
    // Navigation happens automatically via auth state change in _layout
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* Background nebulas */}
      <View style={styles.nebula1} />
      <View style={styles.nebula2} />

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Logo */}
        <Animated.View
          entering={FadeInDown.delay(100).duration(600)}
          style={styles.logoSection}
        >
          <View style={styles.logoOuter}>
            <View style={styles.logoInner}>
              <AlienIcon size={50} color="#e74c3c" />
            </View>
          </View>
          <Text style={styles.logoTitle}>THE IMPOSTOR</Text>
          <Text style={styles.logoSubtitle}>INICIAR SESIÓN</Text>
        </Animated.View>

        {/* Form */}
        <Animated.View
          entering={FadeInDown.delay(200).duration(600)}
          style={styles.formCard}
        >
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Correo electrónico</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="tu@email.com"
                placeholderTextColor="#444"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Contraseña</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor="#444"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>
          </View>

          <Pressable
            onPress={handleLogin}
            disabled={loading}
            style={({ pressed }) => [
              styles.loginButton,
              pressed && !loading && styles.btnPressed,
              loading && styles.loginButtonDisabled,
            ]}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.loginButtonText}>ENTRAR</Text>
            )}
          </Pressable>
        </Animated.View>

        {/* Register link */}
        <Animated.View
          entering={FadeInUp.delay(300).duration(600)}
          style={styles.footer}
        >
          <Text style={styles.footerText}>¿No tienes cuenta?</Text>
          <Pressable
            onPress={() => router.push("/(auth)/register")}
            style={({ pressed }) => [pressed && { opacity: 0.7 }]}
          >
            <Text style={styles.footerLink}>Crear cuenta</Text>
          </Pressable>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#050610",
  },
  scroll: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
    paddingTop: 80,
  },

  // Nebulas
  nebula1: {
    position: "absolute",
    top: -80,
    right: -60,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: "#e74c3c",
    opacity: 0.04,
  },
  nebula2: {
    position: "absolute",
    bottom: -100,
    left: -80,
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: "#00ffff",
    opacity: 0.025,
  },

  // Logo
  logoSection: {
    alignItems: "center",
    marginBottom: 40,
  },
  logoOuter: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#0c0d16",
    borderWidth: 2,
    borderColor: "#e74c3c20",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#e74c3c",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
    marginBottom: 20,
  },
  logoInner: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#0a0b14",
    borderWidth: 1,
    borderColor: "#e74c3c15",
    justifyContent: "center",
    alignItems: "center",
  },
  logoTitle: {
    fontSize: 28,
    fontWeight: "900",
    color: "#e74c3c",
    letterSpacing: 4,
    textShadowColor: "#e74c3c",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
  },
  logoSubtitle: {
    color: "#4a5568",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 6,
    marginTop: 8,
  },

  // Form
  formCard: {
    backgroundColor: "#0a0b14",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#1a1b2e",
    padding: 24,
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    color: "#8899aa",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  inputWrapper: {
    backgroundColor: "#0d0e1a",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#1a1b2e",
    paddingHorizontal: 16,
  },
  input: {
    color: "#fff",
    fontSize: 16,
    height: 52,
  },
  loginButton: {
    height: 56,
    borderRadius: 28,
    backgroundColor: "#e74c3c",
    borderWidth: 1,
    borderColor: "#ff6b5b",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#e74c3c",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
    marginTop: 8,
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: 4,
  },
  btnPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.97 }],
  },

  // Footer
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginTop: 28,
  },
  footerText: {
    color: "#4a5568",
    fontSize: 14,
  },
  footerLink: {
    color: "#00ffff",
    fontSize: 14,
    fontWeight: "700",
  },
});
