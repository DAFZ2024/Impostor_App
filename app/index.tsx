import {
  AlienIcon,
  BookIcon,
  GamepadIcon,
  GridIcon,
  KnifeIcon,
  ShieldIcon,
  UsersIcon,
  ZapIcon,
} from "@/components/Icons";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { Dimensions, Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  Easing,
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
  ZoomIn,
} from "react-native-reanimated";

const { width, height } = Dimensions.get("window");

// Capas de estrellas
const STARS_SMALL = Array.from({ length: 40 }, () => ({
  top: Math.random() * height,
  left: Math.random() * width,
  size: 1 + Math.random() * 1.2,
  opacity: 0.15 + Math.random() * 0.35,
}));
const STARS_MED = Array.from({ length: 12 }, () => ({
  top: Math.random() * height,
  left: Math.random() * width,
  size: 2 + Math.random() * 1.5,
  opacity: 0.5 + Math.random() * 0.5,
}));

export default function HomeScreen() {
  const router = useRouter();

  const floatAnim = useSharedValue(0);
  const glowAnim = useSharedValue(0.1);
  const rotateAnim = useSharedValue(0);
  const pulseAnim = useSharedValue(1);
  const twinkleAnim = useSharedValue(0.3);

  useEffect(() => {
    floatAnim.value = withRepeat(
      withSequence(
        withTiming(-12, { duration: 2400, easing: Easing.inOut(Easing.ease) }),
        withTiming(12, { duration: 2400, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      true,
    );
    glowAnim.value = withRepeat(
      withSequence(
        withTiming(0.4, { duration: 2200, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.06, { duration: 2200, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      true,
    );
    rotateAnim.value = withRepeat(
      withTiming(360, { duration: 25000, easing: Easing.linear }),
      -1,
      false,
    );
    pulseAnim.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 1400, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 1400, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      true,
    );
    twinkleAnim.value = withRepeat(
      withSequence(
        withDelay(
          500,
          withTiming(1, { duration: 800, easing: Easing.inOut(Easing.ease) }),
        ),
        withTiming(0.3, { duration: 800, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      true,
    );
  }, []);

  const floatingStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: floatAnim.value }],
  }));
  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowAnim.value,
  }));
  const orbitStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotateAnim.value}deg` }],
  }));
  const btnPulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseAnim.value }],
  }));
  const twinkleStyle = useAnimatedStyle(() => ({
    opacity: twinkleAnim.value,
  }));

  return (
    <View style={styles.container}>
      {/* Nebulosas de fondo */}
      <View style={styles.nebula1} />
      <View style={styles.nebula2} />
      <View style={styles.nebula3} />

      {/* Estrellas */}
      {STARS_SMALL.map((s, i) => (
        <View
          key={`s${i}`}
          style={[
            styles.star,
            {
              top: s.top,
              left: s.left,
              width: s.size,
              height: s.size,
              opacity: s.opacity,
              borderRadius: s.size,
            },
          ]}
        />
      ))}
      {STARS_MED.map((s, i) => (
        <View
          key={`m${i}`}
          style={[
            styles.starBright,
            {
              top: s.top,
              left: s.left,
              width: s.size,
              height: s.size,
              borderRadius: s.size,
            },
          ]}
        />
      ))}

      {/* Badge superior */}
      <Animated.View
        entering={FadeInDown.delay(100).duration(600)}
        style={styles.topBadge}
      >
        <View style={styles.topBadgeDot} />
        <Text style={styles.topBadgeText}>JUEGO DE DEDUCCIÓN SOCIAL</Text>
        <View style={styles.topBadgeDot} />
      </Animated.View>

      {/* Título */}
      <Animated.View
        entering={FadeInDown.delay(200).duration(700)}
        style={styles.titleBlock}
      >
        <Text style={styles.titlePre}>THE</Text>
        <Animated.Text style={[styles.title, floatingStyle]}>
          IMPOSTOR
        </Animated.Text>
        <View style={styles.titleAccentRow}>
          <View style={styles.titleLine} />
          <View style={styles.titleDiamond} />
          <View style={styles.titleLine} />
        </View>
        <Text style={styles.subtitle}>ENCUENTRA AL TRAIDOR</Text>
      </Animated.View>

      {/* Personaje central */}
      <Animated.View
        entering={ZoomIn.delay(400).duration(600)}
        style={styles.characterSection}
      >
        {/* Anillo exterior decorativo */}
        <Animated.View style={[styles.orbitRing, orbitStyle]}>
          <View style={styles.orbitDot} />
          <View style={styles.orbitDot2} />
        </Animated.View>
        <Animated.View style={[styles.orbitRing2, orbitStyle]}>
          <View style={styles.orbitDot3} />
        </Animated.View>

        {/* Glow pulsante */}
        <Animated.View style={[styles.characterGlow, glowStyle]} />
        <Animated.View style={[styles.characterGlow2, glowStyle]} />

        {/* Avatar principal */}
        <Animated.View style={[styles.characterOuter, floatingStyle]}>
          <View style={styles.characterInner}>
            <AlienIcon size={70} color="#e74c3c" />
          </View>
        </Animated.View>

        {/* Badges flotantes */}
        <Animated.View
          style={[
            styles.floatingBadge,
            styles.floatingBadgeLeft,
            floatingStyle,
          ]}
        >
          <View style={styles.floatingBadgeInner}>
            <ShieldIcon size={14} color="#2ecc71" />
          </View>
          <Text style={[styles.floatingBadgeLabel, { color: "#2ecc71" }]}>
            CREW
          </Text>
        </Animated.View>
        <Animated.View
          style={[
            styles.floatingBadge,
            styles.floatingBadgeRight,
            floatingStyle,
          ]}
        >
          <View
            style={[
              styles.floatingBadgeInner,
              { backgroundColor: "#e74c3c10", borderColor: "#e74c3c30" },
            ]}
          >
            <KnifeIcon size={14} color="#e74c3c" />
          </View>
          <Text style={[styles.floatingBadgeLabel, { color: "#e74c3c" }]}>
            SUS
          </Text>
        </Animated.View>
      </Animated.View>

      {/* Info cards */}
      <Animated.View
        entering={FadeInUp.delay(550).duration(500)}
        style={styles.infoRow}
      >
        <View style={styles.infoCard}>
          <View
            style={[
              styles.infoIconCircle,
              { backgroundColor: "#3498db10", borderColor: "#3498db25" },
            ]}
          >
            <UsersIcon size={18} color="#3498db" />
          </View>
          <Text style={[styles.infoValue, { color: "#3498db" }]}>3-10</Text>
          <Text style={styles.infoLabel}>Jugadores</Text>
        </View>
        <View style={[styles.infoCard, styles.infoCardMiddle]}>
          <View
            style={[
              styles.infoIconCircle,
              { backgroundColor: "#e74c3c10", borderColor: "#e74c3c25" },
            ]}
          >
            <ZapIcon size={18} color="#e74c3c" />
          </View>
          <Text style={[styles.infoValue, { color: "#e74c3c" }]}>5-15</Text>
          <Text style={styles.infoLabel}>Minutos</Text>
        </View>
        <View style={styles.infoCard}>
          <View
            style={[
              styles.infoIconCircle,
              { backgroundColor: "#9b59b610", borderColor: "#9b59b625" },
            ]}
          >
            <GridIcon size={18} color="#9b59b6" />
          </View>
          <Text style={[styles.infoValue, { color: "#9b59b6" }]}>8</Text>
          <Text style={styles.infoLabel}>Categorías</Text>
        </View>
      </Animated.View>

      {/* Botones */}
      <Animated.View
        entering={FadeInUp.delay(650).duration(600)}
        style={styles.buttonsContainer}
      >
        <Animated.View style={btnPulseStyle}>
          <Pressable
            onPress={() => router.push("/setup")}
            style={({ pressed }) => [
              styles.mainButton,
              pressed && styles.btnPressed,
            ]}
          >
            <View style={styles.mainBtnGlow} />
            <GamepadIcon size={22} color="#fff" />
            <Text style={styles.mainBtnText}>JUGAR</Text>
          </Pressable>
        </Animated.View>

        <Pressable
          onPress={() => router.push("/rules")}
          style={({ pressed }) => [
            styles.rulesButton,
            pressed && styles.btnPressed,
          ]}
        >
          <BookIcon size={18} color="#00ffff" />
          <Text style={styles.rulesBtnText}>CÓMO JUGAR</Text>
        </Pressable>
      </Animated.View>

      {/* Footer */}
      <Animated.View
        entering={FadeInUp.delay(800).duration(400)}
        style={styles.footerContainer}
      >
        <View style={styles.footerLine} />
        <Text style={styles.footer}>v1.0 · Hecho por Andres Forero</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#050610",
    alignItems: "center",
    justifyContent: "center",
  },

  // ── Nebulosas ──
  nebula1: {
    position: "absolute",
    top: -100,
    right: -80,
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: "#e74c3c",
    opacity: 0.035,
  },
  nebula2: {
    position: "absolute",
    bottom: -120,
    left: -100,
    width: 380,
    height: 380,
    borderRadius: 190,
    backgroundColor: "#00ffff",
    opacity: 0.025,
  },
  nebula3: {
    position: "absolute",
    top: "40%",
    left: "50%",
    marginLeft: -100,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "#9b59b6",
    opacity: 0.02,
  },

  // ── Estrellas ──
  star: {
    position: "absolute",
    backgroundColor: "#ccd6e0",
  },
  starBright: {
    position: "absolute",
    backgroundColor: "#fff",
    shadowColor: "#fff",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 2,
  },

  // ── Badge superior ──
  topBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  topBadgeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#e74c3c50",
  },
  topBadgeText: {
    color: "#4a5568",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 4,
  },

  // ── Título ──
  titleBlock: {
    alignItems: "center",
    marginBottom: 8,
  },
  titlePre: {
    color: "#ffffff20",
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 14,
    marginBottom: 4,
  },
  title: {
    fontSize: 46,
    fontWeight: "900",
    color: "#e74c3c",
    textShadowColor: "#e74c3c",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
    letterSpacing: 6,
  },
  titleAccentRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 10,
    marginBottom: 10,
  },
  titleLine: {
    width: 40,
    height: 1,
    backgroundColor: "#e74c3c50",
  },
  titleDiamond: {
    width: 6,
    height: 6,
    backgroundColor: "#e74c3c",
    transform: [{ rotate: "45deg" }],
  },
  subtitle: {
    color: "#4a5568",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 6,
  },

  // ── Personaje ──
  characterSection: {
    alignItems: "center",
    justifyContent: "center",
    width: 220,
    height: 220,
    marginVertical: 10,
  },
  orbitRing: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: "#e74c3c12",
  },
  orbitRing2: {
    position: "absolute",
    width: 165,
    height: 165,
    borderRadius: 83,
    borderWidth: 1,
    borderColor: "#e74c3c08",
    borderStyle: "dashed",
  },
  orbitDot: {
    position: "absolute",
    top: -3,
    left: "50%",
    marginLeft: -3,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#e74c3c",
    shadowColor: "#e74c3c",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 3,
  },
  orbitDot2: {
    position: "absolute",
    bottom: -3,
    left: "50%",
    marginLeft: -2,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#e74c3c60",
  },
  orbitDot3: {
    position: "absolute",
    right: -2,
    top: "50%",
    marginTop: -2,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#e74c3c40",
  },
  characterGlow: {
    position: "absolute",
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "#e74c3c",
  },
  characterGlow2: {
    position: "absolute",
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "#e74c3c",
  },
  characterOuter: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#0c0d16",
    borderWidth: 2,
    borderColor: "#e74c3c20",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#e74c3c",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 25,
    elevation: 12,
  },
  characterInner: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#0a0b14",
    borderWidth: 1,
    borderColor: "#e74c3c15",
    justifyContent: "center",
    alignItems: "center",
  },
  floatingBadge: {
    position: "absolute",
    alignItems: "center",
    gap: 4,
  },
  floatingBadgeInner: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: "#2ecc7108",
    borderWidth: 1,
    borderColor: "#2ecc7125",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 6,
  },
  floatingBadgeLabel: {
    fontSize: 7,
    fontWeight: "900",
    letterSpacing: 2,
  },
  floatingBadgeLeft: {
    left: 0,
    top: 55,
  },
  floatingBadgeRight: {
    right: 0,
    top: 55,
  },

  // ── Info cards ──
  infoRow: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  infoCard: {
    flex: 1,
    backgroundColor: "#0a0b14",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#1a1b2e",
    paddingVertical: 14,
    alignItems: "center",
    gap: 6,
  },
  infoCardMiddle: {
    borderColor: "#e74c3c15",
    backgroundColor: "#0c0d18",
  },
  infoIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  infoValue: {
    fontSize: 20,
    fontWeight: "900",
  },
  infoLabel: {
    color: "#4a5568",
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 2,
    textTransform: "uppercase",
  },

  // ── Botones ──
  buttonsContainer: {
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  mainButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    width: 280,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#e74c3c",
    borderWidth: 1,
    borderColor: "#ff6b5b",
    shadowColor: "#e74c3c",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 14,
    elevation: 12,
    overflow: "hidden",
  },
  mainBtnGlow: {
    position: "absolute",
    top: -20,
    left: "25%",
    width: 120,
    height: 40,
    backgroundColor: "#fff",
    opacity: 0.08,
    borderRadius: 50,
  },
  mainBtnText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "900",
    letterSpacing: 5,
  },
  btnPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.96 }],
  },
  rulesButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    width: 280,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#0d0e18",
    borderWidth: 1.5,
    borderColor: "#00ffff20",
    marginTop: 12,
  },
  rulesBtnText: {
    color: "#00ffff",
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 3,
  },

  // ── Footer ──
  footerContainer: {
    position: "absolute",
    bottom: 22,
    alignItems: "center",
  },
  footerLine: {
    width: 30,
    height: 1,
    backgroundColor: "#1a1b2e",
    marginBottom: 8,
  },
  footer: {
    color: "#2a2a3a",
    fontSize: 10,
    letterSpacing: 2,
  },
});
