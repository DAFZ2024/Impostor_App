import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

type TimerCircleProps = {
  totalSeconds: number;
  onComplete: () => void;
  size?: number;
  strokeWidth?: number;
  color?: string;
};

export default function TimerCircle({
  totalSeconds,
  onComplete,
  size = 200,
  strokeWidth = 10,
  color = '#00ffff',
}: TimerCircleProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const progress = useSharedValue(1);
  const displaySeconds = useSharedValue(totalSeconds);

  useEffect(() => {
    progress.value = withTiming(0, {
      duration: totalSeconds * 1000,
      easing: Easing.linear,
    });

    // Countdown
    const interval = setInterval(() => {
      displaySeconds.value = displaySeconds.value - 1;
      if (displaySeconds.value <= 0) {
        clearInterval(interval);
        runOnJS(onComplete)();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [totalSeconds]);

  const animatedProps = useAnimatedProps(() => {
    return {
      strokeDashoffset: circumference * (1 - progress.value),
    };
  });

  // Use a React state for the display since we need to re-render text
  const [seconds, setSeconds] = React.useState(totalSeconds);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [totalSeconds]);

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <Svg width={size} height={size}>
        {/* Background circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#333"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Animated progress circle */}
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          animatedProps={animatedProps}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <View style={[styles.textContainer, { width: size, height: size }]}>
        <Text style={[styles.time, { color }]}>{formatTime(seconds)}</Text>
        <Text style={styles.label}>DISCUSIÓN</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  time: {
    fontSize: 48,
    fontWeight: '900',
    letterSpacing: 2,
  },
  label: {
    color: '#888',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 4,
    marginTop: 5,
  },
});
