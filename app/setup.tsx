import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Dimensions,
} from 'react-native';
import Animated, { FadeInDown, FadeInUp, FadeIn } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { useGame } from '@/context/GameContext';
import { categories } from '@/data/categories';
import {
  ArrowLeftIcon,
  PlusIcon,
  CloseIcon,
  UsersIcon,
  FolderIcon,
  ClockIcon,
  RocketIcon,
  UserIcon,
} from '@/components/Icons';

const { width } = Dimensions.get('window');
const TIME_OPTIONS = [60, 120, 180, 300];

const PLAYER_COLORS = [
  '#e74c3c', '#3498db', '#2ecc71', '#f1c40f', '#9b59b6',
  '#e67e22', '#1abc9c', '#e91e63', '#00bcd4', '#ff5722',
];

export default function SetupScreen() {
  const router = useRouter();
  const { state, addPlayer, removePlayer, setCategoryIndex, setDiscussionTime, startGame } = useGame();
  const [playerName, setPlayerName] = useState('');

  const handleAddPlayer = () => {
    const name = playerName.trim();
    if (!name) return;
    if (state.players.length >= 10) {
      Alert.alert('Máximo alcanzado', 'Solo puedes agregar hasta 10 jugadores.');
      return;
    }
    if (state.players.some((p) => p.name.toLowerCase() === name.toLowerCase())) {
      Alert.alert('Nombre repetido', 'Ese nombre ya existe.');
      return;
    }
    addPlayer(name);
    setPlayerName('');
  };

  const handleStart = () => {
    if (state.players.length < 3) {
      Alert.alert('Pocos jugadores', 'Necesitas al menos 3 jugadores para empezar.');
      return;
    }
    startGame();
    router.push('/role-reveal');
  };

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    return `${mins} min`;
  };

  const canStart = state.players.length >= 3;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* ── Header ── */}
        <Animated.View entering={FadeInDown.duration(400)} style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <ArrowLeftIcon size={22} color="#00ffff" />
          </Pressable>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>CONFIGURACIÓN</Text>
            <View style={styles.headerLine} />
          </View>
        </Animated.View>

        {/* ── Sección: Jugadores ── */}
        <Animated.View entering={FadeInDown.delay(100).duration(400)}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIconCircle}>
              <UsersIcon size={18} color="#00ffff" />
            </View>
            <Text style={styles.sectionTitle}>Jugadores</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{state.players.length}/10</Text>
            </View>
          </View>

          {/* Input */}
          <View style={styles.inputRow}>
            <View style={styles.inputWrapper}>
              <UserIcon size={18} color="#555" />
              <TextInput
                style={styles.input}
                placeholder="Nombre del jugador..."
                placeholderTextColor="#444"
                value={playerName}
                onChangeText={setPlayerName}
                onSubmitEditing={handleAddPlayer}
                maxLength={15}
              />
            </View>
            <Pressable
              onPress={handleAddPlayer}
              style={({ pressed }) => [styles.addBtn, pressed && styles.btnPressed]}
            >
              <PlusIcon size={22} color="#fff" />
            </Pressable>
          </View>

          {/* Lista jugadores */}
          {state.players.map((player, index) => {
            const color = PLAYER_COLORS[index % PLAYER_COLORS.length];
            return (
              <Animated.View
                key={player.id}
                entering={FadeIn.delay(index * 60).duration(300)}
                style={[styles.playerCard, { borderLeftColor: color }]}
              >
                <View style={[styles.playerAvatar, { backgroundColor: color + '20', borderColor: color }]}>
                  <UserIcon size={18} color={color} />
                </View>
                <Text style={[styles.playerName, { color }]}>{player.name}</Text>
                <Pressable onPress={() => removePlayer(player.id)} style={styles.removeBtn}>
                  <CloseIcon size={18} color="#e74c3c" />
                </Pressable>
              </Animated.View>
            );
          })}

          {state.players.length === 0 && (
            <View style={styles.emptyBox}>
              <UsersIcon size={32} color="#333" />
              <Text style={styles.emptyText}>Agrega al menos 3 jugadores</Text>
              <Text style={styles.emptySubText}>Mínimo 3, máximo 10</Text>
            </View>
          )}

          {/* Indicador de mínimo */}
          {state.players.length > 0 && state.players.length < 3 && (
            <View style={styles.warningBox}>
              <Text style={styles.warningText}>
                Faltan {3 - state.players.length} jugador{3 - state.players.length > 1 ? 'es' : ''} más
              </Text>
            </View>
          )}
        </Animated.View>

        {/* ── Sección: Categoría ── */}
        <Animated.View entering={FadeInDown.delay(200).duration(400)}>
          <View style={[styles.sectionHeader, { marginTop: 28 }]}>
            <View style={[styles.sectionIconCircle, { backgroundColor: '#9b59b620' }]}>
              <FolderIcon size={18} color="#9b59b6" />
            </View>
            <Text style={styles.sectionTitle}>Categoría</Text>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
            {categories.map((cat, index) => {
              const isActive = state.categoryIndex === index;
              return (
                <Pressable
                  key={cat.name}
                  onPress={() => setCategoryIndex(index)}
                  style={[styles.categoryCard, isActive && styles.categoryCardActive]}
                >
                  <Text style={styles.categoryEmoji}>{cat.emoji}</Text>
                  <Text style={[styles.categoryName, isActive && styles.categoryNameActive]}>
                    {cat.name}
                  </Text>
                  <Text style={[styles.categoryCount, isActive && styles.categoryCountActive]}>
                    {cat.words.length} palabras
                  </Text>
                  {isActive && <View style={styles.categoryDot} />}
                </Pressable>
              );
            })}
          </ScrollView>
        </Animated.View>

        {/* ── Sección: Tiempo ── */}
        <Animated.View entering={FadeInDown.delay(300).duration(400)}>
          <View style={[styles.sectionHeader, { marginTop: 28 }]}>
            <View style={[styles.sectionIconCircle, { backgroundColor: '#f1c40f20' }]}>
              <ClockIcon size={18} color="#f1c40f" />
            </View>
            <Text style={styles.sectionTitle}>Tiempo de Discusión</Text>
          </View>

          <View style={styles.timeRow}>
            {TIME_OPTIONS.map((t) => {
              const isActive = state.discussionTime === t;
              return (
                <Pressable
                  key={t}
                  onPress={() => setDiscussionTime(t)}
                  style={[styles.timeCard, isActive && styles.timeCardActive]}
                >
                  <Text style={[styles.timeValue, isActive && styles.timeValueActive]}>
                    {Math.floor(t / 60)}
                  </Text>
                  <Text style={[styles.timeUnit, isActive && styles.timeUnitActive]}>
                    min
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </Animated.View>

        {/* ── Botón Iniciar ── */}
        <Animated.View entering={FadeInUp.delay(400).duration(500)} style={styles.startSection}>
          <Pressable
            onPress={handleStart}
            style={({ pressed }) => [
              styles.startButton,
              !canStart && styles.startButtonDisabled,
              pressed && canStart && styles.btnPressed,
            ]}
          >
            <RocketIcon size={22} color="#fff" />
            <Text style={styles.startText}>INICIAR JUEGO</Text>
          </Pressable>
          {!canStart && (
            <Text style={styles.startHint}>Agrega {3 - state.players.length} jugador(es) más</Text>
          )}
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050610',
  },
  scroll: {
    padding: 20,
    paddingTop: 55,
    paddingBottom: 50,
  },

  // ── Header ──
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#0d0e18',
    borderWidth: 1,
    borderColor: '#00ffff25',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: {
    flex: 1,
    marginLeft: 14,
  },
  headerTitle: {
    color: '#00ffff',
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 4,
  },
  headerLine: {
    width: 40,
    height: 2,
    backgroundColor: '#e74c3c',
    marginTop: 4,
    borderRadius: 1,
  },

  // ── Secciones ──
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
  },
  sectionIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#00ffff15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '800',
    flex: 1,
  },
  badge: {
    backgroundColor: '#00ffff15',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeText: {
    color: '#00ffff',
    fontSize: 13,
    fontWeight: '700',
  },

  // ── Input ──
  inputRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0d0e18',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#1a1b2e',
    paddingHorizontal: 14,
    gap: 10,
  },
  input: {
    flex: 1,
    color: '#fff',
    fontSize: 15,
    paddingVertical: 13,
  },
  addBtn: {
    backgroundColor: '#2ecc71',
    width: 52,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#2ecc71',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  btnPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.97 }],
  },

  // ── Player Cards ──
  playerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0d0e18',
    borderRadius: 12,
    borderLeftWidth: 3,
    padding: 12,
    marginBottom: 8,
  },
  playerAvatar: {
    width: 38,
    height: 38,
    borderRadius: 12,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playerName: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    marginLeft: 12,
  },
  removeBtn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#e74c3c10',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // ── Empty State ──
  emptyBox: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: '#0d0e18',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1a1b2e',
    borderStyle: 'dashed',
  },
  emptyText: {
    color: '#444',
    fontSize: 15,
    fontWeight: '700',
    marginTop: 10,
  },
  emptySubText: {
    color: '#333',
    fontSize: 12,
    marginTop: 3,
  },

  // ── Warning ──
  warningBox: {
    backgroundColor: '#f1c40f10',
    borderRadius: 10,
    padding: 10,
    marginTop: 5,
  },
  warningText: {
    color: '#f1c40f',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },

  // ── Categories ──
  categoryScroll: {
    marginBottom: 5,
  },
  categoryCard: {
    width: 110,
    alignItems: 'center',
    backgroundColor: '#0d0e18',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#1a1b2e',
    paddingVertical: 14,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  categoryCardActive: {
    borderColor: '#00ffff',
    backgroundColor: '#00ffff08',
  },
  categoryEmoji: {
    fontSize: 28,
    marginBottom: 6,
  },
  categoryName: {
    color: '#666',
    fontSize: 13,
    fontWeight: '700',
  },
  categoryNameActive: {
    color: '#00ffff',
  },
  categoryCount: {
    color: '#333',
    fontSize: 10,
    marginTop: 3,
    fontWeight: '600',
  },
  categoryCountActive: {
    color: '#00ffff80',
  },
  categoryDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#00ffff',
    marginTop: 6,
  },

  // ── Time ──
  timeRow: {
    flexDirection: 'row',
    gap: 10,
  },
  timeCard: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#0d0e18',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#1a1b2e',
    paddingVertical: 14,
  },
  timeCardActive: {
    borderColor: '#f1c40f',
    backgroundColor: '#f1c40f08',
  },
  timeValue: {
    color: '#555',
    fontSize: 24,
    fontWeight: '900',
  },
  timeValueActive: {
    color: '#f1c40f',
  },
  timeUnit: {
    color: '#444',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  timeUnitActive: {
    color: '#f1c40f80',
  },

  // ── Start Button ──
  startSection: {
    alignItems: 'center',
    marginTop: 35,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    width: '100%',
    height: 58,
    borderRadius: 16,
    backgroundColor: '#e74c3c',
    shadowColor: '#e74c3c',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
  },
  startButtonDisabled: {
    backgroundColor: '#1a1b2e',
    shadowOpacity: 0,
    elevation: 0,
  },
  startText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 3,
  },
  startHint: {
    color: '#555',
    fontSize: 12,
    marginTop: 8,
  },
});
