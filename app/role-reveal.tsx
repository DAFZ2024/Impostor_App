import React, { useState } from 'react';
import { StyleSheet, View, Text, Pressable, Dimensions } from 'react-native';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  ZoomIn,
} from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { useGame } from '@/context/GameContext';
import {
  EyeOffIcon,
  KnifeIcon,
  ShieldIcon,
  ArrowLeftIcon,
  UserIcon,
  LightbulbIcon,
} from '@/components/Icons';

const { width } = Dimensions.get('window');

const PLAYER_COLORS = [
  '#e74c3c', '#3498db', '#2ecc71', '#f1c40f', '#9b59b6',
  '#e67e22', '#1abc9c', '#e91e63', '#00bcd4', '#ff5722',
];

export default function RoleRevealScreen() {
  const router = useRouter();
  const { state, nextReveal, setPhase } = useGame();
  const [revealed, setRevealed] = useState(false);

  const currentPlayer = state.players[state.currentRevealIndex];
  const isImpostor = currentPlayer?.isImpostor;
  const isLast = state.currentRevealIndex >= state.players.length - 1;
  const color = PLAYER_COLORS[state.currentRevealIndex % PLAYER_COLORS.length];
  const progress = ((state.currentRevealIndex + 1) / state.players.length) * 100;

  const handleReveal = () => setRevealed(true);

  const handleNext = () => {
    setRevealed(false);
    if (isLast) {
      setPhase('discussion');
      router.replace('/discussion');
    } else {
      nextReveal();
    }
  };

  if (!currentPlayer) return null;

  return (
    <View style={styles.container}>
      {/* Nebulosas */}
      <View style={[styles.nebula, { top: -60, right: -40, backgroundColor: color }]} />
      <View style={styles.nebula2} />

      {/* Barra de progreso */}
      <View style={styles.progressSection}>
        <Text style={styles.progressLabel}>
          {state.currentRevealIndex + 1} / {state.players.length}
        </Text>
        <View style={styles.progressTrack}>
          <Animated.View style={[styles.progressFill, { width: `${progress}%`, backgroundColor: color }]} />
        </View>
      </View>

      {/* Instrucción */}
      <Animated.Text
        key={`inst-${state.currentRevealIndex}-${revealed}`}
        entering={FadeIn.duration(300)}
        style={styles.instruction}
      >
        {revealed ? 'MEMORIZA TU ROL' : 'PASA EL TELÉFONO A'}
      </Animated.Text>

      {/* Nombre del jugador */}
      <Animated.View
        key={`name-${state.currentRevealIndex}`}
        entering={FadeInDown.duration(400)}
        style={[styles.nameCard, { borderColor: color }]}
      >
        <View style={[styles.nameAvatar, { backgroundColor: color + '20', borderColor: color }]}>
          <UserIcon size={20} color={color} />
        </View>
        <Text style={[styles.playerName, { color }]}>{currentPlayer.name}</Text>
      </Animated.View>

      {/* ── Carta oculta ── */}
      {!revealed ? (
        <Pressable onPress={handleReveal} style={styles.hiddenCard}>
          <View style={styles.hiddenCardInner}>
            {/* Patrón decorativo */}
            <View style={styles.patternRow}>
              {[...Array(5)].map((_, i) => (
                <View key={i} style={[styles.patternDot, { opacity: 0.08 + i * 0.04 }]} />
              ))}
            </View>

            <View style={styles.eyeCircle}>
              <EyeOffIcon size={50} color="#444" />
            </View>

            <Text style={styles.tapText}>TOCA PARA REVELAR</Text>
            <Text style={styles.tapSubtext}>
              Solo tú debes ver esta pantalla
            </Text>

            {/* Borde pulsante simulado */}
            <View style={[styles.cornerTL, { borderColor: color + '40' }]} />
            <View style={[styles.cornerBR, { borderColor: color + '40' }]} />
          </View>
        </Pressable>
      ) : (
        /* ── Carta revelada ── */
        <Animated.View
          entering={ZoomIn.duration(350)}
          style={[
            styles.revealedCard,
            isImpostor ? styles.cardImpostor : styles.cardCrew,
          ]}
        >
          {/* Icono principal */}
          <View style={[styles.roleIconCircle, {
            backgroundColor: isImpostor ? '#e74c3c15' : '#2ecc7115',
          }]}>
            {isImpostor
              ? <KnifeIcon size={44} color="#e74c3c" />
              : <ShieldIcon size={44} color="#2ecc71" />
            }
          </View>

          {/* Título del rol */}
          <Text style={[styles.roleTitle, { color: isImpostor ? '#e74c3c' : '#2ecc71' }]}>
            {isImpostor ? '¡IMPOSTOR!' : 'TRIPULANTE'}
          </Text>

          {/* Descripción */}
          <Text style={styles.roleDescription}>
            {isImpostor
              ? 'No conoces la palabra secreta.\nPero tienes una pista...'
              : 'La palabra secreta es:'
            }
          </Text>

          {/* Palabra */}
          <View style={[styles.wordBadge, {
            borderColor: isImpostor ? '#e74c3c50' : '#2ecc7150',
            backgroundColor: isImpostor ? '#e74c3c08' : '#2ecc7108',
          }]}>
            <Text style={[styles.wordText, {
              color: isImpostor ? '#e74c3c' : '#2ecc71',
            }]}>
              {isImpostor ? '???' : currentPlayer.word}
            </Text>
          </View>

          {/* Pista para el impostor */}
          {isImpostor && (
            <View style={styles.hintBox}>
              <LightbulbIcon size={16} color="#f1c40f" />
              <Text style={styles.hintText}>{state.impostorHint}</Text>
            </View>
          )}
        </Animated.View>
      )}

      {/* ── Botón siguiente ── */}
      {revealed && (
        <Animated.View entering={FadeInUp.delay(200).duration(400)} style={styles.nextSection}>
          <Pressable
            onPress={handleNext}
            style={({ pressed }) => [
              styles.nextButton,
              { backgroundColor: isLast ? '#e74c3c' : '#3498db' },
              pressed && styles.btnPressed,
            ]}
          >
            <Text style={styles.nextText}>
              {isLast ? 'EMPEZAR DISCUSIÓN' : 'SIGUIENTE JUGADOR'}
            </Text>
          </Pressable>
        </Animated.View>
      )}
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
  nebula: {
    position: 'absolute',
    width: 250,
    height: 250,
    borderRadius: 125,
    opacity: 0.04,
  },
  nebula2: {
    position: 'absolute',
    bottom: -80,
    left: -60,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: '#00ffff',
    opacity: 0.025,
  },

  // ── Progreso ──
  progressSection: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 30,
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

  // ── Instrucción ──
  instruction: {
    color: '#4a5568',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 4,
    marginBottom: 12,
  },

  // ── Nombre ──
  nameCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1.5,
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 10,
    marginBottom: 25,
    backgroundColor: '#0d0e18',
  },
  nameAvatar: {
    width: 36,
    height: 36,
    borderRadius: 10,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playerName: {
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 1,
  },

  // ── Carta oculta ──
  hiddenCard: {
    flex: 1,
    width: '100%',
    marginBottom: 20,
    maxHeight: 320,
  },
  hiddenCardInner: {
    flex: 1,
    backgroundColor: '#0a0b14',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#1a1b2e',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  patternRow: {
    position: 'absolute',
    top: 20,
    flexDirection: 'row',
    gap: 15,
  },
  patternDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
  },
  eyeCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#0d0e18',
    borderWidth: 1,
    borderColor: '#1a1b2e',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18,
  },
  tapText: {
    color: '#555',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 2,
  },
  tapSubtext: {
    color: '#333',
    fontSize: 12,
    marginTop: 6,
  },
  cornerTL: {
    position: 'absolute',
    top: 12,
    left: 12,
    width: 20,
    height: 20,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderRadius: 4,
  },
  cornerBR: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    width: 20,
    height: 20,
    borderBottomWidth: 2,
    borderRightWidth: 2,
    borderRadius: 4,
  },

  // ── Carta revelada ──
  revealedCard: {
    width: '100%',
    borderRadius: 20,
    borderWidth: 2,
    padding: 30,
    alignItems: 'center',
    maxHeight: 340,
    backgroundColor: '#0a0b14',
  },
  cardImpostor: {
    borderColor: '#e74c3c60',
  },
  cardCrew: {
    borderColor: '#2ecc7160',
  },
  roleIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  roleTitle: {
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: 4,
  },
  roleDescription: {
    color: '#6a7a8a',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
  wordBadge: {
    marginTop: 18,
    borderWidth: 1.5,
    borderRadius: 14,
    paddingHorizontal: 28,
    paddingVertical: 14,
  },
  wordText: {
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: 3,
  },

  // ── Pista del impostor ──
  hintBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#f1c40f10',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#f1c40f20',
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginTop: 14,
    width: '100%',
  },
  hintText: {
    color: '#f1c40f',
    fontSize: 12,
    fontWeight: '700',
    flex: 1,
  },

  // ── Botón siguiente ──
  nextSection: {
    width: '100%',
    marginTop: 20,
    marginBottom: 30,
    alignItems: 'center',
  },
  nextButton: {
    width: '100%',
    height: 54,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  nextText: {
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
