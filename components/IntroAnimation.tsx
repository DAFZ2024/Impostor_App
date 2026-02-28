import React, { useEffect } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import Animated, {
    Easing,
    FadeIn,
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming
} from "react-native-reanimated";
import { AlienIcon } from "./Icons";

const { width, height } = Dimensions.get("window");

interface IntroAnimationProps {
  onFinish: () => void;
}

export default function IntroAnimation({ onFinish }: IntroAnimationProps) {
  // Shared values
  const logoScale = useSharedValue(0.2);
  const logoOpacity = useSharedValue(0);
  const logoY = useSharedValue(50);

  const textOpacity = useSharedValue(0);
  const textScale = useSharedValue(0.9);
  const textY = useSharedValue(20);

  const containerOpacity = useSharedValue(1);

  // Background glow
  const glowScale = useSharedValue(0.5);
  const glowOpacity = useSharedValue(0);

  useEffect(() => {
    // 1. Initial glow expansion
    glowOpacity.value = withTiming(0.4, {
      duration: 800,
      easing: Easing.out(Easing.ease),
    });
    glowScale.value = withTiming(2, {
      duration: 1200,
      easing: Easing.out(Easing.ease),
    });

    // 2. Logo appears with a spring
    logoOpacity.value = withTiming(1, { duration: 600 });
    logoScale.value = withSpring(1.2, { damping: 12, stiffness: 90 });
    logoY.value = withSpring(0, { damping: 12, stiffness: 90 });

    // 3. Logo settles and text appears
    setTimeout(() => {
      logoScale.value = withSpring(1, { damping: 15, stiffness: 100 });

      textOpacity.value = withTiming(1, { duration: 600 });
      textScale.value = withSpring(1, { damping: 12, stiffness: 90 });
      textY.value = withSpring(0, { damping: 12, stiffness: 90 });
    }, 600);

    // 4. Fade everything out and finish
    setTimeout(() => {
      containerOpacity.value = withTiming(
        0,
        { duration: 400, easing: Easing.inOut(Easing.ease) },
        () => {
          runOnJS(onFinish)();
        },
      );
    }, 2400);
  }, []);

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }, { translateY: logoY.value }],
  }));

  const textAnimatedStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [{ scale: textScale.value }, { translateY: textY.value }],
  }));

  const containerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: containerOpacity.value,
  }));

  const glowAnimatedStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
    transform: [{ scale: glowScale.value }],
  }));

  return (
    <Animated.View style={[styles.container, containerAnimatedStyle]}>
      {/* Background stars / dust */}
      <View style={styles.starsContainer}>
        {Array.from({ length: 20 }).map((_, i) => (
          <Animated.View
            key={`star-${i}`}
            entering={FadeIn.delay(Math.random() * 1000).duration(1000)}
            style={[
              styles.star,
              {
                left: Math.random() * width,
                top: Math.random() * height,
                width: Math.random() * 3 + 1,
                height: Math.random() * 3 + 1,
                opacity: Math.random() * 0.5 + 0.1,
              },
            ]}
          />
        ))}
      </View>

      {/* Main content wrapper */}
      <View style={styles.content}>
        {/* Glow effect behind logo */}
        <Animated.View style={[styles.glow, glowAnimatedStyle]} />

        {/* Outer orbital rings */}
        <Animated.View style={[styles.ring, styles.ring1, logoAnimatedStyle]} />
        <Animated.View style={[styles.ring, styles.ring2, logoAnimatedStyle]} />

        {/* Logo */}
        <Animated.View style={[styles.logoContainer, logoAnimatedStyle]}>
          <AlienIcon size={100} color="#e74c3c" />
        </Animated.View>

        {/* App Title */}
        <Animated.View style={[styles.textContainer, textAnimatedStyle]}>
          <Text style={styles.theText}>THE</Text>
          <Text style={styles.titleText}>IMPOSTOR</Text>
        </Animated.View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#050610",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999, // Ensure it sits on top
  },
  starsContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  star: {
    position: "absolute",
    backgroundColor: "#fff",
    borderRadius: 10,
  },
  content: {
    alignItems: "center",
    justifyContent: "center",
  },
  glow: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "#e74c3c",
    opacity: 0.2,
    top: "50%",
    marginTop: -150, // visually center with logo
  },
  ring: {
    position: "absolute",
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#e74c3c30",
    top: "50%",
  },
  ring1: {
    width: 180,
    height: 180,
    marginTop: -140, // 50px offset + half height
  },
  ring2: {
    width: 240,
    height: 240,
    marginTop: -170, // 50px offset + half height
    borderStyle: "dashed",
    borderColor: "#e74c3c15",
  },
  logoContainer: {
    width: 140,
    height: 140,
    borderRadius: 35,
    backgroundColor: "#0a0b14",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#e74c3c40",
    shadowColor: "#e74c3c",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 20,
    marginBottom: 40,
  },
  textContainer: {
    alignItems: "center",
  },
  theText: {
    color: "#e74c3c",
    fontSize: 16,
    fontWeight: "900",
    letterSpacing: 10,
    marginBottom: -5,
    opacity: 0.8,
  },
  titleText: {
    color: "#fff",
    fontSize: 42,
    fontWeight: "900",
    letterSpacing: 8,
    textShadowColor: "rgba(231, 76, 60, 0.4)",
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 15,
  },
});
