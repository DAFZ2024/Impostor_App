import React, { useState } from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import Animated, { FadeInDown, FadeInUp, ZoomIn } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { useGame } from '@/context/GameContext';
import TimerCircle from '@/components/TimerCircle';
import {
  ChatIcon,
  EyeIcon,
  UserIcon,
  VoteIcon,
  LightbulbIcon,
} from '@/components/Icons';

export default function DiscussionScreen() {
  const router = useRouter();
  const { state, setPhase } = useGame();
  const [timerDone, setTimerDone] = useState(false);

  const handleTimerComplete = () => setTimerDone(true);

  const handleGoToVoting = () => {
    setPhase('voting');
    router.replace('/voting');
  };

  return (
    <View style={styles.container}>
      {/* Nebulosas */}
      <View style={styles.nebula1} />
      <View style={styles.nebula2} />

      {/* Header */}
      <Animated.View entering={FadeInDown.duration(400)} style={styles.headerBlock}>
        <View style={styles.headerIconCircle}>
          <ChatIcon size={22} color="#00ffff" />
        </View>
        <Text style={styles.title}>DISCUSIÓN</Text>
        <View style={styles.titleLine} />
        <Text style={styles.subtitle}>
          Discutan entre todos y descubran al impostor
        </Text>
      </Animated.View>

      {/* Reglas rápidas */}
      <Animated.View entering={FadeInDown.delay(150).duration(400)} style={styles.rulesContainer}>
        <View style={styles.ruleRow}>
          <View style={[styles.ruleIcon, { backgroundColor: '#00ffff10' }]}>
            <ChatIcon size={16} color="#00ffff" />
          </View>
          <Text style={styles.ruleText}>Describan la palabra sin decirla directamente</Text>
        </View>
        <View style={styles.ruleDivider} />
        <View style={styles.ruleRow}>
          <View style={[styles.ruleIcon, { backgroundColor: '#f1c40f10' }]}>
            <EyeIcon size={16} color="#f1c40f" />
          </View>
          <Text style={styles.ruleText}>Observen quién actúa sospechoso</Text>
        </View>
        <View style={styles.ruleDivider} />
        <View style={styles.ruleRow}>
          <View style={[styles.ruleIcon, { backgroundColor: '#e74c3c10' }]}>
            <UserIcon size={16} color="#e74c3c" />
          </View>
          <Text style={styles.ruleText}>Hagan preguntas para exponer al impostor</Text>
        </View>
      </Animated.View>

      {/* Timer */}
      <Animated.View entering={ZoomIn.delay(300).duration(500)} style={styles.timerSection}>
        <TimerCircle
          totalSeconds={state.discussionTime}
          onComplete={handleTimerComplete}
          size={200}
          strokeWidth={6}
          color={timerDone ? '#e74c3c' : '#00ffff'}
        />
      </Animated.View>

      {/* Mensaje de tiempo agotado */}
      {timerDone && (
        <Animated.View entering={ZoomIn.duration(300)} style={styles.timeUpBadge}>
          <Text style={styles.timeUpText}>¡TIEMPO AGOTADO!</Text>
        </Animated.View>
      )}

      {/* Tip */}
      {!timerDone && (
        <Animated.View entering={FadeInUp.delay(400).duration(400)} style={styles.tipBox}>
          <LightbulbIcon size={16} color="#f1c40f" />
          <Text style={styles.tipText}>
            Pueden votar antes si todos están listos
          </Text>
        </Animated.View>
      )}

      {/* Botón votar */}
      <Animated.View entering={FadeInUp.delay(500).duration(400)} style={styles.voteSection}>
        <Pressable
          onPress={handleGoToVoting}
          style={({ pressed }) => [
            styles.voteButton,
            timerDone && styles.voteButtonUrgent,
            pressed && styles.btnPressed,
          ]}
        >
          <VoteIcon size={20} color="#fff" />
          <Text style={styles.voteText}>IR A VOTAR</Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050610',
    alignItems: 'center',
    paddingTop: 55,
    paddingHorizontal: 20,
  },

  // ── Nebulosas ──
  nebula1: {
    position: 'absolute',
    top: -60,
    left: -80,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: '#00ffff',
    opacity: 0.03,
  },
  nebula2: {
    position: 'absolute',
    bottom: -100,
    right: -60,
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: '#e74c3c',
    opacity: 0.025,
  },

  // ── Header ──
  headerBlock: {
    alignItems: 'center',
    marginBottom: 18,
  },
  headerIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#00ffff10',
    borderWidth: 1,
    borderColor: '#00ffff20',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    color: '#00ffff',
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: 6,
  },
  titleLine: {
    width: 40,
    height: 2,
    backgroundColor: '#e74c3c',
    marginVertical: 8,
    borderRadius: 1,
  },
  subtitle: {
    color: '#4a5568',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },

  // ── Reglas ──
  rulesContainer: {
    width: '100%',
    backgroundColor: '#0a0b14',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1a1b2e',
    padding: 14,
    marginBottom: 20,
  },
  ruleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 6,
  },
  ruleIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ruleText: {
    color: '#8a95a5',
    fontSize: 12,
    flex: 1,
    fontWeight: '500',
  },
  ruleDivider: {
    height: 1,
    backgroundColor: '#1a1b2e',
    marginVertical: 4,
  },

  // ── Timer ──
  timerSection: {
    marginBottom: 15,
  },

  // ── Time Up ──
  timeUpBadge: {
    backgroundColor: '#e74c3c15',
    borderWidth: 1,
    borderColor: '#e74c3c40',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginBottom: 10,
  },
  timeUpText: {
    color: '#e74c3c',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 3,
  },

  // ── Tip ──
  tipBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#f1c40f08',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginBottom: 10,
  },
  tipText: {
    color: '#666',
    fontSize: 12,
    fontWeight: '600',
  },

  // ── Botón votar ──
  voteSection: {
    width: '100%',
    marginTop: 'auto',
    marginBottom: 30,
  },
  voteButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    width: '100%',
    height: 56,
    borderRadius: 16,
    backgroundColor: '#3498db',
    shadowColor: '#3498db',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  voteButtonUrgent: {
    backgroundColor: '#e74c3c',
    shadowColor: '#e74c3c',
  },
  voteText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '900',
    letterSpacing: 3,
  },
  btnPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.97 }],
  },
});
