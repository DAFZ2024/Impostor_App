import React, { useState } from 'react';
import { StyleSheet, View, Text, Pressable, Dimensions } from 'react-native';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  ZoomIn,
  SlideInUp,
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
      {/* Nebulosas decorativas */}
      <View style={[styles.nebula, { top: -80, right: -50, backgroundColor: color }]} />
      <View style={[styles.nebula, { bottom: -100, left: -70, backgroundColor: '#00ffff' }]} />
      <View style={[styles.nebulaSmall, { top: 120, left: -30, backgroundColor: color }]} />

      {/* ── Header con progreso ── */}
      <Animated.View
        entering={FadeInDown.duration(400)}
        style={styles.headerSection}
      >
        {/* Step indicator pills */}
        <View style={styles.stepsRow}>
          {state.players.map((_, i) => {
            const stepColor = PLAYER_COLORS[i % PLAYER_COLORS.length];
            const isDone = i < state.currentRevealIndex;
            const isCurrent = i === state.currentRevealIndex;
            return (
              <View
                key={i}
                style={[
                  styles.stepPill,
                  isDone && { backgroundColor: stepColor, opacity: 0.8 },
                  isCurrent && { backgroundColor: stepColor, opacity: 1 },
                ]}
              />
            );
          })}
        </View>

        <View style={styles.progressMeta}>
          <Text style={styles.progressLabel}>
            Jugador {state.currentRevealIndex + 1} de {state.players.length}
          </Text>
          <View style={[styles.progressBadge, { backgroundColor: color + '15', borderColor: color + '30' }]}>
            <Text style={[styles.progressBadgeText, { color }]}>{Math.round(progress)}%</Text>
          </View>
        </View>
      </Animated.View>

      {/* ── Instrucción ── */}
      <Animated.View
        key={`inst-${state.currentRevealIndex}-${revealed}`}
        entering={FadeIn.duration(300)}
        style={styles.instructionWrap}
      >
        <View style={styles.instructionLine} />
        <Text style={styles.instruction}>
          {revealed ? 'MEMORIZA TU ROL' : 'PASA EL TELÉFONO A'}
        </Text>
        <View style={styles.instructionLine} />
      </Animated.View>

      {/* ── Nombre del jugador ── */}
      <Animated.View
        key={`name-${state.currentRevealIndex}`}
        entering={FadeInDown.duration(400)}
        style={[styles.nameCard, { borderColor: color + '40' }]}
      >
        <View style={[styles.nameGlow, { backgroundColor: color + '08' }]} />
        <View style={[styles.nameAvatarRing, { borderColor: color + '50' }]}>
          <View style={[styles.nameAvatar, { backgroundColor: color }]}>
            <Text style={styles.nameAvatarText}>
              {currentPlayer.name.charAt(0).toUpperCase()}
            </Text>
          </View>
        </View>
        <View style={styles.nameInfo}>
          <Text style={[styles.playerName, { color }]}>{currentPlayer.name}</Text>
          <Text style={styles.playerTag}>Jugador {state.currentRevealIndex + 1}</Text>
        </View>
        <View style={[styles.nameColorDot, { backgroundColor: color }]} />
      </Animated.View>

      {/* ── Carta oculta ── */}
      {!revealed ? (
        <Pressable onPress={handleReveal} style={styles.hiddenCard}>
          <View style={styles.hiddenCardInner}>
            {/* Corner decorations */}
            <View style={[styles.cornerTL, { borderColor: color + '35' }]} />
            <View style={[styles.cornerTR, { borderColor: color + '35' }]} />
            <View style={[styles.cornerBL, { borderColor: color + '35' }]} />
            <View style={[styles.cornerBR, { borderColor: color + '35' }]} />

            {/* Pattern grid */}
            <View style={styles.patternGrid}>
              {[...Array(9)].map((_, i) => (
                <View
                  key={i}
                  style={[
                    styles.patternDot,
                    { opacity: 0.03 + (i % 3) * 0.02, backgroundColor: color },
                  ]}
                />
              ))}
            </View>

            {/* Central eye icon */}
            <View style={[styles.eyeRingOuter, { borderColor: color + '15' }]}>
              <View style={[styles.eyeRing, { borderColor: color + '25' }]}>
                <View style={styles.eyeCircle}>
                  <EyeOffIcon size={44} color="#555" />
                </View>
              </View>
            </View>

            <Text style={styles.tapText}>TOCA PARA REVELAR</Text>
            <View style={styles.tapDivider} />
            <Text style={styles.tapSubtext}>
              Solo tú debes ver esta pantalla
            </Text>

            {/* Subtle color accent at bottom */}
            <View style={[styles.hiddenCardAccent, { backgroundColor: color }]} />
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
          {/* Top color stripe */}
          <View style={[styles.revealedStripe, {
            backgroundColor: isImpostor ? '#e74c3c' : '#2ecc71',
          }]} />

          {/* Role glow background */}
          <View style={[styles.roleGlow, {
            backgroundColor: isImpostor ? '#e74c3c' : '#2ecc71',
          }]} />

          {/* Icono principal */}
          <View style={[styles.roleIconOuter, {
            borderColor: isImpostor ? '#e74c3c20' : '#2ecc7120',
          }]}>
            <View style={[styles.roleIconCircle, {
              backgroundColor: isImpostor ? '#e74c3c12' : '#2ecc7112',
            }]}>
              {isImpostor
                ? <KnifeIcon size={44} color="#e74c3c" />
                : <ShieldIcon size={44} color="#2ecc71" />
              }
            </View>
          </View>

          {/* Título del rol */}
          <Text style={[styles.roleTitle, { color: isImpostor ? '#e74c3c' : '#2ecc71' }]}>
            {isImpostor ? '¡IMPOSTOR!' : 'TRIPULANTE'}
          </Text>

          {/* Subtle divider */}
          <View style={[styles.roleDivider, {
            backgroundColor: isImpostor ? '#e74c3c25' : '#2ecc7125'
          }]} />

          {/* Descripción */}
          <Text style={styles.roleDescription}>
            {isImpostor
              ? 'No conoces la palabra secreta.\nPero tienes una pista...'
              : 'La palabra secreta es:'
            }
          </Text>

          {/* Palabra */}
          <View style={[styles.wordBadge, {
            borderColor: isImpostor ? '#e74c3c40' : '#2ecc7140',
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
            <Animated.View
              entering={FadeInUp.delay(200).duration(300)}
              style={styles.hintBox}
            >
              <View style={styles.hintIconWrap}>
                <LightbulbIcon size={16} color="#f1c40f" />
              </View>
              <View style={styles.hintContent}>
                <Text style={styles.hintLabel}>PISTA</Text>
                <Text style={styles.hintText}>{state.impostorHint}</Text>
              </View>
            </Animated.View>
          )}
        </Animated.View>
      )}

      {/* ── Botón siguiente ── */}
      {revealed && (
        <Animated.View entering={SlideInUp.delay(200).duration(400)} style={styles.nextSection}>
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
            <View style={[styles.nextBtnArrow, {
              backgroundColor: isLast ? '#ffffff15' : '#ffffff15',
            }]}>
              <Text style={styles.nextBtnArrowText}>→</Text>
            </View>
          </Pressable>
          {!isLast && (
            <Text style={styles.nextHint}>
              Pasa el teléfono al siguiente jugador
            </Text>
          )}
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
    paddingHorizontal: 22,
  },

  // ── Nebulosas ──
  nebula: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
    opacity: 0.035,
  },
  nebulaSmall: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    opacity: 0.03,
  },

  // ── Header & Progreso ──
  headerSection: {
    width: '100%',
    marginBottom: 24,
  },
  stepsRow: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: 12,
  },
  stepPill: {
    flex: 1,
    height: 4,
    borderRadius: 3,
    backgroundColor: '#1a1b2e',
  },
  progressMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressLabel: {
    color: '#4a5568',
    fontSize: 13,
    fontWeight: '600',
  },
  progressBadge: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  progressBadgeText: {
    fontSize: 12,
    fontWeight: '800',
  },

  // ── Instrucción ──
  instructionWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
  },
  instructionLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#ffffff08',
  },
  instruction: {
    color: '#4a5568',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 4,
  },

  // ── Nombre ──
  nameCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderWidth: 1.5,
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 22,
    backgroundColor: '#0a0b14',
    width: '100%',
    overflow: 'hidden',
    position: 'relative',
  },
  nameGlow: {
    position: 'absolute',
    top: -30,
    right: -30,
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  nameAvatarRing: {
    width: 46,
    height: 46,
    borderRadius: 15,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nameAvatar: {
    width: 36,
    height: 36,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nameAvatarText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '900',
  },
  nameInfo: {
    flex: 1,
  },
  playerName: {
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 1,
  },
  playerTag: {
    color: '#ffffff25',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
    letterSpacing: 1,
  },
  nameColorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },

  // ── Carta oculta ──
  hiddenCard: {
    flex: 1,
    width: '100%',
    marginBottom: 20,
    maxHeight: 340,
  },
  hiddenCardInner: {
    flex: 1,
    backgroundColor: '#0a0b14',
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: '#1a1b2e',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  patternGrid: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    alignContent: 'space-around',
    padding: 30,
  },
  patternDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  eyeRingOuter: {
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  eyeRing: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eyeCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#0d0e18',
    borderWidth: 1,
    borderColor: '#1a1b2e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tapText: {
    color: '#666',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 3,
  },
  tapDivider: {
    width: 40,
    height: 2,
    backgroundColor: '#ffffff08',
    borderRadius: 1,
    marginVertical: 10,
  },
  tapSubtext: {
    color: '#333',
    fontSize: 12,
    fontWeight: '500',
  },
  hiddenCardAccent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    opacity: 0.3,
  },
  cornerTL: {
    position: 'absolute',
    top: 14,
    left: 14,
    width: 22,
    height: 22,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderTopLeftRadius: 6,
  },
  cornerTR: {
    position: 'absolute',
    top: 14,
    right: 14,
    width: 22,
    height: 22,
    borderTopWidth: 2,
    borderRightWidth: 2,
    borderTopRightRadius: 6,
  },
  cornerBL: {
    position: 'absolute',
    bottom: 14,
    left: 14,
    width: 22,
    height: 22,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    borderBottomLeftRadius: 6,
  },
  cornerBR: {
    position: 'absolute',
    bottom: 14,
    right: 14,
    width: 22,
    height: 22,
    borderBottomWidth: 2,
    borderRightWidth: 2,
    borderBottomRightRadius: 6,
  },

  // ── Carta revelada ──
  revealedCard: {
    width: '100%',
    borderRadius: 24,
    borderWidth: 2,
    padding: 28,
    alignItems: 'center',
    backgroundColor: '#0a0b14',
    overflow: 'hidden',
    position: 'relative',
  },
  cardImpostor: {
    borderColor: '#e74c3c50',
  },
  cardCrew: {
    borderColor: '#2ecc7150',
  },
  revealedStripe: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    opacity: 0.8,
  },
  roleGlow: {
    position: 'absolute',
    top: -60,
    width: 200,
    height: 120,
    borderRadius: 60,
    opacity: 0.06,
  },
  roleIconOuter: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  roleIconCircle: {
    width: 82,
    height: 82,
    borderRadius: 41,
    justifyContent: 'center',
    alignItems: 'center',
  },
  roleTitle: {
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: 5,
  },
  roleDivider: {
    width: 50,
    height: 2,
    borderRadius: 1,
    marginVertical: 10,
  },
  roleDescription: {
    color: '#6a7a8a',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
  },
  wordBadge: {
    marginTop: 16,
    borderWidth: 1.5,
    borderRadius: 16,
    paddingHorizontal: 30,
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
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: '#f1c40f08',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#f1c40f18',
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginTop: 16,
    width: '100%',
  },
  hintIconWrap: {
    width: 30,
    height: 30,
    borderRadius: 9,
    backgroundColor: '#f1c40f10',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 1,
  },
  hintContent: {
    flex: 1,
  },
  hintLabel: {
    color: '#f1c40f80',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 2,
    marginBottom: 3,
  },
  hintText: {
    color: '#f1c40f',
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
  },

  // ── Botón siguiente ──
  nextSection: {
    width: '100%',
    marginTop: 18,
    marginBottom: 30,
    alignItems: 'center',
  },
  nextButton: {
    width: '100%',
    height: 58,
    borderRadius: 18,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  nextText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 3,
  },
  nextBtnArrow: {
    width: 30,
    height: 30,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextBtnArrowText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  nextHint: {
    color: '#4a5568',
    fontSize: 12,
    fontWeight: '500',
    marginTop: 10,
  },
  btnPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.97 }],
  },
});
