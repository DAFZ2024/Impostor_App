import { showAlert } from "@/components/CustomAlert";
import { AlienIcon } from "@/components/Icons";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";

export default function RegisterScreen() {
  const router = useRouter();
  const { signUp } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    const trimName = name.trim();
    const trimEmail = email.trim();

    if (!trimName || !trimEmail || !password) {
      showAlert("Campos incompletos", "Por favor completa todos los campos.");
      return;
    }

    if (password.length < 6) {
      showAlert(
        "Contraseña corta",
        "La contraseña debe tener al menos 6 caracteres.",
      );
      return;
    }

    if (password !== confirmPassword) {
      showAlert("Error", "Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);
    const success = await signUp(trimEmail, password, trimName);
    setLoading(false);

    if (success) {
      router.replace("/(auth)/confirm-email");
    }
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
              <AlienIcon size={40} color="#e74c3c" />
            </View>
          </View>
          <Text style={styles.logoTitle}>CREAR CUENTA</Text>
          <Text style={styles.logoSubtitle}>ÚNETE AL JUEGO</Text>
        </Animated.View>

        {/* Form */}
        <Animated.View
          entering={FadeInDown.delay(200).duration(600)}
          style={styles.formCard}
        >
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nombre de jugador</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Tu nombre..."
                placeholderTextColor="#444"
                value={name}
                onChangeText={setName}
                maxLength={20}
              />
            </View>
          </View>

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
                placeholder="Mínimo 6 caracteres"
                placeholderTextColor="#444"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Confirmar contraseña</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Repetir contraseña"
                placeholderTextColor="#444"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />
            </View>
            {password.length > 0 &&
              confirmPassword.length > 0 &&
              password !== confirmPassword && (
                <Text style={styles.errorText}>
                  Las contraseñas no coinciden
                </Text>
              )}
          </View>

          <Pressable
            onPress={handleRegister}
            disabled={loading}
            style={({ pressed }) => [
              styles.registerButton,
              pressed && !loading && styles.btnPressed,
              loading && styles.registerButtonDisabled,
            ]}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.registerButtonText}>CREAR CUENTA</Text>
            )}
          </Pressable>
        </Animated.View>

        {/* Back to login */}
        <Animated.View
          entering={FadeInUp.delay(300).duration(600)}
          style={styles.footer}
        >
          <Text style={styles.footerText}>¿Ya tienes cuenta?</Text>
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [pressed && { opacity: 0.7 }]}
          >
            <Text style={styles.footerLink}>Iniciar sesión</Text>
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
    paddingTop: 60,
    paddingBottom: 40,
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
    backgroundColor: "#9b59b6",
    opacity: 0.03,
  },

  // Logo
  logoSection: {
    alignItems: "center",
    marginBottom: 32,
  },
  logoOuter: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#0c0d16",
    borderWidth: 2,
    borderColor: "#e74c3c20",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#e74c3c",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
    marginBottom: 16,
  },
  logoInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#0a0b14",
    borderWidth: 1,
    borderColor: "#e74c3c15",
    justifyContent: "center",
    alignItems: "center",
  },
  logoTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: "#fff",
    letterSpacing: 4,
  },
  logoSubtitle: {
    color: "#e74c3c80",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 5,
    marginTop: 6,
  },

  // Form
  formCard: {
    backgroundColor: "#0a0b14",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#1a1b2e",
    padding: 24,
    gap: 16,
  },
  inputGroup: {
    gap: 6,
  },
  label: {
    color: "#8899aa",
    fontSize: 11,
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
    height: 50,
  },
  errorText: {
    color: "#e74c3c",
    fontSize: 12,
    marginTop: 4,
  },
  registerButton: {
    height: 56,
    borderRadius: 28,
    backgroundColor: "#2ecc71",
    borderWidth: 1,
    borderColor: "#5dde9e",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#2ecc71",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
    marginTop: 4,
  },
  registerButtonDisabled: {
    opacity: 0.6,
  },
  registerButtonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "900",
    letterSpacing: 3,
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
    marginTop: 24,
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
