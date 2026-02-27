import React, { useEffect } from 'react';
import { StyleSheet, View, Text, Dimensions, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  withDelay,
  Easing,
  FadeInUp,
  FadeInDown,
} from 'react-native-reanimated';
import { AlienIcon, GamepadIcon, BookIcon, SettingsIcon } from '@/components/Icons';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');

// Capas de estrellas con distintos tamaños y brillos
const STARS_SMALL = Array.from({ length: 30 }, () => ({
  top: Math.random() * height,
  left: Math.random() * width,
  size: 1 + Math.random() * 1.5,
  opacity: 0.2 + Math.random() * 0.4,
}));
const STARS_LARGE = Array.from({ length: 8 }, () => ({
  top: Math.random() * height,
  left: Math.random() * width,
  size: 2.5 + Math.random() * 2,
  opacity: 0.6 + Math.random() * 0.4,
}));

export default function HomeScreen() {
  const router = useRouter();

  // Animaciones
  const floatAnim = useSharedValue(0);
  const glowAnim = useSharedValue(0.12);
  const rotateAnim = useSharedValue(0);
  const pulseAnim = useSharedValue(1);

  useEffect(() => {
    floatAnim.value = withRepeat(
      withSequence(
        withTiming(-14, { duration: 2200, easing: Easing.inOut(Easing.ease) }),
        withTiming(14, { duration: 2200, easing: Easing.inOut(Easing.ease) })
      ),
      -1, true
    );
    glowAnim.value = withRepeat(
      withSequence(
        withTiming(0.35, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.08, { duration: 2000, easing: Easing.inOut(Easing.ease) })
      ),
      -1, true
    );
    rotateAnim.value = withRepeat(
      withTiming(360, { duration: 20000, easing: Easing.linear }),
      -1, false
    );
    pulseAnim.value = withRepeat(
      withSequence(
        withTiming(1.06, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 1200, easing: Easing.inOut(Easing.ease) })
      ),
      -1, true
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

  return (
    <View style={styles.container}>
      {/* Nebulosa de fondo */}
      <View style={styles.nebula1} />
      <View style={styles.nebula2} />

      {/* Estrellas pequeñas */}
      {STARS_SMALL.map((s, i) => (
        <View key={`s${i}`} style={[styles.star, {
          top: s.top, left: s.left, width: s.size, height: s.size,
          opacity: s.opacity, borderRadius: s.size,
        }]} />
      ))}
      {/* Estrellas grandes con brillo */}
      {STARS_LARGE.map((s, i) => (
        <View key={`l${i}`} style={[styles.starBright, {
          top: s.top, left: s.left, width: s.size, height: s.size,
          borderRadius: s.size,
        }]} />
      ))}

      {/* Título */}
      <Animated.View entering={FadeInDown.delay(100).duration(700)} style={styles.titleBlock}>
        <Animated.Text style={[styles.title, floatingStyle]}>
          IMPOSTOR
        </Animated.Text>
        <View style={styles.titleDivider} />
        <Text style={styles.subtitle}>ENCUENTRA AL TRAIDOR</Text>
      </Animated.View>

      {/* Personaje central con anillos orbitales */}
      <Animated.View
        entering={FadeInUp.delay(300).duration(700)}
        style={styles.characterSection}
      >
        {/* Anillo orbital */}
        <Animated.View style={[styles.orbitRing, orbitStyle]}>
          <View style={styles.orbitDot} />
        </Animated.View>
        <Animated.View style={[styles.orbitRing2, orbitStyle]}>
          <View style={[styles.orbitDot, { backgroundColor: '#00ffff' }]} />
        </Animated.View>

        {/* Glow */}
        <Animated.View style={[styles.characterGlow, glowStyle]} />

        {/* Personaje */}
        <Animated.View style={[styles.characterInner, floatingStyle]}>
          <AlienIcon size={90} color="#e74c3c" />
        </Animated.View>

        {/* Sombra */}
        <View style={styles.characterShadow} />
      </Animated.View>

      {/* Botones mejorados */}
      <Animated.View
        entering={FadeInUp.delay(500).duration(600)}
        style={styles.buttonsContainer}
      >
        <Animated.View style={btnPulseStyle}>
          <Pressable
            onPress={() => router.push('/setup')}
            style={({ pressed }) => [styles.mainButton, pressed && styles.btnPressed]}
          >
            <View style={styles.mainBtnGlow} />
            <GamepadIcon size={22} color="#fff" />
            <Text style={styles.mainBtnText}>JUGAR</Text>
          </Pressable>
        </Animated.View>

        <View style={styles.secondaryRow}>
          <Pressable
            onPress={() => router.push('/rules')}
            style={({ pressed }) => [styles.secondaryButton, pressed && styles.btnPressed]}
          >
            <BookIcon size={18} color="#00ffff" />
            <Text style={styles.secondaryBtnText}>REGLAS</Text>
          </Pressable>

          <Pressable
            onPress={() => router.push('/setup')}
            style={({ pressed }) => [styles.secondaryButton, styles.secondaryButtonAlt, pressed && styles.btnPressed]}
          >
            <SettingsIcon size={18} color="#f1c40f" />
            <Text style={[styles.secondaryBtnText, { color: '#f1c40f' }]}>AJUSTES</Text>
          </Pressable>
        </View>
      </Animated.View>

      {/* Footer */}
      <Animated.View entering={FadeInUp.delay(700).duration(400)} style={styles.footerContainer}>
        <View style={styles.footerLine} />
        <Text style={styles.footer}>v1.0 · Hecho  por Andres Forero</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050610',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── Nebulosas ──
  nebula1: {
    position: 'absolute',
    top: -80,
    right: -60,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: '#e74c3c',
    opacity: 0.04,
  },
  nebula2: {
    position: 'absolute',
    bottom: -100,
    left: -80,
    width: 350,
    height: 350,
    borderRadius: 175,
    backgroundColor: '#00ffff',
    opacity: 0.03,
  },

  // ── Estrellas ──
  star: {
    position: 'absolute',
    backgroundColor: '#ccd6e0',
  },
  starBright: {
    position: 'absolute',
    backgroundColor: '#fff',
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 2,
  },

  // ── Título ──
  titleBlock: {
    alignItems: 'center',
    marginBottom: 5,
  },
  title: {
    fontSize: 48,
    fontWeight: '900',
    color: '#00ffff',
    textShadowColor: '#00cccc',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 25,
    letterSpacing: 10,
  },
  titleDivider: {
    width: 60,
    height: 2,
    backgroundColor: '#e74c3c',
    marginVertical: 10,
    borderRadius: 1,
  },
  subtitle: {
    color: '#4a5568',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 6,
  },

  // ── Personaje ──
  characterSection: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 200,
    height: 200,
    marginVertical: 20,
  },
  orbitRing: {
    position: 'absolute',
    width: 190,
    height: 190,
    borderRadius: 95,
    borderWidth: 1,
    borderColor: '#e74c3c20',
    borderStyle: 'dashed',
  },
  orbitRing2: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 1,
    borderColor: '#00ffff15',
  },
  orbitDot: {
    position: 'absolute',
    top: -4,
    left: '50%',
    marginLeft: -4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#e74c3c',
  },
  characterGlow: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#e74c3c',
  },
  characterInner: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#0a0b14',
    borderWidth: 2,
    borderColor: '#e74c3c40',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#e74c3c',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
  },
  characterShadow: {
    position: 'absolute',
    bottom: 5,
    width: 70,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#000',
    opacity: 0.4,
  },

  // ── Botones ──
  buttonsContainer: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 30,
    marginTop: 15,
  },
  mainButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    width: 260,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#e74c3c',
    borderWidth: 1,
    borderColor: '#ff6b5b',
    shadowColor: '#e74c3c',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 10,
    overflow: 'hidden',
  },
  mainBtnGlow: {
    position: 'absolute',
    top: -20,
    left: '30%',
    width: 100,
    height: 40,
    backgroundColor: '#fff',
    opacity: 0.08,
    borderRadius: 50,
  },
  mainBtnText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 4,
  },
  btnPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.96 }],
  },
  secondaryRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 14,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 22,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#0d0e18',
    borderWidth: 1.5,
    borderColor: '#00ffff30',
  },
  secondaryButtonAlt: {
    borderColor: '#f1c40f30',
  },
  secondaryBtnText: {
    color: '#00ffff',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 2,
  },

  // ── Footer ──
  footerContainer: {
    position: 'absolute',
    bottom: 25,
    alignItems: 'center',
  },
  footerLine: {
    width: 30,
    height: 1,
    backgroundColor: '#222',
    marginBottom: 8,
  },
  footer: {
    color: '#2a2a3a',
    fontSize: 11,
    letterSpacing: 2,
  },
});
