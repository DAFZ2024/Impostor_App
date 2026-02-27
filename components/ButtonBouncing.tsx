import React from 'react';
import { Pressable, Text, StyleSheet, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

type ButtonProps = {
  title: string;
  onPress: () => void;
  color?: string;
  shadowColor?: string;
};

export default function ButtonBouncing({
  title,
  onPress,
  color = '#e74c3c', // Rojo por defecto
  shadowColor = '#c0392b',
}: ButtonProps) {
  const scale = useSharedValue(1);
  const translateY = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }, { translateY: translateY.value }],
    };
  });

  const handlePressIn = () => {
    scale.value = withSpring(0.95);
    translateY.value = withSpring(4); // Simula que el botón se hunde
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
    translateY.value = withSpring(0);
  };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={styles.container}
    >
      <View style={[styles.shadow, { backgroundColor: shadowColor }]} />
      <Animated.View
        style={[styles.button, { backgroundColor: color }, animatedStyle]}
      >
        <Text style={styles.text}>{title}</Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    width: 250,
    height: 60,
  },
  shadow: {
    position: 'absolute',
    top: 6,
    left: 0,
    right: 0,
    bottom: -6,
    borderRadius: 15,
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#000',
  },
  text: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});
