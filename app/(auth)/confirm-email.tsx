import { useRouter } from "expo-router";
import { AlertTriangle, CheckCircle, Inbox, Mail } from "lucide-react-native";
import React, { useEffect } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, {
  Easing,
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

const ACCENT = "#2ecc71";
const ACCENT_DIM = "#1a8a4a";
const RED = "#e74c3c";
const GOLD = "#f1c40f";
const BG = "#070810";
const CARD = "#0d0f1e";
const BORDER = "#1e2240";

export default function ConfirmEmailScreen() {
  const router = useRouter();

  const pulseScale = useSharedValue(1);
  const glowOpacity = useSharedValue(0.3);
  const floatY = useSharedValue(0);

  useEffect(() => {
    pulseScale.value = withRepeat(
      withSequence(
        withTiming(1.12, { duration: 1400, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 1400, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
    glowOpacity.value = withRepeat(
      withSequence(
        withTiming(0.7, { duration: 1400, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.3, { duration: 1400, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
    floatY.value = withRepeat(
      withSequence(
        withTiming(-8, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 2000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, []);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  const floatStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: floatY.value }],
  }));

  return (
    <View style={styles.bg}>
      {/* Background decorations */}
      <View style={styles.bgCircle1} />
      <View style={styles.bgCircle2} />
      <View style={styles.bgCircle3} />

      {/* Glow behind icon */}
      <Animated.View style={[styles.iconGlow, glowStyle]} />

      <Animated.View
        entering={FadeInDown.delay(80).duration(500)}
        style={styles.screen}
      >
        {/* Top badge */}
        <Animated.View
          entering={FadeInUp.delay(150).duration(400)}
          style={styles.badge}
        >
          <Mail color={ACCENT} size={12} strokeWidth={2.5} />
          <Text style={styles.badgeText}>VERIFICACIÓN DE CUENTA</Text>
        </Animated.View>

        {/* Floating animated icon */}
        <Animated.View style={[styles.iconWrapper, floatStyle]}>
          <Animated.View style={[styles.iconRing2, pulseStyle]} />
          <View style={styles.iconRing1}>
            <View style={styles.iconCore}>
              <Mail color={ACCENT} size={40} strokeWidth={1.8} />
            </View>
          </View>
        </Animated.View>

        {/* Title */}
        <Animated.View entering={FadeInDown.delay(200).duration(500)} style={styles.titleBlock}>
          <Text style={styles.title}>REVISA TU</Text>
          <Text style={[styles.title, styles.titleAccent]}>CORREO</Text>
          <Text style={styles.subtitle}>
            Enviamos un enlace de activación a tu email.{"\n"}
            Ábrelo para entrar al juego.
          </Text>
        </Animated.View>

        {/* Steps card */}
        <Animated.View entering={FadeInDown.delay(300).duration(500)} style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardHeaderText}>PASOS A SEGUIR</Text>
          </View>

          <StepRow icon={<Inbox color={ACCENT} size={18} strokeWidth={2} />} num={1} text="Abre tu bandeja de entrada" />
          <View style={styles.stepConnector} />
          <StepRow icon={<Mail color={ACCENT} size={18} strokeWidth={2} />} num={2} text='Busca el correo de "The Impostor"' />
          <View style={styles.stepConnector} />
          <StepRow icon={<CheckCircle color={ACCENT} size={18} strokeWidth={2} />} num={3} text='Haz clic en "Confirmar email"' />
        </Animated.View>

        {/* Tip */}
        <Animated.View entering={FadeInDown.delay(400).duration(500)} style={styles.tipCard}>
          <AlertTriangle color={GOLD} size={16} strokeWidth={2.2} />
          <Text style={styles.tipText}>Revisa también tu carpeta de spam</Text>
        </Animated.View>

        {/* Button */}
        <Animated.View entering={FadeInDown.delay(500).duration(500)} style={styles.btnWrapper}>
          <Pressable
            onPress={() => router.replace("/(auth)/login")}
            style={({ pressed }) => [
              styles.btn,
              pressed && styles.btnPressed,
            ]}
          >
            <Text style={styles.btnText}>IR A INICIAR SESIÓN</Text>
          </Pressable>
          {/* 3D bottom shadow for button */}
          <View style={styles.btnShadow} />
        </Animated.View>
      </Animated.View>
    </View>
  );
}

function StepRow({
  icon,
  num,
  text,
}: {
  icon: React.ReactNode;
  num: number;
  text: string;
}) {
  return (
    <View style={stepStyles.row}>
      <View style={stepStyles.numBadge}>
        <Text style={stepStyles.numText}>{num}</Text>
      </View>
      <View style={stepStyles.iconBox}>{icon}</View>
      <Text style={stepStyles.text}>{text}</Text>
    </View>
  );
}

const stepStyles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 10,
    paddingHorizontal: 4,
  },
  numBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: ACCENT_DIM,
    justifyContent: "center",
    alignItems: "center",
  },
  numText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 0.5,
  },
  iconBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: "#2ecc7115",
    borderWidth: 1,
    borderColor: "#2ecc7125",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "#c8d6e5",
    fontSize: 13,
    fontWeight: "600",
    flex: 1,
    lineHeight: 18,
  },
});

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    backgroundColor: BG,
    justifyContent: "center",
    alignItems: "center",
  },

  // Background circles
  bgCircle1: {
    position: "absolute",
    top: -120,
    right: -80,
    width: 340,
    height: 340,
    borderRadius: 170,
    backgroundColor: ACCENT,
    opacity: 0.035,
  },
  bgCircle2: {
    position: "absolute",
    bottom: -150,
    left: -100,
    width: 380,
    height: 380,
    borderRadius: 190,
    backgroundColor: "#6c5ce7",
    opacity: 0.04,
  },
  bgCircle3: {
    position: "absolute",
    top: "40%",
    left: "30%",
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: RED,
    opacity: 0.025,
  },

  // Glow
  iconGlow: {
    position: "absolute",
    top: "20%",
    alignSelf: "center",
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: ACCENT,
    opacity: 0.3,
    // blur is not supported natively, faking it with multiple layers
  },

  screen: {
    width: "90%",
    maxWidth: 400,
    alignItems: "center",
    gap: 18,
    paddingTop: 20,
    paddingBottom: 30,
  },

  // Badge
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#2ecc7115",
    borderWidth: 1,
    borderColor: "#2ecc7130",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  badgeText: {
    color: ACCENT,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 2,
  },

  // Icon
  iconWrapper: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 4,
  },
  iconRing2: {
    position: "absolute",
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 1,
    borderColor: "#2ecc7120",
    backgroundColor: "#2ecc7106",
  },
  iconRing1: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 1.5,
    borderColor: "#2ecc7135",
    backgroundColor: "#2ecc7110",
    justifyContent: "center",
    alignItems: "center",
  },
  iconCore: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: CARD,
    borderWidth: 1,
    borderColor: "#2ecc7125",
    justifyContent: "center",
    alignItems: "center",
  },

  // Title block
  titleBlock: {
    alignItems: "center",
    gap: 4,
  },
  title: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "900",
    letterSpacing: 6,
    lineHeight: 34,
    textAlign: "center",
  },
  titleAccent: {
    color: ACCENT,
    textShadowColor: "#2ecc7155",
    textShadowRadius: 20,
    textShadowOffset: { width: 0, height: 0 },
  },
  subtitle: {
    color: "#7f8fa4",
    fontSize: 13,
    textAlign: "center",
    lineHeight: 21,
    marginTop: 6,
  },

  // Card
  card: {
    width: "100%",
    backgroundColor: CARD,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: BORDER,
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  cardHeader: {
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
    paddingBottom: 10,
    marginBottom: 4,
  },
  cardHeaderText: {
    color: "#3d4a6b",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 2.5,
  },
  stepConnector: {
    width: 1,
    height: 8,
    backgroundColor: BORDER,
    marginLeft: 11,
  },

  // Tip
  tipCard: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 14,
    borderRadius: 14,
    backgroundColor: "#f1c40f0d",
    borderWidth: 1,
    borderColor: "#f1c40f25",
  },
  tipText: {
    color: GOLD,
    fontSize: 13,
    fontWeight: "700",
    flex: 1,
  },

  // Button
  btnWrapper: {
    width: "100%",
    marginTop: 4,
  },
  btn: {
    width: "100%",
    height: 58,
    borderRadius: 16,
    backgroundColor: RED,
    borderWidth: 1.5,
    borderColor: "#ff6b5b",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
    shadowColor: RED,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 14,
    elevation: 10,
  },
  btnPressed: {
    transform: [{ translateY: 3 }],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
  },
  btnShadow: {
    position: "absolute",
    bottom: -4,
    left: 4,
    right: 4,
    height: 58,
    borderRadius: 16,
    backgroundColor: "#8b1a11",
    zIndex: 0,
  },
  btnText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "900",
    letterSpacing: 3,
  },
});
