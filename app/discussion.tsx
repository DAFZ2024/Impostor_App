import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ChatIcon,
  EyeIcon,
  LightbulbIcon,
  RocketIcon,
  RotateCcwIcon,
  RotateCwIcon,
  UserIcon,
  VoteIcon,
} from "@/components/Icons";
import TimerCircle from "@/components/TimerCircle";
import { useGame } from "@/context/GameContext";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  ZoomIn,
  SlideInUp,
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

export default function DiscussionScreen() {
  const router = useRouter();
  const { state, setPhase } = useGame();
  const [timerDone, setTimerDone] = useState(false);
  const [started, setStarted] = useState(false);

  // Elegir jugador y dirección aleatorios al montar
  const { starterPlayer, direction } = useMemo(() => {
    const idx = Math.floor(Math.random() * state.players.length);
    const dir = Math.random() < 0.5 ? "left" : "right";
    return {
      starterPlayer: state.players[idx],
      direction: dir as "left" | "right",
    };
  }, []);

  const handleTimerComplete = () => setTimerDone(true);

  const handleGoToVoting = () => {
    setPhase("voting");
    router.replace("/voting");
  };

  const dirColor = direction === "left" ? "#3498db" : "#2ecc71";

  // ── Pantalla previa: quién comienza y dirección ──
  if (!started) {
    const playerIdx = state.players.indexOf(starterPlayer);
    const playerColor = PLAYER_COLORS[playerIdx % PLAYER_COLORS.length];

    return (
      <View style={styles.container}>
        <View style={styles.nebula1} />
        <View style={styles.nebula2} />
        <View
          style={[
            styles.nebulaAccent,
            { backgroundColor: playerColor, top: 80, right: -40 },
          ]}
        />

        {/* Header */}
        <Animated.View
          entering={FadeInDown.duration(500)}
          style={styles.introHeader}
        >
          <View style={styles.headerIconCircle}>
            <ChatIcon size={22} color="#00ffff" />
          </View>
          <Text style={styles.title}>DISCUSIÓN</Text>
          <View style={styles.titleDivider}>
            <View style={styles.titleLine} />
            <View style={styles.titleDot} />
            <View style={styles.titleLine} />
          </View>
          <Text style={styles.introSubtitle}>Antes de comenzar...</Text>
        </Animated.View>

        {/* Combined card: who starts + direction */}
        <Animated.View
          entering={ZoomIn.delay(200).duration(500)}
          style={styles.introCard}
        >
          {/* Top accent */}
          <View
            style={[styles.introCardAccent, { backgroundColor: playerColor }]}
          />

          {/* Who starts */}
          <View style={styles.starterSection}>
            <View style={styles.introLabelWrap}>
              <View style={styles.introLabelLine} />
              <Text style={styles.introLabel}>COMIENZA</Text>
              <View style={styles.introLabelLine} />
            </View>

            <View
              style={[
                styles.starterAvatarOuter,
                { borderColor: playerColor + "30" },
              ]}
            >
              <View
                style={[
                  styles.starterAvatarCircle,
                  {
                    borderColor: playerColor,
                    backgroundColor: playerColor + "12",
                  },
                ]}
              >
                <Text style={[styles.starterAvatarText, { color: playerColor }]}>
                  {starterPlayer.name.charAt(0).toUpperCase()}
                </Text>
              </View>
            </View>
            <Text style={[styles.starterName, { color: playerColor }]}>
              {starterPlayer.name}
            </Text>
            <Text style={styles.starterTag}>
              Jugador {playerIdx + 1}
            </Text>
          </View>

          {/* Separator */}
          <View style={styles.introSeparator}>
            <View style={styles.introSepLine} />
            <View style={styles.introSepDot} />
            <View style={styles.introSepLine} />
          </View>

          {/* Direction */}
          <View style={styles.directionSection}>
            <View style={styles.introLabelWrap}>
              <View style={styles.introLabelLine} />
              <Text style={styles.introLabel}>DIRECCIÓN</Text>
              <View style={styles.introLabelLine} />
            </View>

            <View style={styles.directionRow}>
              <View
                style={[
                  styles.directionIconCircle,
                  {
                    backgroundColor: dirColor + "10",
                    borderColor: dirColor + "30",
                  },
                ]}
              >
                {direction === "left" ? (
                  <RotateCcwIcon size={30} color={dirColor} />
                ) : (
                  <RotateCwIcon size={30} color={dirColor} />
                )}
              </View>

              <View style={styles.directionInfo}>
                <View style={styles.directionArrowRow}>
                  {direction === "left" ? (
                    <>
                      <ArrowLeftIcon size={18} color={dirColor} />
                      <Text style={[styles.directionText, { color: dirColor }]}>
                        IZQUIERDA
                      </Text>
                      <ArrowLeftIcon size={18} color={dirColor} />
                    </>
                  ) : (
                    <>
                      <ArrowRightIcon size={18} color={dirColor} />
                      <Text style={[styles.directionText, { color: dirColor }]}>
                        DERECHA
                      </Text>
                      <ArrowRightIcon size={18} color={dirColor} />
                    </>
                  )}
                </View>
                <Text style={styles.directionHint}>
                  {direction === "left"
                    ? "Sentido antihorario"
                    : "Sentido horario"}
                </Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Player chips */}
        <Animated.View
          entering={FadeIn.delay(450).duration(400)}
          style={styles.playerChipsRow}
        >
          {state.players.map((p, i) => {
            const c = PLAYER_COLORS[i % PLAYER_COLORS.length];
            const isStarter = p === starterPlayer;
            return (
              <View
                key={p.id}
                style={[
                  styles.playerChip,
                  { borderColor: c + "30" },
                  isStarter && { borderColor: c, backgroundColor: c + "10" },
                ]}
              >
                <View style={[styles.playerChipDot, { backgroundColor: c }]} />
                <Text
                  style={[
                    styles.playerChipText,
                    isStarter && { color: c, fontWeight: "800" },
                  ]}
                  numberOfLines={1}
                >
                  {p.name}
                </Text>
              </View>
            );
          })}
        </Animated.View>

        {/* Botón comenzar */}
        <Animated.View
          entering={SlideInUp.delay(600).duration(400)}
          style={styles.bottomSection}
        >
          <Pressable
            onPress={() => setStarted(true)}
            style={({ pressed }) => [
              styles.startDiscussionBtn,
              pressed && styles.btnPressed,
            ]}
          >
            <RocketIcon size={20} color="#fff" />
            <Text style={styles.actionBtnText}>COMENZAR DISCUSIÓN</Text>
          </Pressable>
        </Animated.View>
      </View>
    );
  }

  // ── Pantalla de Discusión Activa ──
  return (
    <View style={styles.container}>
      {/* Nebulosas */}
      <View style={styles.nebula1} />
      <View style={styles.nebula2} />

      {/* Header */}
      <Animated.View
        entering={FadeInDown.duration(400)}
        style={styles.headerBlock}
      >
        <View style={styles.headerRow}>
          <View style={styles.headerIconCircle}>
            <ChatIcon size={20} color="#00ffff" />
          </View>
          <View style={styles.headerTextGroup}>
            <Text style={styles.headerLabel}>EN CURSO</Text>
            <Text style={styles.headerTitle}>DISCUSIÓN</Text>
          </View>
          <View
            style={[
              styles.headerStatusBadge,
              timerDone && styles.headerStatusBadgeUrgent,
            ]}
          >
            <View
              style={[
                styles.headerStatusDot,
                {
                  backgroundColor: timerDone ? "#e74c3c" : "#2ecc71",
                },
              ]}
            />
            <Text
              style={[
                styles.headerStatusText,
                timerDone && { color: "#e74c3c" },
              ]}
            >
              {timerDone ? "TIEMPO" : "ACTIVA"}
            </Text>
          </View>
        </View>
      </Animated.View>

      {/* Reglas rápidas */}
      <Animated.View
        entering={FadeInDown.delay(150).duration(400)}
        style={styles.rulesCard}
      >
        <View style={styles.rulesHeader}>
          <Text style={styles.rulesHeaderText}>REGLAS</Text>
        </View>
        {[
          {
            icon: <ChatIcon size={15} color="#00ffff" />,
            bg: "#00ffff",
            text: "Describan la palabra sin decirla directamente",
          },
          {
            icon: <EyeIcon size={15} color="#f1c40f" />,
            bg: "#f1c40f",
            text: "Observen quién actúa sospechoso",
          },
          {
            icon: <UserIcon size={15} color="#e74c3c" />,
            bg: "#e74c3c",
            text: "Hagan preguntas para exponer al impostor",
          },
        ].map((rule, index) => (
          <View key={index}>
            {index > 0 && <View style={styles.ruleDivider} />}
            <View style={styles.ruleRow}>
              <View
                style={[styles.ruleIcon, { backgroundColor: rule.bg + "10" }]}
              >
                {rule.icon}
              </View>
              <Text style={styles.ruleText}>{rule.text}</Text>
              <View style={[styles.ruleAccent, { backgroundColor: rule.bg }]} />
            </View>
          </View>
        ))}
      </Animated.View>

      {/* Timer */}
      <Animated.View
        entering={ZoomIn.delay(300).duration(500)}
        style={styles.timerSection}
      >
        <View
          style={[
            styles.timerGlow,
            {
              backgroundColor: timerDone ? "#e74c3c" : "#00ffff",
            },
          ]}
        />
        <TimerCircle
          totalSeconds={state.discussionTime}
          onComplete={handleTimerComplete}
          size={200}
          strokeWidth={6}
          color={timerDone ? "#e74c3c" : "#00ffff"}
        />
      </Animated.View>

      {/* Mensaje de tiempo agotado */}
      {timerDone && (
        <Animated.View entering={ZoomIn.duration(300)} style={styles.timeUpCard}>
          <View style={styles.timeUpStripe} />
          <View style={styles.timeUpContent}>
            <Text style={styles.timeUpEmoji}>⏰</Text>
            <View>
              <Text style={styles.timeUpText}>¡TIEMPO AGOTADO!</Text>
              <Text style={styles.timeUpSub}>Es hora de votar</Text>
            </View>
          </View>
        </Animated.View>
      )}

      {/* Tip */}
      {!timerDone && (
        <Animated.View
          entering={FadeInUp.delay(400).duration(400)}
          style={styles.tipBox}
        >
          <View style={styles.tipIconWrap}>
            <LightbulbIcon size={14} color="#f1c40f" />
          </View>
          <Text style={styles.tipText}>
            Pueden votar antes si todos están listos
          </Text>
        </Animated.View>
      )}

      {/* Botón votar */}
      <Animated.View
        entering={FadeInUp.delay(500).duration(400)}
        style={styles.bottomSection}
      >
        <Pressable
          onPress={handleGoToVoting}
          style={({ pressed }) => [
            styles.voteButton,
            timerDone && styles.voteButtonUrgent,
            pressed && styles.btnPressed,
          ]}
        >
          <VoteIcon size={20} color="#fff" />
          <Text style={styles.actionBtnText}>IR A VOTAR</Text>
          <View style={styles.voteBtnArrow}>
            <ArrowRightIcon size={16} color="#ffffff80" />
          </View>
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
    top: -60,
    left: -80,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: "#00ffff",
    opacity: 0.03,
  },
  nebula2: {
    position: "absolute",
    bottom: -100,
    right: -60,
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: "#e74c3c",
    opacity: 0.025,
  },
  nebulaAccent: {
    position: "absolute",
    width: 150,
    height: 150,
    borderRadius: 75,
    opacity: 0.04,
  },

  // ── Intro Header ──
  introHeader: {
    alignItems: "center",
    marginBottom: 24,
  },
  headerIconCircle: {
    width: 46,
    height: 46,
    borderRadius: 15,
    backgroundColor: "#00ffff08",
    borderWidth: 1,
    borderColor: "#00ffff18",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    color: "#00ffff",
    fontSize: 26,
    fontWeight: "900",
    letterSpacing: 6,
  },
  titleDivider: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginVertical: 10,
  },
  titleLine: {
    width: 30,
    height: 1,
    backgroundColor: "#e74c3c40",
  },
  titleDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#e74c3c",
  },
  introSubtitle: {
    color: "#4a5568",
    fontSize: 14,
    fontWeight: "600",
  },

  // ── Intro Combined Card ──
  introCard: {
    width: "100%",
    backgroundColor: "#0a0b14",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#1a1b2e",
    paddingVertical: 24,
    paddingHorizontal: 22,
    marginBottom: 16,
    overflow: "hidden",
    position: "relative",
  },
  introCardAccent: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    opacity: 0.6,
  },
  starterSection: {
    alignItems: "center",
  },
  introLabelWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 16,
  },
  introLabelLine: {
    width: 20,
    height: 1,
    backgroundColor: "#ffffff0a",
  },
  introLabel: {
    color: "#555",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 3,
  },
  starterAvatarOuter: {
    width: 94,
    height: 94,
    borderRadius: 47,
    borderWidth: 1.5,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  starterAvatarCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 2.5,
    justifyContent: "center",
    alignItems: "center",
  },
  starterAvatarText: {
    fontSize: 30,
    fontWeight: "900",
  },
  starterName: {
    fontSize: 24,
    fontWeight: "900",
    letterSpacing: 1,
  },
  starterTag: {
    color: "#ffffff20",
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 1,
    marginTop: 4,
  },

  // ── Separator ──
  introSeparator: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginVertical: 20,
    paddingHorizontal: 20,
  },
  introSepLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#ffffff06",
  },
  introSepDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#ffffff10",
  },

  // ── Direction ──
  directionSection: {
    alignItems: "center",
  },
  directionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    width: "100%",
  },
  directionIconCircle: {
    width: 62,
    height: 62,
    borderRadius: 20,
    borderWidth: 1.5,
    justifyContent: "center",
    alignItems: "center",
  },
  directionInfo: {
    flex: 1,
    alignItems: "center",
  },
  directionArrowRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  directionText: {
    fontSize: 20,
    fontWeight: "900",
    letterSpacing: 4,
  },
  directionHint: {
    color: "#555",
    fontSize: 12,
    fontWeight: "600",
    marginTop: 4,
  },

  // ── Player chips ──
  playerChipsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    justifyContent: "center",
    width: "100%",
    marginBottom: 16,
  },
  playerChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#0a0b14",
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  playerChipDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  playerChipText: {
    color: "#555",
    fontSize: 12,
    fontWeight: "600",
    maxWidth: 70,
  },

  // ── Discussion Header (timer view) ──
  headerBlock: {
    width: "100%",
    marginBottom: 14,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  headerTextGroup: {
    flex: 1,
  },
  headerLabel: {
    color: "#00ffff60",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 3,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "900",
    letterSpacing: 4,
    marginTop: 1,
  },
  headerStatusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#2ecc7108",
    borderWidth: 1,
    borderColor: "#2ecc7125",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  headerStatusBadgeUrgent: {
    backgroundColor: "#e74c3c08",
    borderColor: "#e74c3c25",
  },
  headerStatusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  headerStatusText: {
    color: "#2ecc71",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1,
  },

  // ── Reglas ──
  rulesCard: {
    width: "100%",
    backgroundColor: "#0a0b1480",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#ffffff08",
    overflow: "hidden",
    marginBottom: 18,
  },
  rulesHeader: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  rulesHeaderText: {
    color: "#ffffff20",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 3,
  },
  ruleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    position: "relative",
  },
  ruleIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  ruleText: {
    color: "#8a95a5",
    fontSize: 12,
    flex: 1,
    fontWeight: "500",
    lineHeight: 17,
  },
  ruleAccent: {
    width: 3,
    height: 16,
    borderRadius: 2,
    opacity: 0.3,
  },
  ruleDivider: {
    height: 1,
    backgroundColor: "#ffffff05",
    marginHorizontal: 16,
  },

  // ── Timer ──
  timerSection: {
    marginBottom: 14,
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  timerGlow: {
    position: "absolute",
    width: 160,
    height: 160,
    borderRadius: 80,
    opacity: 0.04,
  },

  // ── Time Up ──
  timeUpCard: {
    width: "100%",
    backgroundColor: "#e74c3c08",
    borderWidth: 1,
    borderColor: "#e74c3c30",
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 12,
  },
  timeUpStripe: {
    height: 3,
    backgroundColor: "#e74c3c",
    opacity: 0.6,
  },
  timeUpContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 14,
  },
  timeUpEmoji: {
    fontSize: 28,
  },
  timeUpText: {
    color: "#e74c3c",
    fontSize: 17,
    fontWeight: "900",
    letterSpacing: 2,
  },
  timeUpSub: {
    color: "#e74c3c80",
    fontSize: 12,
    fontWeight: "600",
    marginTop: 2,
  },

  // ── Tip ──
  tipBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#f1c40f06",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#f1c40f10",
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 10,
    width: "100%",
  },
  tipIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: "#f1c40f10",
    justifyContent: "center",
    alignItems: "center",
  },
  tipText: {
    color: "#666",
    fontSize: 12,
    fontWeight: "600",
    flex: 1,
  },

  // ── Botones ──
  bottomSection: {
    width: "100%",
    marginTop: "auto",
    marginBottom: 30,
  },
  voteButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    width: "100%",
    height: 58,
    borderRadius: 18,
    backgroundColor: "#3498db",
    shadowColor: "#3498db",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 10,
  },
  voteButtonUrgent: {
    backgroundColor: "#e74c3c",
    shadowColor: "#e74c3c",
  },
  voteBtnArrow: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: "#ffffff10",
    justifyContent: "center",
    alignItems: "center",
  },
  startDiscussionBtn: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    width: "100%",
    height: 58,
    borderRadius: 18,
    backgroundColor: "#2ecc71",
    shadowColor: "#2ecc71",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 10,
  },
  actionBtnText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "900",
    letterSpacing: 3,
  },
  btnPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.97 }],
  },
});
