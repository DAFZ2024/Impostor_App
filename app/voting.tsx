import {
  AlienIcon,
  ArrowRightIcon,
  CheckIcon,
  EyeIcon,
  UserIcon,
  VoteIcon,
} from "@/components/Icons";
import { useGame } from "@/context/GameContext";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  ZoomIn,
  SlideInUp,
  SlideInRight,
} from "react-native-reanimated";

const PLAYER_COLORS = [
  "#e74c3c",
  "#3498db",
  "#2ecc71",
  "#f1c40f",
  "#9b59b6",
  "#e67e22",
  "#1abc9c",
  "#e91e63",
  "#00bcd4",
  "#ff5722",
];

export default function VotingScreen() {
  const router = useRouter();
  const { state, castVote, calculateResults, impostorGuessWord } = useGame();
  const [currentVoterIndex, setCurrentVoterIndex] = useState(0);
  const [selectedTarget, setSelectedTarget] = useState<number | null>(null);
  const [showVoterScreen, setShowVoterScreen] = useState(true);

  // Impostor guess state
  const [showImpostorGuess, setShowImpostorGuess] = useState(false);
  const [wordGuess, setWordGuess] = useState("");
  const [guessResult, setGuessResult] = useState<"none" | "wrong">("none");
  const [guessAttempts, setGuessAttempts] = useState(0);
  const MAX_GUESS_ATTEMPTS = 2;

  const currentVoter = state.players[currentVoterIndex];
  const isLastVoter = currentVoterIndex >= state.players.length - 1;
  const isImpostor = currentVoter?.id === state.impostorId;

  if (!currentVoter) return null;

  const voterColor = PLAYER_COLORS[currentVoterIndex % PLAYER_COLORS.length];
  const progress = ((currentVoterIndex + 1) / state.players.length) * 100;

  const handleSelectTarget = (targetId: number) => {
    if (targetId === currentVoter.id) {
      Alert.alert("¡Error!", "No puedes votar por ti mismo.");
      return;
    }
    setSelectedTarget(targetId);
  };

  const handleGuessWord = () => {
    if (!wordGuess.trim()) {
      Alert.alert(
        "Escribe algo",
        "Debes escribir la palabra que crees que es.",
      );
      return;
    }
    const correct = impostorGuessWord(wordGuess);
    if (correct) {
      router.replace("/results");
    } else {
      const newAttempts = guessAttempts + 1;
      setGuessAttempts(newAttempts);
      if (newAttempts >= MAX_GUESS_ATTEMPTS) {
        setGuessResult("wrong");
        setTimeout(() => {
          setShowImpostorGuess(false);
          setWordGuess("");
          setGuessResult("none");
        }, 1200);
      } else {
        setGuessResult("wrong");
        setWordGuess("");
      }
    }
  };

  const handleSkipGuess = () => {
    setShowImpostorGuess(false);
    setWordGuess("");
    setGuessResult("none");
  };

  const handleConfirmVote = () => {
    if (selectedTarget === null) {
      Alert.alert("Selecciona", "Debes votar por alguien.");
      return;
    }
    castVote(currentVoter.id, selectedTarget);
    if (isLastVoter) {
      setTimeout(() => {
        calculateResults();
        router.replace("/results");
      }, 300);
    } else {
      setCurrentVoterIndex((prev) => prev + 1);
      setSelectedTarget(null);
      setShowVoterScreen(true);
      setShowImpostorGuess(false);
      setWordGuess("");
      setGuessResult("none");
      setGuessAttempts(0);
    }
  };

  // ── Pantalla de pasar teléfono ──
  if (showVoterScreen) {
    return (
      <View style={styles.container}>
        <View style={styles.nebula1} />
        <View style={[styles.nebula2, { backgroundColor: voterColor }]} />
        <View style={[styles.nebulaSmall, { backgroundColor: voterColor, top: 100, left: -30 }]} />

        {/* Step pills */}
        <Animated.View entering={FadeInDown.duration(300)} style={styles.stepsSection}>
          <View style={styles.stepsRow}>
            {state.players.map((_, i) => {
              const c = PLAYER_COLORS[i % PLAYER_COLORS.length];
              const isDone = i < currentVoterIndex;
              const isCurrent = i === currentVoterIndex;
              return (
                <View
                  key={i}
                  style={[
                    styles.stepPill,
                    isDone && { backgroundColor: c, opacity: 0.7 },
                    isCurrent && { backgroundColor: c, opacity: 1 },
                  ]}
                />
              );
            })}
          </View>
          <View style={styles.stepsMeta}>
            <Text style={styles.stepsLabel}>
              Voto {currentVoterIndex + 1} de {state.players.length}
            </Text>
            <View style={[styles.stepsBadge, { backgroundColor: voterColor + '12', borderColor: voterColor + '30' }]}>
              <Text style={[styles.stepsBadgeText, { color: voterColor }]}>{Math.round(progress)}%</Text>
            </View>
          </View>
        </Animated.View>

        {/* Header */}
        <Animated.View
          entering={FadeInDown.delay(100).duration(400)}
          style={styles.passHeader}
        >
          <View style={styles.passIconCircle}>
            <VoteIcon size={22} color="#f1c40f" />
          </View>
          <Text style={styles.passTitle}>VOTACIÓN</Text>
          <View style={styles.titleDivider}>
            <View style={styles.titleLine} />
            <View style={styles.titleDot} />
            <View style={styles.titleLine} />
          </View>
        </Animated.View>

        <Animated.View
          entering={FadeIn.delay(200)}
          style={styles.passInstructionWrap}
        >
          <View style={styles.passInstructionLine} />
          <Text style={styles.passInstruction}>PASA EL TELÉFONO A</Text>
          <View style={styles.passInstructionLine} />
        </Animated.View>

        {/* Tarjeta del votante */}
        <Animated.View
          entering={ZoomIn.delay(300).duration(400)}
          style={[styles.voterCard, { borderColor: voterColor + '40' }]}
        >
          <View style={[styles.voterCardAccent, { backgroundColor: voterColor }]} />
          <View style={[styles.voterAvatarOuter, { borderColor: voterColor + '30' }]}>
            <View
              style={[
                styles.voterAvatar,
                { backgroundColor: voterColor + "12", borderColor: voterColor },
              ]}
            >
              <Text style={[styles.voterAvatarText, { color: voterColor }]}>
                {currentVoter.name.charAt(0).toUpperCase()}
              </Text>
            </View>
          </View>
          <Text style={[styles.voterName, { color: voterColor }]}>
            {currentVoter.name}
          </Text>
          <Text style={styles.voterTag}>Jugador {currentVoterIndex + 1}</Text>
        </Animated.View>

        {/* Botón listo */}
        <Animated.View
          entering={SlideInUp.delay(400).duration(400)}
          style={styles.bottomSection}
        >
          <Pressable
            onPress={() => {
              setShowVoterScreen(false);
              if (isImpostor) setShowImpostorGuess(true);
            }}
            style={({ pressed }) => [
              styles.readyButton,
              { backgroundColor: voterColor },
              pressed && styles.btnPressed,
            ]}
          >
            <Text style={styles.actionBtnText}>ESTOY LISTO</Text>
            <View style={styles.btnArrowWrap}>
              <ArrowRightIcon size={16} color="#ffffff80" />
            </View>
          </Pressable>
        </Animated.View>
      </View>
    );
  }

  // ── Pantalla de adivinar la palabra (impostor) ──
  if (showImpostorGuess) {
    return (
      <View style={styles.container}>
        <View style={styles.nebula1} />
        <View style={[styles.nebula2, { backgroundColor: "#e74c3c" }]} />

        <Animated.View
          entering={FadeInDown.duration(400)}
          style={styles.guessHeader}
        >
          <View style={styles.guessIconOuter}>
            <View style={styles.guessIconCircle}>
              <AlienIcon size={34} color="#e74c3c" />
            </View>
          </View>
          <Text style={styles.guessTitle}>OPORTUNIDAD SECRETA</Text>
          <View style={styles.titleDivider}>
            <View style={[styles.titleLine, { backgroundColor: '#e74c3c40' }]} />
            <View style={[styles.titleDot, { backgroundColor: '#e74c3c' }]} />
            <View style={[styles.titleLine, { backgroundColor: '#e74c3c40' }]} />
          </View>
          <Text style={styles.guessSubtitle}>
            Como impostor, puedes intentar adivinar la palabra secreta
          </Text>

          {/* Attempts indicator */}
          <View style={styles.attemptsCard}>
            <View style={styles.attemptsDotsRow}>
              {Array.from({ length: MAX_GUESS_ATTEMPTS }).map((_, i) => (
                <View
                  key={i}
                  style={[
                    styles.attemptDot,
                    i < guessAttempts && styles.attemptDotUsed,
                  ]}
                />
              ))}
            </View>
            <Text style={styles.attemptsText}>
              {MAX_GUESS_ATTEMPTS - guessAttempts} intento
              {MAX_GUESS_ATTEMPTS - guessAttempts !== 1 ? "s" : ""} restante
              {MAX_GUESS_ATTEMPTS - guessAttempts !== 1 ? "s" : ""}
            </Text>
          </View>
        </Animated.View>

        <Animated.View
          entering={ZoomIn.delay(200).duration(400)}
          style={styles.guessCard}
        >
          {/* Hint section */}
          <View style={styles.guessHintSection}>
            <View style={styles.guessHintLabelRow}>
              <View style={styles.guessHintDot} />
              <Text style={styles.guessHintLabel}>TU PISTA</Text>
            </View>
            <Text style={styles.guessHintText}>{state.impostorHint}</Text>
          </View>

          <View style={styles.guessDivider} />

          {/* Input section */}
          <View style={styles.guessInputSection}>
            <Text style={styles.guessInputLabel}>¿Cuál es la palabra?</Text>
            <View style={styles.guessInputWrap}>
              <TextInput
                style={styles.guessInput}
                placeholder="Escribe la palabra..."
                placeholderTextColor="#444"
                value={wordGuess}
                onChangeText={(t) => {
                  setWordGuess(t);
                  setGuessResult("none");
                }}
                onSubmitEditing={handleGuessWord}
                maxLength={30}
                autoFocus
                autoCapitalize="none"
              />
            </View>
          </View>

          {guessResult === "wrong" && (
            <Animated.View
              entering={FadeIn.duration(300)}
              style={styles.wrongBadge}
            >
              <View style={styles.wrongStripe} />
              <Text style={styles.wrongText}>
                {guessAttempts >= MAX_GUESS_ATTEMPTS
                  ? "¡Sin intentos! Pasando a votación..."
                  : `¡Incorrecto! Te queda ${MAX_GUESS_ATTEMPTS - guessAttempts} intento`}
              </Text>
            </Animated.View>
          )}
        </Animated.View>

        <View style={styles.guessActions}>
          <Animated.View
            entering={FadeInUp.delay(350).duration(400)}
            style={{ flex: 1 }}
          >
            <Pressable
              onPress={handleGuessWord}
              disabled={guessAttempts >= MAX_GUESS_ATTEMPTS}
              style={({ pressed }) => [
                styles.guessConfirmBtn,
                guessAttempts >= MAX_GUESS_ATTEMPTS &&
                  styles.guessConfirmDisabled,
                pressed &&
                  guessAttempts < MAX_GUESS_ATTEMPTS &&
                  styles.btnPressed,
              ]}
            >
              <EyeIcon size={18} color="#fff" />
              <Text style={styles.guessConfirmText}>ADIVINAR</Text>
            </Pressable>
          </Animated.View>

          <Animated.View
            entering={FadeInUp.delay(400).duration(400)}
            style={{ flex: 1 }}
          >
            <Pressable
              onPress={handleSkipGuess}
              style={({ pressed }) => [
                styles.guessSkipBtn,
                pressed && styles.btnPressed,
              ]}
            >
              <ArrowRightIcon size={18} color="#3498db" />
              <Text style={styles.guessSkipText}>IR A VOTAR</Text>
            </Pressable>
          </Animated.View>
        </View>
      </View>
    );
  }

  // ── Pantalla de votación ──
  return (
    <View style={styles.container}>
      <View style={styles.nebula1} />
      <View style={[styles.nebula2, { backgroundColor: voterColor }]} />

      {/* Header */}
      <Animated.View
        entering={FadeInDown.duration(300)}
        style={styles.voteHeader}
      >
        <View style={styles.voteHeaderRow}>
          <View
            style={[
              styles.voteHeaderIcon,
              {
                backgroundColor: voterColor + "10",
                borderColor: voterColor + "25",
              },
            ]}
          >
            <VoteIcon size={18} color={voterColor} />
          </View>
          <View style={styles.voteHeaderInfo}>
            <Text style={styles.voteHeaderLabel}>VOTACIÓN</Text>
            <Text style={[styles.voteHeaderName, { color: voterColor }]}>
              {currentVoter.name}
            </Text>
          </View>
          <View style={[styles.voteHeaderBadge, { borderColor: voterColor + '30' }]}>
            <View style={[styles.voteHeaderBadgeDot, { backgroundColor: voterColor }]} />
            <Text style={[styles.voteHeaderBadgeText, { color: voterColor }]}>
              {currentVoterIndex + 1}/{state.players.length}
            </Text>
          </View>
        </View>
      </Animated.View>

      {/* Question card */}
      <Animated.View entering={FadeIn.delay(100)} style={styles.questionCard}>
        <Text style={styles.voteQuestion}>
          ¿Quién crees que es el impostor?
        </Text>
      </Animated.View>

      {/* Lista de jugadores */}
      <ScrollView
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {state.players.map((player, index) => {
          if (player.id === currentVoter.id) return null;
          const pColor = PLAYER_COLORS[index % PLAYER_COLORS.length];
          const isSelected = selectedTarget === player.id;

          return (
            <Animated.View
              key={player.id}
              entering={SlideInRight.delay(index * 60).duration(300)}
            >
              <Pressable
                onPress={() => handleSelectTarget(player.id)}
                style={({ pressed }) => [
                  styles.voteCard,
                  { borderColor: isSelected ? pColor : "#1a1b2e" },
                  isSelected && { backgroundColor: pColor + "08" },
                  pressed && !isSelected && { backgroundColor: "#0d0e18" },
                ]}
              >
                {/* Left accent bar */}
                <View style={[
                  styles.voteCardAccent,
                  { backgroundColor: isSelected ? pColor : 'transparent' },
                ]} />

                <View
                  style={[
                    styles.voteAvatarRing,
                    { borderColor: isSelected ? pColor + '40' : 'transparent' },
                  ]}
                >
                  <View
                    style={[
                      styles.voteAvatar,
                      { backgroundColor: pColor + "15", borderColor: pColor + (isSelected ? '' : '60') },
                    ]}
                  >
                    <Text style={[styles.voteAvatarText, { color: pColor }]}>
                      {player.name.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                </View>

                <View style={styles.voteNameSection}>
                  <Text
                    style={[styles.voteName, isSelected && { color: "#fff" }]}
                  >
                    {player.name}
                  </Text>
                  <Text style={[styles.voteNameSub, isSelected && { color: pColor + '80' }]}>
                    Jugador {index + 1}
                  </Text>
                </View>

                {isSelected ? (
                  <Animated.View
                    entering={ZoomIn.duration(200)}
                    style={[
                      styles.selectedBadge,
                      { backgroundColor: pColor + "20", borderColor: pColor + '40' },
                    ]}
                  >
                    <CheckIcon size={16} color={pColor} />
                  </Animated.View>
                ) : (
                  <View style={styles.unselectedCircle} />
                )}
              </Pressable>
            </Animated.View>
          );
        })}
      </ScrollView>

      {/* Botón confirmar */}
      <Animated.View
        entering={FadeInUp.delay(200).duration(400)}
        style={styles.confirmSection}
      >
        {selectedTarget !== null && (
          <Animated.View entering={FadeIn.duration(200)} style={styles.selectedSummary}>
            <Text style={styles.selectedSummaryText}>
              Votando por:{" "}
              <Text style={{ fontWeight: "900", color: "#fff" }}>
                {state.players.find(p => p.id === selectedTarget)?.name}
              </Text>
            </Text>
          </Animated.View>
        )}
        <Pressable
          onPress={handleConfirmVote}
          style={({ pressed }) => [
            styles.confirmButton,
            !selectedTarget && styles.confirmDisabled,
            pressed && selectedTarget ? styles.btnPressed : null,
          ]}
        >
          <CheckIcon size={20} color={selectedTarget ? "#fff" : "#555"} />
          <Text style={[styles.actionBtnText, !selectedTarget && { color: "#555" }]}>
            CONFIRMAR VOTO
          </Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#050610",
    alignItems: "center",
    paddingTop: 55,
    paddingHorizontal: 22,
  },

  // ── Nebulosas ──
  nebula1: {
    position: "absolute",
    top: -80,
    left: -60,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: "#f1c40f",
    opacity: 0.025,
  },
  nebula2: {
    position: "absolute",
    bottom: -100,
    right: -70,
    width: 300,
    height: 300,
    borderRadius: 150,
    opacity: 0.03,
  },
  nebulaSmall: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    opacity: 0.03,
  },

  // ── Steps / Progress ──
  stepsSection: {
    width: "100%",
    marginBottom: 20,
  },
  stepsRow: {
    flexDirection: "row",
    gap: 4,
    marginBottom: 10,
  },
  stepPill: {
    flex: 1,
    height: 4,
    borderRadius: 3,
    backgroundColor: "#1a1b2e",
  },
  stepsMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  stepsLabel: {
    color: "#4a5568",
    fontSize: 13,
    fontWeight: "600",
  },
  stepsBadge: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  stepsBadgeText: {
    fontSize: 12,
    fontWeight: "800",
  },

  // ── Pass screen header ──
  passHeader: {
    alignItems: "center",
    marginBottom: 16,
  },
  passIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: "#f1c40f08",
    borderWidth: 1,
    borderColor: "#f1c40f18",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  passTitle: {
    color: "#f1c40f",
    fontSize: 26,
    fontWeight: "900",
    letterSpacing: 6,
  },
  titleDivider: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 10,
  },
  titleLine: {
    width: 28,
    height: 1,
    backgroundColor: "#e74c3c40",
  },
  titleDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#e74c3c",
  },
  passInstructionWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 20,
    marginTop: 8,
  },
  passInstructionLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#ffffff08",
  },
  passInstruction: {
    color: "#4a5568",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 4,
  },

  // ── Voter card ──
  voterCard: {
    borderWidth: 1.5,
    borderRadius: 24,
    padding: 28,
    alignItems: "center",
    width: "80%",
    backgroundColor: "#0a0b14",
    marginBottom: 24,
    overflow: "hidden",
    position: "relative",
  },
  voterCardAccent: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    opacity: 0.5,
  },
  voterAvatarOuter: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 1.5,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
  },
  voterAvatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 2.5,
    justifyContent: "center",
    alignItems: "center",
  },
  voterAvatarText: {
    fontSize: 28,
    fontWeight: "900",
  },
  voterName: {
    fontSize: 26,
    fontWeight: "900",
    letterSpacing: 1,
  },
  voterTag: {
    color: "#ffffff20",
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 1,
    marginTop: 4,
  },

  // ── Ready / Bottom ──
  bottomSection: {
    width: "100%",
    marginTop: "auto",
    marginBottom: 30,
  },
  readyButton: {
    width: "100%",
    height: 58,
    borderRadius: 18,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  actionBtnText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "900",
    letterSpacing: 3,
  },
  btnArrowWrap: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: "#ffffff10",
    justifyContent: "center",
    alignItems: "center",
  },

  // ── Vote header ──
  voteHeader: {
    width: "100%",
    marginBottom: 12,
  },
  voteHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  voteHeaderIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  voteHeaderInfo: {
    flex: 1,
  },
  voteHeaderLabel: {
    color: "#f1c40f80",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 3,
  },
  voteHeaderName: {
    fontSize: 20,
    fontWeight: "900",
    marginTop: 1,
  },
  voteHeaderBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: "#0a0b14",
  },
  voteHeaderBadgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  voteHeaderBadgeText: {
    fontSize: 12,
    fontWeight: "800",
  },

  // ── Question ──
  questionCard: {
    width: "100%",
    backgroundColor: "#0a0b1450",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#ffffff06",
    padding: 14,
    marginBottom: 14,
  },
  voteQuestion: {
    color: "#6a7a8a",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },

  // ── Vote cards ──
  list: {
    width: "100%",
    flex: 1,
  },
  listContent: {
    paddingBottom: 10,
    gap: 8,
  },
  voteCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0a0b14",
    borderRadius: 16,
    borderWidth: 1.5,
    padding: 12,
    paddingLeft: 4,
    overflow: "hidden",
  },
  voteCardAccent: {
    width: 3,
    height: 28,
    borderRadius: 2,
    marginRight: 10,
    marginLeft: 8,
  },
  voteAvatarRing: {
    width: 44,
    height: 44,
    borderRadius: 14,
    borderWidth: 1.5,
    justifyContent: "center",
    alignItems: "center",
  },
  voteAvatar: {
    width: 36,
    height: 36,
    borderRadius: 11,
    borderWidth: 1.5,
    justifyContent: "center",
    alignItems: "center",
  },
  voteAvatarText: {
    fontSize: 14,
    fontWeight: "900",
  },
  voteNameSection: {
    flex: 1,
    marginLeft: 12,
  },
  voteName: {
    color: "#8a95a5",
    fontSize: 16,
    fontWeight: "700",
  },
  voteNameSub: {
    color: "#ffffff15",
    fontSize: 11,
    fontWeight: "600",
    marginTop: 1,
  },
  selectedBadge: {
    width: 34,
    height: 34,
    borderRadius: 11,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  unselectedCircle: {
    width: 34,
    height: 34,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: "#1a1b2e",
  },

  // ── Selected summary ──
  selectedSummary: {
    backgroundColor: "#0a0b1480",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ffffff08",
    padding: 10,
    marginBottom: 12,
  },
  selectedSummaryText: {
    color: "#ffffff50",
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
  },

  // ── Confirm ──
  confirmSection: {
    width: "100%",
    paddingVertical: 16,
  },
  confirmButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    width: "100%",
    height: 58,
    borderRadius: 18,
    backgroundColor: "#e74c3c",
    shadowColor: "#e74c3c",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 10,
  },
  confirmDisabled: {
    backgroundColor: "#1a1b2e",
    shadowOpacity: 0,
    elevation: 0,
  },
  btnPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.97 }],
  },

  // ── Impostor Guess ──
  guessHeader: {
    alignItems: "center",
    marginBottom: 20,
  },
  guessIconOuter: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#e74c3c06",
    borderWidth: 1,
    borderColor: "#e74c3c15",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
  },
  guessIconCircle: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: "#e74c3c0a",
    borderWidth: 1,
    borderColor: "#e74c3c20",
    justifyContent: "center",
    alignItems: "center",
  },
  guessTitle: {
    color: "#e74c3c",
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: 3,
    textAlign: "center",
  },
  guessSubtitle: {
    color: "#4a5568",
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 10,
    paddingHorizontal: 10,
    lineHeight: 19,
  },

  // ── Attempts ──
  attemptsCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 16,
    backgroundColor: "#e74c3c08",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e74c3c15",
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  attemptsDotsRow: {
    flexDirection: "row",
    gap: 5,
  },
  attemptDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#e74c3c",
  },
  attemptDotUsed: {
    backgroundColor: "#333",
  },
  attemptsText: {
    color: "#555",
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 4,
  },

  // ── Guess Card ──
  guessCard: {
    width: "100%",
    backgroundColor: "#0a0b14",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#e74c3c18",
    padding: 22,
    marginBottom: 20,
    overflow: "hidden",
  },
  guessHintSection: {
    marginBottom: 0,
  },
  guessHintLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },
  guessHintDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#e74c3c",
  },
  guessHintLabel: {
    color: "#e74c3c",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 3,
  },
  guessHintText: {
    color: "#8a95a5",
    fontSize: 15,
    fontWeight: "600",
    lineHeight: 22,
  },
  guessDivider: {
    height: 1,
    backgroundColor: "#ffffff06",
    marginVertical: 18,
  },
  guessInputSection: {},
  guessInputLabel: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "800",
    marginBottom: 12,
  },
  guessInputWrap: {
    borderRadius: 16,
    overflow: "hidden",
  },
  guessInput: {
    backgroundColor: "#111222",
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: "#e74c3c25",
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    paddingHorizontal: 16,
    paddingVertical: 14,
    textAlign: "center",
  },
  wrongBadge: {
    backgroundColor: "#e74c3c08",
    borderRadius: 12,
    padding: 12,
    marginTop: 14,
    overflow: "hidden",
    position: "relative",
  },
  wrongStripe: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: "#e74c3c",
    opacity: 0.4,
  },
  wrongText: {
    color: "#e74c3c",
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
  },

  // ── Guess Actions ──
  guessActions: {
    flexDirection: "row",
    width: "100%",
    gap: 10,
    marginTop: "auto",
    marginBottom: 30,
  },
  guessConfirmBtn: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    height: 54,
    borderRadius: 16,
    backgroundColor: "#e74c3c",
    shadowColor: "#e74c3c",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  guessConfirmText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "900",
    letterSpacing: 2,
  },
  guessConfirmDisabled: {
    backgroundColor: "#1a1b2e",
    shadowOpacity: 0,
    elevation: 0,
  },
  guessSkipBtn: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    height: 54,
    borderRadius: 16,
    backgroundColor: "#3498db08",
    borderWidth: 1.5,
    borderColor: "#3498db30",
  },
  guessSkipText: {
    color: "#3498db",
    fontSize: 14,
    fontWeight: "900",
    letterSpacing: 2,
  },
});
