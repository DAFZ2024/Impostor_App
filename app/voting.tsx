import React, { useState } from 'react';
import { StyleSheet, View, Text, Pressable, ScrollView, Alert } from 'react-native';
import Animated, { FadeIn, FadeInDown, FadeInUp, ZoomIn } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { useGame } from '@/context/GameContext';
import { VoteIcon, UserIcon, CheckIcon } from '@/components/Icons';

const PLAYER_COLORS = [
  '#e74c3c', '#3498db', '#2ecc71', '#f1c40f', '#9b59b6',
  '#e67e22', '#1abc9c', '#e91e63', '#00bcd4', '#ff5722',
];

export default function VotingScreen() {
  const router = useRouter();
  const { state, castVote, calculateResults } = useGame();
  const [currentVoterIndex, setCurrentVoterIndex] = useState(0);
  const [selectedTarget, setSelectedTarget] = useState<number | null>(null);
  const [showVoterScreen, setShowVoterScreen] = useState(true);

  const currentVoter = state.players[currentVoterIndex];
  const isLastVoter = currentVoterIndex >= state.players.length - 1;

  if (!currentVoter) return null;

  const voterColor = PLAYER_COLORS[currentVoterIndex % PLAYER_COLORS.length];
  const progress = ((currentVoterIndex + 1) / state.players.length) * 100;

  const handleSelectTarget = (targetId: number) => {
    if (targetId === currentVoter.id) {
      Alert.alert('¡Error!', 'No puedes votar por ti mismo.');
      return;
    }
    setSelectedTarget(targetId);
  };

  const handleConfirmVote = () => {
    if (selectedTarget === null) {
      Alert.alert('Selecciona', 'Debes votar por alguien.');
      return;
    }
    castVote(currentVoter.id, selectedTarget);
    if (isLastVoter) {
      setTimeout(() => {
        calculateResults();
        router.replace('/results');
      }, 300);
    } else {
      setCurrentVoterIndex((prev) => prev + 1);
      setSelectedTarget(null);
      setShowVoterScreen(true);
    }
  };

  // ── Pantalla de pasar teléfono ──
  if (showVoterScreen) {
    return (
      <View style={styles.container}>
        <View style={styles.nebula1} />
        <View style={[styles.nebula2, { backgroundColor: voterColor }]} />

        {/* Progreso */}
        <Animated.View entering={FadeInDown.duration(300)} style={styles.progressSection}>
          <Text style={styles.progressLabel}>{currentVoterIndex + 1} / {state.players.length}</Text>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progress}%`, backgroundColor: voterColor }]} />
          </View>
        </Animated.View>

        {/* Header */}
        <Animated.View entering={FadeInDown.delay(100).duration(400)} style={styles.passHeader}>
          <View style={styles.passIconCircle}>
            <VoteIcon size={24} color="#f1c40f" />
          </View>
          <Text style={styles.passTitle}>VOTACIÓN</Text>
          <View style={styles.titleLine} />
        </Animated.View>

        <Animated.Text entering={FadeIn.delay(200)} style={styles.passInstruction}>
          PASA EL TELÉFONO A
        </Animated.Text>

        {/* Tarjeta del votante */}
        <Animated.View
          entering={ZoomIn.delay(300).duration(400)}
          style={[styles.voterCard, { borderColor: voterColor }]}
        >
          <View style={[styles.voterAvatar, { backgroundColor: voterColor + '20', borderColor: voterColor }]}>
            <UserIcon size={36} color={voterColor} />
          </View>
          <Text style={[styles.voterName, { color: voterColor }]}>{currentVoter.name}</Text>
        </Animated.View>

        {/* Botón listo */}
        <Animated.View entering={FadeInUp.delay(400).duration(400)} style={styles.readySection}>
          <Pressable
            onPress={() => setShowVoterScreen(false)}
            style={({ pressed }) => [
              styles.readyButton,
              { backgroundColor: voterColor },
              pressed && styles.btnPressed,
            ]}
          >
            <Text style={styles.readyText}>ESTOY LISTO</Text>
          </Pressable>
        </Animated.View>
      </View>
    );
  }

  // ── Pantalla de votación ──
  return (
    <View style={styles.container}>
      <View style={styles.nebula1} />
      <View style={[styles.nebula2, { backgroundColor: voterColor }]} />

      {/* Header */}
      <Animated.View entering={FadeInDown.duration(300)} style={styles.voteHeader}>
        <View style={[styles.voteHeaderIcon, { backgroundColor: voterColor + '15', borderColor: voterColor + '30' }]}>
          <VoteIcon size={18} color={voterColor} />
        </View>
        <View style={styles.voteHeaderInfo}>
          <Text style={styles.voteHeaderTitle}>VOTACIÓN</Text>
          <Text style={[styles.voteHeaderSub, { color: voterColor }]}>{currentVoter.name}</Text>
        </View>
      </Animated.View>

      <Animated.Text entering={FadeIn.delay(100)} style={styles.voteQuestion}>
        ¿Quién crees que es el impostor?
      </Animated.Text>

      {/* Lista de jugadores */}
      <ScrollView style={styles.list} contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
        {state.players.map((player, index) => {
          if (player.id === currentVoter.id) return null;
          const pColor = PLAYER_COLORS[index % PLAYER_COLORS.length];
          const isSelected = selectedTarget === player.id;

          return (
            <Animated.View
              key={player.id}
              entering={FadeInDown.delay(index * 60).duration(300)}
            >
              <Pressable
                onPress={() => handleSelectTarget(player.id)}
                style={[
                  styles.voteCard,
                  { borderColor: isSelected ? pColor : '#1a1b2e' },
                  isSelected && { backgroundColor: pColor + '10' },
                ]}
              >
                <View style={[styles.voteAvatar, { backgroundColor: pColor + '20', borderColor: pColor }]}>
                  <UserIcon size={18} color={pColor} />
                </View>
                <Text style={[styles.voteName, isSelected && { color: pColor }]}>
                  {player.name}
                </Text>
                {isSelected && (
                  <View style={[styles.selectedBadge, { backgroundColor: pColor + '20' }]}>
                    <CheckIcon size={16} color={pColor} />
                  </View>
                )}
              </Pressable>
            </Animated.View>
          );
        })}
      </ScrollView>

      {/* Botón confirmar */}
      <Animated.View entering={FadeInUp.delay(200).duration(400)} style={styles.confirmSection}>
        <Pressable
          onPress={handleConfirmVote}
          style={({ pressed }) => [
            styles.confirmButton,
            !selectedTarget && styles.confirmDisabled,
            pressed && selectedTarget && styles.btnPressed,
          ]}
        >
          <CheckIcon size={20} color="#fff" />
          <Text style={styles.confirmText}>CONFIRMAR VOTO</Text>
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
    top: -80,
    left: -60,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: '#f1c40f',
    opacity: 0.025,
  },
  nebula2: {
    position: 'absolute',
    bottom: -100,
    right: -70,
    width: 300,
    height: 300,
    borderRadius: 150,
    opacity: 0.03,
  },

  // ── Progreso ──
  progressSection: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 24,
  },
  progressLabel: {
    color: '#555',
    fontSize: 13,
    fontWeight: '700',
    minWidth: 35,
  },
  progressTrack: {
    flex: 1,
    height: 4,
    backgroundColor: '#1a1b2e',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },

  // ── Pass screen ──
  passHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  passIconCircle: {
    width: 50,
    height: 50,
    borderRadius: 16,
    backgroundColor: '#f1c40f10',
    borderWidth: 1,
    borderColor: '#f1c40f20',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  passTitle: {
    color: '#f1c40f',
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: 6,
  },
  titleLine: {
    width: 40,
    height: 2,
    backgroundColor: '#e74c3c',
    marginTop: 8,
    borderRadius: 1,
  },
  passInstruction: {
    color: '#4a5568',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 4,
    marginBottom: 20,
  },

  // ── Voter card ──
  voterCard: {
    borderWidth: 2,
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    width: '75%',
    backgroundColor: '#0a0b14',
    marginBottom: 30,
  },
  voterAvatar: {
    width: 70,
    height: 70,
    borderRadius: 22,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  voterName: {
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: 1,
  },

  // ── Ready button ──
  readySection: {
    width: '100%',
    marginTop: 'auto',
    marginBottom: 30,
  },
  readyButton: {
    width: '100%',
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  readyText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '900',
    letterSpacing: 3,
  },

  // ── Vote header ──
  voteHeader: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
  },
  voteHeaderIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  voteHeaderInfo: {
    flex: 1,
  },
  voteHeaderTitle: {
    color: '#f1c40f',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 3,
  },
  voteHeaderSub: {
    fontSize: 18,
    fontWeight: '900',
    marginTop: 2,
  },
  voteQuestion: {
    color: '#6a7a8a',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 16,
  },

  // ── Vote cards ──
  list: {
    width: '100%',
    flex: 1,
  },
  listContent: {
    paddingBottom: 10,
    gap: 8,
  },
  voteCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0a0b14',
    borderRadius: 14,
    borderWidth: 1.5,
    padding: 14,
  },
  voteAvatar: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  voteName: {
    flex: 1,
    color: '#8a95a5',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 12,
  },
  selectedBadge: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // ── Confirm ──
  confirmSection: {
    width: '100%',
    paddingVertical: 18,
  },
  confirmButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    width: '100%',
    height: 56,
    borderRadius: 16,
    backgroundColor: '#e74c3c',
    shadowColor: '#e74c3c',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  confirmDisabled: {
    backgroundColor: '#1a1b2e',
    shadowOpacity: 0,
    elevation: 0,
  },
  confirmText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 3,
  },
  btnPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.97 }],
  },
});
