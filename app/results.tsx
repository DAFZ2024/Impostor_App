import React, { useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
  FadeInDown,
  ZoomIn,
} from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { useGame } from '@/context/GameContext';
import { categories } from '@/data/categories';
import {
  ShieldIcon,
  KnifeIcon,
  UserIcon,
  RefreshIcon,
  ChartIcon,
} from '@/components/Icons';

const PLAYER_COLORS = [
  '#e74c3c', '#3498db', '#2ecc71', '#f1c40f', '#9b59b6',
  '#e67e22', '#1abc9c', '#e91e63', '#00bcd4', '#ff5722',
];

export default function ResultsScreen() {
  const router = useRouter();
  const { state, resetGame } = useGame();
  const crewWins = state.winner === 'crew';

  const pulseAnim = useSharedValue(1);

  useEffect(() => {
    pulseAnim.value = withRepeat(
      withSequence(
        withTiming(1.08, { duration: 800, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 800, easing: Easing.inOut(Easing.ease) })
      ),
      -1, true
    );
  }, []);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseAnim.value }],
  }));

  const impostor = state.players.find((p) => p.isImpostor);
  const sortedPlayers = [...state.players].sort((a, b) => b.votes - a.votes);
  const maxVotes = Math.max(...sortedPlayers.map((p) => p.votes));

  const handlePlayAgain = () => {
    resetGame();
    router.replace('/');
  };

  const winnerColor = crewWins ? '#2ecc71' : '#e74c3c';

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Nebulosas */}
      <View style={[styles.nebula1, { backgroundColor: winnerColor }]} />
      <View style={styles.nebula2} />

      {/* Resultado principal */}
      <Animated.View entering={ZoomIn.duration(500)} style={[styles.resultCircle, { borderColor: winnerColor + '30' }]}>
        <Animated.View style={[styles.resultIconInner, pulseStyle, { backgroundColor: winnerColor + '15' }]}>
          {crewWins
            ? <ShieldIcon size={50} color="#2ecc71" />
            : <KnifeIcon size={50} color="#e74c3c" />
          }
        </Animated.View>
      </Animated.View>

      <Animated.Text
        entering={FadeInDown.delay(200).duration(400)}
        style={[styles.resultTitle, { color: winnerColor }]}
      >
        {crewWins ? '¡TRIPULANTES GANAN!' : '¡EL IMPOSTOR GANA!'}
      </Animated.Text>
      <Animated.Text entering={FadeInDown.delay(300).duration(400)} style={styles.resultSub}>
        {crewWins
          ? 'Descubrieron al impostor a tiempo'
          : 'El impostor se salió con la suya'
        }
      </Animated.Text>

      {/* Impostor revelado */}
      <Animated.View entering={FadeInDown.delay(400).duration(400)} style={styles.revealCard}>
        <Text style={styles.revealLabel}>EL IMPOSTOR ERA</Text>
        <View style={styles.revealRow}>
          <View style={styles.revealAvatar}>
            <KnifeIcon size={20} color="#e74c3c" />
          </View>
          <Text style={styles.revealName}>{impostor?.name ?? '???'}</Text>
        </View>
      </Animated.View>

      {/* Palabra secreta */}
      <Animated.View entering={FadeInDown.delay(500).duration(400)} style={styles.wordCard}>
        <Text style={styles.wordLabel}>LA PALABRA SECRETA</Text>
        <Text style={styles.wordValue}>{state.secretWord}</Text>
        <View style={styles.wordCategory}>
          <Text style={styles.wordCategoryText}>
            {categories[state.categoryIndex].emoji} {categories[state.categoryIndex].name}
          </Text>
        </View>
      </Animated.View>

      {/* Tabla de votos */}
      <Animated.View entering={FadeInDown.delay(600).duration(400)} style={styles.votesSection}>
        <View style={styles.votesSectionHeader}>
          <View style={styles.votesIconCircle}>
            <ChartIcon size={16} color="#00ffff" />
          </View>
          <Text style={styles.votesTitle}>Resultados de Votación</Text>
        </View>

        {sortedPlayers.map((player, i) => {
          const pColor = PLAYER_COLORS[state.players.indexOf(player) % PLAYER_COLORS.length];
          const barWidth = maxVotes > 0 ? (player.votes / maxVotes) * 100 : 0;

          return (
            <View key={player.id} style={styles.voteRow}>
              {/* Posición */}
              <Text style={styles.votePos}>{i + 1}</Text>

              {/* Avatar */}
              <View style={[styles.voteAvatar, { backgroundColor: pColor + '20', borderColor: pColor }]}>
                <UserIcon size={14} color={pColor} />
              </View>

              {/* Nombre + barra */}
              <View style={styles.voteInfo}>
                <View style={styles.voteNameRow}>
                  <Text style={[styles.voteName, { color: pColor }]}>{player.name}</Text>
                  {player.isImpostor && (
                    <View style={styles.impostorTag}>
                      <Text style={styles.impostorTagText}>IMPOSTOR</Text>
                    </View>
                  )}
                </View>
                <View style={styles.voteBarTrack}>
                  <View style={[styles.voteBarFill, { width: `${barWidth}%`, backgroundColor: pColor }]} />
                </View>
              </View>

              {/* Votos */}
              <Text style={[styles.voteCount, { color: pColor }]}>{player.votes}</Text>
            </View>
          );
        })}
      </Animated.View>

      {/* Botón jugar de nuevo */}
      <Animated.View entering={FadeInDown.delay(700).duration(400)} style={styles.playAgainSection}>
        <Pressable
          onPress={handlePlayAgain}
          style={({ pressed }) => [styles.playAgainBtn, pressed && styles.btnPressed]}
        >
          <RefreshIcon size={20} color="#fff" />
          <Text style={styles.playAgainText}>JUGAR DE NUEVO</Text>
        </Pressable>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050610',
  },
  content: {
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },

  // ── Nebulosas ──
  nebula1: {
    position: 'absolute',
    top: -80,
    right: -60,
    width: 280,
    height: 280,
    borderRadius: 140,
    opacity: 0.04,
  },
  nebula2: {
    position: 'absolute',
    bottom: -100,
    left: -70,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: '#00ffff',
    opacity: 0.025,
  },

  // ── Resultado ──
  resultCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0a0b14',
    marginBottom: 16,
  },
  resultIconInner: {
    width: 85,
    height: 85,
    borderRadius: 42,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultTitle: {
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: 3,
    textAlign: 'center',
  },
  resultSub: {
    color: '#4a5568',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 6,
    marginBottom: 24,
  },

  // ── Impostor reveal ──
  revealCard: {
    width: '100%',
    backgroundColor: '#0a0b14',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#e74c3c30',
    padding: 18,
    alignItems: 'center',
    marginBottom: 12,
  },
  revealLabel: {
    color: '#e74c3c',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 3,
    marginBottom: 10,
  },
  revealRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  revealAvatar: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#e74c3c15',
    borderWidth: 1,
    borderColor: '#e74c3c30',
    justifyContent: 'center',
    alignItems: 'center',
  },
  revealName: {
    color: '#e74c3c',
    fontSize: 26,
    fontWeight: '900',
  },

  // ── Palabra ──
  wordCard: {
    width: '100%',
    backgroundColor: '#0a0b14',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#2ecc7130',
    padding: 18,
    alignItems: 'center',
    marginBottom: 24,
  },
  wordLabel: {
    color: '#2ecc71',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 3,
    marginBottom: 8,
  },
  wordValue: {
    color: '#2ecc71',
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: 2,
  },
  wordCategory: {
    marginTop: 10,
    backgroundColor: '#2ecc7110',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  wordCategoryText: {
    color: '#2ecc7180',
    fontSize: 12,
    fontWeight: '600',
  },

  // ── Votos ──
  votesSection: {
    width: '100%',
    marginBottom: 24,
  },
  votesSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
  },
  votesIconCircle: {
    width: 30,
    height: 30,
    borderRadius: 9,
    backgroundColor: '#00ffff10',
    justifyContent: 'center',
    alignItems: 'center',
  },
  votesTitle: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '800',
  },
  voteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0a0b14',
    borderRadius: 12,
    padding: 12,
    marginBottom: 6,
    gap: 10,
  },
  votePos: {
    color: '#333',
    fontSize: 14,
    fontWeight: '800',
    width: 18,
    textAlign: 'center',
  },
  voteAvatar: {
    width: 32,
    height: 32,
    borderRadius: 10,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  voteInfo: {
    flex: 1,
    gap: 4,
  },
  voteNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  voteName: {
    fontSize: 14,
    fontWeight: '700',
  },
  impostorTag: {
    backgroundColor: '#e74c3c20',
    borderRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  impostorTagText: {
    color: '#e74c3c',
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1,
  },
  voteBarTrack: {
    height: 3,
    backgroundColor: '#1a1b2e',
    borderRadius: 2,
    overflow: 'hidden',
  },
  voteBarFill: {
    height: '100%',
    borderRadius: 2,
  },
  voteCount: {
    fontSize: 18,
    fontWeight: '900',
    minWidth: 24,
    textAlign: 'right',
  },

  // ── Play Again ──
  playAgainSection: {
    width: '100%',
  },
  playAgainBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    width: '100%',
    height: 56,
    borderRadius: 16,
    backgroundColor: '#2ecc71',
    shadowColor: '#2ecc71',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  playAgainText: {
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
