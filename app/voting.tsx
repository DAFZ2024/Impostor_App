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

        {/* Progreso */}
        <Animated.View
          entering={FadeInDown.duration(300)}
          style={styles.progressSection}
        >
          <Text style={styles.progressLabel}>
            {currentVoterIndex + 1} / {state.players.length}
          </Text>
          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                { width: `${progress}%`, backgroundColor: voterColor },
              ]}
            />
          </View>
        </Animated.View>

        {/* Header */}
        <Animated.View
          entering={FadeInDown.delay(100).duration(400)}
          style={styles.passHeader}
        >
          <View style={styles.passIconCircle}>
            <VoteIcon size={24} color="#f1c40f" />
          </View>
          <Text style={styles.passTitle}>VOTACIÓN</Text>
          <View style={styles.titleLine} />
        </Animated.View>

        <Animated.Text
          entering={FadeIn.delay(200)}
          style={styles.passInstruction}
        >
          PASA EL TELÉFONO A
        </Animated.Text>

        {/* Tarjeta del votante */}
        <Animated.View
          entering={ZoomIn.delay(300).duration(400)}
          style={[styles.voterCard, { borderColor: voterColor }]}
        >
          <View
            style={[
              styles.voterAvatar,
              { backgroundColor: voterColor + "20", borderColor: voterColor },
            ]}
          >
            <UserIcon size={36} color={voterColor} />
          </View>
          <Text style={[styles.voterName, { color: voterColor }]}>
            {currentVoter.name}
          </Text>
        </Animated.View>

        {/* Botón listo */}
        <Animated.View
          entering={FadeInUp.delay(400).duration(400)}
          style={styles.readySection}
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
            <Text style={styles.readyText}>ESTOY LISTO</Text>
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
          <View style={styles.guessIconCircle}>
            <AlienIcon size={36} color="#e74c3c" />
          </View>
          <Text style={styles.guessTitle}>OPORTUNIDAD SECRETA</Text>
          <View style={styles.titleLine} />
          <Text style={styles.guessSubtitle}>
            Como impostor, puedes intentar adivinar la palabra secreta
          </Text>
          <View style={styles.attemptsRow}>
            {Array.from({ length: MAX_GUESS_ATTEMPTS }).map((_, i) => (
              <View
                key={i}
                style={[
                  styles.attemptDot,
                  i < guessAttempts && styles.attemptDotUsed,
                ]}
              />
            ))}
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
          <Text style={styles.guessHintLabel}>TU PISTA</Text>
          <Text style={styles.guessHintText}>{state.impostorHint}</Text>

          <View style={styles.guessDivider} />

          <Text style={styles.guessInputLabel}>¿Cuál es la palabra?</Text>
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

          {guessResult === "wrong" && (
            <Animated.View
              entering={FadeIn.duration(300)}
              style={styles.wrongBadge}
            >
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
        <View
          style={[
            styles.voteHeaderIcon,
            {
              backgroundColor: voterColor + "15",
              borderColor: voterColor + "30",
            },
          ]}
        >
          <VoteIcon size={18} color={voterColor} />
        </View>
        <View style={styles.voteHeaderInfo}>
          <Text style={styles.voteHeaderTitle}>VOTACIÓN</Text>
          <Text style={[styles.voteHeaderSub, { color: voterColor }]}>
            {currentVoter.name}
          </Text>
        </View>
      </Animated.View>

      <Animated.Text entering={FadeIn.delay(100)} style={styles.voteQuestion}>
        ¿Quién crees que es el impostor?
      </Animated.Text>

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
              entering={FadeInDown.delay(index * 60).duration(300)}
            >
              <Pressable
                onPress={() => handleSelectTarget(player.id)}
                style={[
                  styles.voteCard,
                  { borderColor: isSelected ? pColor : "#1a1b2e" },
                  isSelected && { backgroundColor: pColor + "10" },
                ]}
              >
                <View
                  style={[
                    styles.voteAvatar,
                    { backgroundColor: pColor + "20", borderColor: pColor },
                  ]}
                >
                  <UserIcon size={18} color={pColor} />
                </View>
                <Text
                  style={[styles.voteName, isSelected && { color: pColor }]}
                >
                  {player.name}
                </Text>
                {isSelected && (
                  <View
                    style={[
                      styles.selectedBadge,
                      { backgroundColor: pColor + "20" },
                    ]}
                  >
                    <CheckIcon size={16} color={pColor} />
                  </View>
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
        <Pressable
          onPress={handleConfirmVote}
          style={({ pressed }) => [
            styles.confirmButton,
            !selectedTarget ? styles.confirmDisabled : null,
            pressed && selectedTarget ? styles.btnPressed : null,
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
    backgroundColor: "#050610",
    alignItems: "center",
    paddingTop: 55,
    paddingHorizontal: 20,
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

  // ── Progreso ──
  progressSection: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 24,
  },
  progressLabel: {
    color: "#555",
    fontSize: 13,
    fontWeight: "700",
    minWidth: 35,
  },
  progressTrack: {
    flex: 1,
    height: 4,
    backgroundColor: "#1a1b2e",
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 2,
  },

  // ── Pass screen ──
  passHeader: {
    alignItems: "center",
    marginBottom: 20,
  },
  passIconCircle: {
    width: 50,
    height: 50,
    borderRadius: 16,
    backgroundColor: "#f1c40f10",
    borderWidth: 1,
    borderColor: "#f1c40f20",
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
  titleLine: {
    width: 40,
    height: 2,
    backgroundColor: "#e74c3c",
    marginTop: 8,
    borderRadius: 1,
  },
  passInstruction: {
    color: "#4a5568",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 4,
    marginBottom: 20,
  },

  // ── Voter card ──
  voterCard: {
    borderWidth: 2,
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
    width: "75%",
    backgroundColor: "#0a0b14",
    marginBottom: 30,
  },
  voterAvatar: {
    width: 70,
    height: 70,
    borderRadius: 22,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
  },
  voterName: {
    fontSize: 26,
    fontWeight: "900",
    letterSpacing: 1,
  },

  // ── Ready button ──
  readySection: {
    width: "100%",
    marginTop: "auto",
    marginBottom: 30,
  },
  readyButton: {
    width: "100%",
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  readyText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "900",
    letterSpacing: 3,
  },

  // ── Vote header ──
  voteHeader: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 14,
  },
  voteHeaderIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  voteHeaderInfo: {
    flex: 1,
  },
  voteHeaderTitle: {
    color: "#f1c40f",
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 3,
  },
  voteHeaderSub: {
    fontSize: 18,
    fontWeight: "900",
    marginTop: 2,
  },
  voteQuestion: {
    color: "#6a7a8a",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 16,
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
    borderRadius: 14,
    borderWidth: 1.5,
    padding: 14,
  },
  voteAvatar: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1.5,
    justifyContent: "center",
    alignItems: "center",
  },
  voteName: {
    flex: 1,
    color: "#8a95a5",
    fontSize: 16,
    fontWeight: "700",
    marginLeft: 12,
  },
  selectedBadge: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  // ── Confirm ──
  confirmSection: {
    width: "100%",
    paddingVertical: 18,
  },
  confirmButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    width: "100%",
    height: 56,
    borderRadius: 16,
    backgroundColor: "#e74c3c",
    shadowColor: "#e74c3c",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  confirmDisabled: {
    backgroundColor: "#1a1b2e",
    shadowOpacity: 0,
    elevation: 0,
  },
  confirmText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "900",
    letterSpacing: 3,
  },
  btnPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.97 }],
  },

  // ── Impostor Guess ──
  guessHeader: {
    alignItems: "center",
    marginBottom: 24,
  },
  guessIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: "#e74c3c10",
    borderWidth: 1,
    borderColor: "#e74c3c25",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
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
    marginTop: 8,
    paddingHorizontal: 10,
  },
  guessCard: {
    width: "100%",
    backgroundColor: "#0a0b14",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#e74c3c20",
    padding: 22,
    marginBottom: 20,
  },
  guessHintLabel: {
    color: "#e74c3c",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 3,
    marginBottom: 8,
  },
  guessHintText: {
    color: "#8a95a5",
    fontSize: 15,
    fontWeight: "600",
    lineHeight: 22,
  },
  guessDivider: {
    height: 1,
    backgroundColor: "#1a1b2e",
    marginVertical: 18,
  },
  guessInputLabel: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "800",
    marginBottom: 12,
  },
  guessInput: {
    backgroundColor: "#111222",
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "#e74c3c30",
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    paddingHorizontal: 16,
    paddingVertical: 14,
    textAlign: "center",
  },
  wrongBadge: {
    backgroundColor: "#e74c3c10",
    borderRadius: 10,
    padding: 10,
    marginTop: 12,
  },
  wrongText: {
    color: "#e74c3c",
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
  },
  attemptsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 14,
    gap: 6,
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
  guessConfirmDisabled: {
    backgroundColor: "#1a1b2e",
    shadowOpacity: 0,
    elevation: 0,
  },
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
    height: 52,
    borderRadius: 14,
    backgroundColor: "#e74c3c",
    shadowColor: "#e74c3c",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  guessConfirmText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "900",
    letterSpacing: 2,
  },
  guessSkipBtn: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    height: 52,
    borderRadius: 14,
    backgroundColor: "#3498db10",
    borderWidth: 1.5,
    borderColor: "#3498db40",
  },
  guessSkipText: {
    color: "#3498db",
    fontSize: 14,
    fontWeight: "900",
    letterSpacing: 2,
  },
});
