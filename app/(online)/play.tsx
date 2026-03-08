import { showAlert } from "@/components/CustomAlert";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ChatIcon,
  CheckCircleIcon,
  ClockIcon,
  HomeIcon,
  KnifeIcon,
  LightbulbIcon,
  RotateCcwIcon,
  RotateCwIcon,
  ShieldIcon,
  SkullIcon,
  StarIcon,
  TargetIcon,
  TrophyIcon,
  VoteIcon,
} from "@/components/Icons";
import { useAuth } from "@/context/AuthContext";
import { useOnlineGame } from "@/context/OnlineGameContext";
import { categories } from "@/data/categories";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, {
  FadeInDown,
  FadeInUp,
  SlideInRight,
  ZoomIn,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

// ── Design Tokens ──
const BG = "#060712";
const CARD = "#0c0e1e";
const CARD_BORDER = "#151832";
const CYAN = "#00e5ff";
const RED = "#ff4757";
const GOLD = "#ffc312";
const GREEN = "#00d68f";
const PURPLE = "#a855f7";
const MUTED = "#5a6a80";
const TEXT_DIM = "#8899aa";

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

// ── Floating Particle ──
function FloatingParticle({
  delay,
  startX,
  startY,
  color,
  size,
}: {
  delay: number;
  startX: number;
  startY: number;
  color: string;
  size: number;
}) {
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      opacity.value = withRepeat(
        withSequence(
          withTiming(0.6, { duration: 2000 }),
          withTiming(0.1, { duration: 2000 }),
        ),
        -1,
        true,
      );
      translateY.value = withRepeat(
        withSequence(
          withTiming(-30, { duration: 3000 }),
          withTiming(0, { duration: 3000 }),
        ),
        -1,
        true,
      );
    }, delay);
    return () => clearTimeout(timeout);
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          left: startX,
          top: startY,
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
        },
        animStyle,
      ]}
    />
  );
}

// ── Pulsing Glow ──
function PulseRing({ color, size = 120 }: { color: string; size?: number }) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.4);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.3, { duration: 1200 }),
        withTiming(1, { duration: 1200 }),
      ),
      -1,
      true,
    );
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.1, { duration: 1200 }),
        withTiming(0.4, { duration: 1200 }),
      ),
      -1,
      true,
    );
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: 2,
          borderColor: color,
        },
        animStyle,
      ]}
    />
  );
}

// ── Timer progress arc (simple bar version) ──
function TimerBar({ elapsed, total }: { elapsed: number; total: number }) {
  const pct = total > 0 ? Math.max(0, (elapsed / total) * 100) : 0;
  const isLow = elapsed <= 30;
  const barColor = isLow ? RED : GOLD;

  return (
    <View style={s.timerBarOuter}>
      <View
        style={[
          s.timerBarFill,
          { width: `${pct}%`, backgroundColor: barColor },
        ]}
      />
    </View>
  );
}

export default function OnlinePlayScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const {
    room,
    players,
    myPlayer,
    leaveRoom,
    disconnectFromRoom,
    castOnlineVote,
    setOnlinePhase,
  } = useOnlineGame();

  const [timer, setTimer] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const isHost = room?.host_id === user?.id;

  // Elegir jugador y dirección aleatorios al montar
  const { starterPlayer, direction } = useMemo(() => {
    const idx = Math.floor(Math.random() * players.length);
    const dir = Math.random() < 0.5 ? "left" : "right";
    return {
      starterPlayer: players[idx],
      direction: dir as "left" | "right",
    };
  }, []);

  // Timer for discussion phase
  useEffect(() => {
    if (room?.phase === "discussion") {
      setTimer(room.discussion_time);
      timerRef.current = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            if (isHost) {
              setOnlinePhase("voting");
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [room?.phase]);

  // Navigate back if room is null (e.g. host deleted room or got kicked)
  // Only redirect if not in results phase (results handles its own navigation)
  const roomPhaseRef = useRef(room?.phase);
  useEffect(() => {
    roomPhaseRef.current = room?.phase;
  }, [room?.phase]);

  useEffect(() => {
    if (!room && roomPhaseRef.current !== "results") {
      router.replace("/");
    }
  }, [room]);

  if (!room || !myPlayer) {
    return (
      <View style={s.container}>
        <Text style={{ color: "#fff", textAlign: "center", marginTop: 100 }}>
          Cargando...
        </Text>
      </View>
    );
  }

  const category = categories[room.category_index];
  const allVoted = players.every((p) => p.has_voted);

  // Check results
  useEffect(() => {
    if (room.phase === "voting" && allVoted && isHost) {
      setOnlinePhase("results");
    }
  }, [allVoted, room.phase]);

  const formatTime = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleVote = async (targetUserId: string) => {
    if (myPlayer.has_voted) return;
    if (targetUserId === user?.id) {
      showAlert("Error", "No puedes votar por ti mismo.");
      return;
    }
    await castOnlineVote(targetUserId);
  };

  const handleEndGame = () => {
    disconnectFromRoom();
    router.replace("/");
  };

  // ═══════════════════════════════════════════
  //  ROLE REVEAL PHASE
  // ═══════════════════════════════════════════
  if (room.phase === "roleReveal") {
    const isImpostor = myPlayer.is_impostor;
    const accent = isImpostor ? RED : GREEN;

    // Generar pista para el impostor (misma lógica que el modo local)
    const firstLetter = room.secret_word.charAt(0).toUpperCase();
    const impostorHint = `${category.emoji} ${category.name} · Empieza con "${firstLetter}" · ${room.secret_word.length} letras`;

    return (
      <View style={s.container}>
        {/* Background nebulas */}
        <View
          style={[s.nebula, { top: -100, right: -80, backgroundColor: accent }]}
        />
        <View
          style={[
            s.nebula,
            { bottom: -60, left: -80, backgroundColor: PURPLE, opacity: 0.025 },
          ]}
        />

        {/* Particles */}
        <FloatingParticle
          delay={0}
          startX={30}
          startY={100}
          color={accent}
          size={3}
        />
        <FloatingParticle
          delay={400}
          startX={280}
          startY={200}
          color={CYAN}
          size={2}
        />
        <FloatingParticle
          delay={800}
          startX={150}
          startY={350}
          color={accent}
          size={4}
        />
        <FloatingParticle
          delay={1200}
          startX={60}
          startY={500}
          color={GOLD}
          size={2}
        />
        <FloatingParticle
          delay={600}
          startX={320}
          startY={420}
          color={PURPLE}
          size={3}
        />

        <ScrollView contentContainerStyle={s.scroll}>
          <Animated.View
            entering={ZoomIn.duration(700)}
            style={s.revealSection}
          >
            {/* Role badge with pulse ring */}
            <View style={s.badgeContainer}>
              <PulseRing color={accent} size={140} />
              <View
                style={[
                  s.roleBadge,
                  {
                    backgroundColor: `${accent}15`,
                    borderColor: `${accent}50`,
                    shadowColor: accent,
                  },
                ]}
              >
                {isImpostor ? (
                  <KnifeIcon size={48} color={accent} />
                ) : (
                  <ShieldIcon size={48} color={accent} />
                )}
              </View>
            </View>

            <Animated.Text
              entering={FadeInDown.delay(300).duration(500)}
              style={[s.roleTitle, { color: accent }]}
            >
              {isImpostor ? "ERES EL IMPOSTOR" : "ERES TRIPULANTE"}
            </Animated.Text>

            <Animated.Text
              entering={FadeInDown.delay(500).duration(400)}
              style={s.roleSubtitle}
            >
              {isImpostor
                ? "No conoces la palabra. ¡Finge saberla!"
                : "Conoces la palabra. ¡Encuentra al impostor!"}
            </Animated.Text>

            {/* Word card */}
            <Animated.View
              entering={FadeInUp.delay(600).duration(500)}
              style={{ width: "100%" }}
            >
              {!isImpostor ? (
                <View style={[s.wordCard, { borderColor: `${GREEN}25` }]}>
                  <View style={[s.wordGlow, { backgroundColor: GREEN }]} />
                  <Text style={s.wordLabel}>TU PALABRA</Text>
                  <Text style={s.wordText}>{myPlayer.word}</Text>
                  <View style={s.wordCategoryRow}>
                    <View style={[s.categoryDot, { backgroundColor: GREEN }]} />
                    <Text style={s.wordCategory}>{category.name}</Text>
                  </View>
                </View>
              ) : (
                <View style={[s.wordCard, { borderColor: `${RED}25` }]}>
                  <View style={[s.wordGlow, { backgroundColor: RED }]} />
                  <SkullIcon size={28} color={RED} />
                  <Text style={s.wordLabel}>TU MISIÓN</Text>
                  <Text style={[s.wordText, { color: RED, fontSize: 20 }]}>
                    Descubre la palabra secreta
                  </Text>
                  <View style={s.wordCategoryRow}>
                    <View style={[s.categoryDot, { backgroundColor: RED }]} />
                    <Text style={s.wordCategory}>{category.name}</Text>
                  </View>

                  {/* Pista para el impostor */}
                  <View style={s.hintBox}>
                    <View style={s.hintIconWrap}>
                      <LightbulbIcon size={16} color={GOLD} />
                    </View>
                    <View style={s.hintContent}>
                      <Text style={s.hintLabel}>PISTA</Text>
                      <Text style={s.hintText}>{impostorHint}</Text>
                    </View>
                  </View>
                </View>
              )}
            </Animated.View>

            {/* Action button or waiting text */}
            <Animated.View
              entering={FadeInUp.delay(800).duration(500)}
              style={{ width: "100%" }}
            >
              {isHost ? (
                <Pressable
                  onPress={() => setOnlinePhase("discussion")}
                  style={({ pressed }) => [
                    s.actionBtn,
                    { backgroundColor: CYAN, shadowColor: CYAN },
                    pressed && { opacity: 0.8, transform: [{ scale: 0.97 }] },
                  ]}
                >
                  <ChatIcon size={20} color={BG} />
                  <Text style={[s.actionBtnText, { color: BG }]}>
                    INICIAR DISCUSIÓN
                  </Text>
                </Pressable>
              ) : (
                <View style={s.waitCard}>
                  <ClockIcon size={16} color={MUTED} />
                  <Text style={s.waitText}>
                    Esperando a que el host inicie la discusión...
                  </Text>
                </View>
              )}
            </Animated.View>
          </Animated.View>
        </ScrollView>
      </View>
    );
  }

  // ═══════════════════════════════════════════
  //  DISCUSSION PHASE
  // ═══════════════════════════════════════════
  if (room.phase === "discussion") {
    const isLow = timer <= 30;

    return (
      <View style={s.container}>
        <View
          style={[s.nebula, { top: -100, right: -80, backgroundColor: GOLD }]}
        />
        <View
          style={[
            s.nebula,
            { bottom: -60, left: -80, backgroundColor: CYAN, opacity: 0.025 },
          ]}
        />

        <FloatingParticle
          delay={0}
          startX={40}
          startY={120}
          color={GOLD}
          size={3}
        />
        <FloatingParticle
          delay={500}
          startX={290}
          startY={250}
          color={CYAN}
          size={2}
        />
        <FloatingParticle
          delay={1000}
          startX={170}
          startY={400}
          color={PURPLE}
          size={3}
        />

        <ScrollView contentContainerStyle={s.scroll}>
          {/* Phase header */}
          <Animated.View
            entering={FadeInDown.duration(500)}
            style={s.phaseHeader}
          >
            <View style={s.phaseIconRow}>
              <View
                style={[
                  s.phaseIconBubble,
                  { backgroundColor: `${CYAN}15`, borderColor: `${CYAN}30` },
                ]}
              >
                <ChatIcon size={24} color={CYAN} />
              </View>
            </View>
            <Text style={s.phaseTitle}>DISCUSIÓN</Text>
            <Text style={s.phaseSubtitle}>
              Describan la palabra sin decirla directamente
            </Text>
          </Animated.View>

          {/* Starter + Direction card */}
          <Animated.View entering={FadeInDown.delay(150).duration(400)}>
            <View style={s.starterCard}>
              <View style={s.starterCardAccent} />

              {/* Who starts */}
              <View style={s.starterSection}>
                <View style={s.starterLabelWrap}>
                  <View style={s.starterLabelLine} />
                  <Text style={s.starterLabel}>COMIENZA</Text>
                  <View style={s.starterLabelLine} />
                </View>

                {starterPlayer &&
                  (() => {
                    const starterIdx = players.indexOf(starterPlayer);
                    const starterColor =
                      PLAYER_COLORS[starterIdx % PLAYER_COLORS.length];
                    return (
                      <>
                        <View
                          style={[
                            s.starterAvatarOuter,
                            { borderColor: starterColor + "30" },
                          ]}
                        >
                          <View
                            style={[
                              s.starterAvatarCircle,
                              {
                                borderColor: starterColor,
                                backgroundColor: starterColor + "12",
                              },
                            ]}
                          >
                            <Text
                              style={[
                                s.starterAvatarText,
                                { color: starterColor },
                              ]}
                            >
                              {starterPlayer.display_name
                                .charAt(0)
                                .toUpperCase()}
                            </Text>
                          </View>
                        </View>
                        <Text style={[s.starterName, { color: starterColor }]}>
                          {starterPlayer.display_name}
                        </Text>
                      </>
                    );
                  })()}
              </View>

              {/* Separator */}
              <View style={s.starterSeparator}>
                <View style={s.starterSepLine} />
                <View style={s.starterSepDot} />
                <View style={s.starterSepLine} />
              </View>

              {/* Direction */}
              <View style={s.starterSection}>
                <View style={s.starterLabelWrap}>
                  <View style={s.starterLabelLine} />
                  <Text style={s.starterLabel}>DIRECCIÓN</Text>
                  <View style={s.starterLabelLine} />
                </View>

                {(() => {
                  const dirColor = direction === "left" ? "#3498db" : GREEN;
                  return (
                    <View style={s.directionRow}>
                      <View
                        style={[
                          s.directionIconCircle,
                          {
                            backgroundColor: dirColor + "10",
                            borderColor: dirColor + "30",
                          },
                        ]}
                      >
                        {direction === "left" ? (
                          <RotateCcwIcon size={28} color={dirColor} />
                        ) : (
                          <RotateCwIcon size={28} color={dirColor} />
                        )}
                      </View>
                      <View style={s.directionInfo}>
                        <View style={s.directionArrowRow}>
                          {direction === "left" ? (
                            <>
                              <ArrowLeftIcon size={16} color={dirColor} />
                              <Text
                                style={[s.directionText, { color: dirColor }]}
                              >
                                IZQUIERDA
                              </Text>
                              <ArrowLeftIcon size={16} color={dirColor} />
                            </>
                          ) : (
                            <>
                              <ArrowRightIcon size={16} color={dirColor} />
                              <Text
                                style={[s.directionText, { color: dirColor }]}
                              >
                                DERECHA
                              </Text>
                              <ArrowRightIcon size={16} color={dirColor} />
                            </>
                          )}
                        </View>
                        <Text style={s.directionHintText}>
                          {direction === "left"
                            ? "Sentido antihorario"
                            : "Sentido horario"}
                        </Text>
                      </View>
                    </View>
                  );
                })()}
              </View>
            </View>
          </Animated.View>

          {/* Timer card */}
          <Animated.View
            entering={FadeInDown.delay(300).duration(400)}
            style={s.timerCard}
          >
            <View style={s.timerTopRow}>
              <ClockIcon size={18} color={isLow ? RED : GOLD} />
              <Text style={[s.timerText, isLow && { color: RED }]}>
                {formatTime(timer)}
              </Text>
            </View>
            <TimerBar elapsed={timer} total={room.discussion_time} />
          </Animated.View>

          {/* Discussion info card */}
          <Animated.View entering={FadeInDown.delay(450).duration(400)}>
            <View style={s.infoCard}>
              <Text style={s.infoCardText}>
                Debatan entre ustedes para encontrar al impostor.{"\n"}
                ¡El impostor debe fingir conocer la palabra!
              </Text>
            </View>
          </Animated.View>

          {/* Role reminder */}
          <Animated.View entering={SlideInRight.delay(600).duration(400)}>
            <View
              style={[
                s.roleReminder,
                {
                  borderColor: myPlayer.is_impostor ? `${RED}30` : `${GREEN}30`,
                  backgroundColor: myPlayer.is_impostor
                    ? `${RED}08`
                    : `${GREEN}08`,
                },
              ]}
            >
              {myPlayer.is_impostor ? (
                <>
                  <KnifeIcon size={20} color={RED} />
                  <View style={s.roleReminderInfo}>
                    <Text style={[s.roleReminderTitle, { color: RED }]}>
                      IMPOSTOR
                    </Text>
                    <Text style={s.roleReminderSub}>
                      Finge saber la palabra
                    </Text>
                  </View>
                </>
              ) : (
                <>
                  <ShieldIcon size={20} color={GREEN} />
                  <View style={s.roleReminderInfo}>
                    <Text style={[s.roleReminderTitle, { color: GREEN }]}>
                      TRIPULANTE
                    </Text>
                    <Text style={s.roleReminderSub}>{myPlayer.word}</Text>
                  </View>
                </>
              )}
            </View>
          </Animated.View>

          {/* Host skip button */}
          {isHost && (
            <Animated.View
              entering={FadeInUp.delay(700).duration(400)}
              style={{ marginTop: 24 }}
            >
              <Pressable
                onPress={() => setOnlinePhase("voting")}
                style={({ pressed }) => [
                  s.actionBtn,
                  { backgroundColor: RED, shadowColor: RED },
                  pressed && { opacity: 0.8, transform: [{ scale: 0.97 }] },
                ]}
              >
                <VoteIcon size={20} color="#fff" />
                <Text style={s.actionBtnText}>PASAR A VOTACIÓN</Text>
              </Pressable>
            </Animated.View>
          )}
        </ScrollView>
      </View>
    );
  }

  // ═══════════════════════════════════════════
  //  VOTING PHASE
  // ═══════════════════════════════════════════
  if (room.phase === "voting") {
    const votedCount = players.filter((p) => p.has_voted).length;
    const totalPlayers = players.length;

    return (
      <View style={s.container}>
        <View
          style={[s.nebula, { top: -100, right: -80, backgroundColor: RED }]}
        />
        <View
          style={[
            s.nebula,
            { bottom: -60, left: -80, backgroundColor: PURPLE, opacity: 0.025 },
          ]}
        />

        <FloatingParticle
          delay={0}
          startX={50}
          startY={80}
          color={RED}
          size={3}
        />
        <FloatingParticle
          delay={700}
          startX={300}
          startY={200}
          color={PURPLE}
          size={2}
        />
        <FloatingParticle
          delay={1100}
          startX={100}
          startY={450}
          color={CYAN}
          size={3}
        />

        <ScrollView contentContainerStyle={s.scroll}>
          {/* Phase header */}
          <Animated.View
            entering={FadeInDown.duration(500)}
            style={s.phaseHeader}
          >
            <View style={s.phaseIconRow}>
              <View
                style={[
                  s.phaseIconBubble,
                  { backgroundColor: `${RED}15`, borderColor: `${RED}30` },
                ]}
              >
                <VoteIcon size={24} color={RED} />
              </View>
            </View>
            <Text style={s.phaseTitle}>VOTACIÓN</Text>
            <Text style={s.phaseSubtitle}>
              {myPlayer.has_voted
                ? "Tu voto ha sido registrado"
                : "Vota por quien crees que es el impostor"}
            </Text>
          </Animated.View>

          {/* Vote progress pill */}
          <Animated.View entering={FadeInDown.delay(150).duration(400)}>
            <View style={s.voteProgressPill}>
              <TargetIcon size={14} color={RED} />
              <Text style={s.voteProgressText}>
                {votedCount} / {totalPlayers} votos
              </Text>
              <View style={s.voteProgressBar}>
                <View
                  style={[
                    s.voteProgressFill,
                    { width: `${(votedCount / totalPlayers) * 100}%` },
                  ]}
                />
              </View>
            </View>
          </Animated.View>

          {/* Vote cards */}
          {players.map((player, index) => {
            if (player.user_id === user?.id) return null;
            const color = PLAYER_COLORS[index % PLAYER_COLORS.length];
            const isSelected =
              myPlayer.has_voted && myPlayer.vote_target === player.user_id;

            return (
              <Animated.View
                key={player.id}
                entering={SlideInRight.delay(200 + index * 100).duration(400)}
              >
                <Pressable
                  onPress={() => handleVote(player.user_id)}
                  disabled={myPlayer.has_voted}
                  style={({ pressed }) => [
                    s.voteCard,
                    pressed && { opacity: 0.7, transform: [{ scale: 0.98 }] },
                    isSelected && s.voteCardSelected,
                  ]}
                >
                  <View style={[s.voteAvatar, { backgroundColor: color }]}>
                    <Text style={s.voteAvatarText}>
                      {player.display_name.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                  <Text style={s.voteName}>{player.display_name}</Text>
                  {isSelected && (
                    <View style={s.votedBadge}>
                      <CheckCircleIcon size={14} color={RED} />
                      <Text style={s.votedBadgeText}>VOTADO</Text>
                    </View>
                  )}
                  {!myPlayer.has_voted && (
                    <View style={s.voteArrow}>
                      <TargetIcon size={16} color={MUTED} />
                    </View>
                  )}
                </Pressable>
              </Animated.View>
            );
          })}
        </ScrollView>
      </View>
    );
  }

  // ═══════════════════════════════════════════
  //  RESULTS PHASE
  // ═══════════════════════════════════════════
  if (room.phase === "results") {
    const maxVotes = Math.max(...players.map((p) => p.votes));
    const mostVoted = players.filter((p) => p.votes === maxVotes);
    const crewWins = mostVoted.some((p) => p.is_impostor);
    const impostor = players.find((p) => p.is_impostor);
    const accent = crewWins ? GREEN : RED;

    return (
      <View style={s.container}>
        <View
          style={[s.nebula, { top: -100, right: -80, backgroundColor: accent }]}
        />
        <View
          style={[
            s.nebula,
            { bottom: -60, left: -80, backgroundColor: GOLD, opacity: 0.025 },
          ]}
        />

        <FloatingParticle
          delay={0}
          startX={40}
          startY={80}
          color={accent}
          size={4}
        />
        <FloatingParticle
          delay={300}
          startX={300}
          startY={150}
          color={GOLD}
          size={3}
        />
        <FloatingParticle
          delay={600}
          startX={180}
          startY={300}
          color={CYAN}
          size={2}
        />
        <FloatingParticle
          delay={900}
          startX={70}
          startY={500}
          color={PURPLE}
          size={3}
        />
        <FloatingParticle
          delay={1200}
          startX={320}
          startY={400}
          color={accent}
          size={2}
        />

        <ScrollView contentContainerStyle={s.scroll}>
          <Animated.View
            entering={ZoomIn.duration(600)}
            style={s.resultsSection}
          >
            {/* Result badge */}
            <View style={s.badgeContainer}>
              <PulseRing color={accent} size={160} />
              <View
                style={[
                  s.resultBadge,
                  {
                    backgroundColor: `${accent}15`,
                    borderColor: `${accent}50`,
                    shadowColor: accent,
                  },
                ]}
              >
                {crewWins ? (
                  <TrophyIcon size={52} color={GOLD} />
                ) : (
                  <SkullIcon size={52} color={RED} />
                )}
              </View>
            </View>

            <Animated.Text
              entering={FadeInDown.delay(300).duration(500)}
              style={[s.resultTitle, { color: accent }]}
            >
              {crewWins ? "¡TRIPULACIÓN GANA!" : "¡IMPOSTOR GANA!"}
            </Animated.Text>

            <Animated.Text
              entering={FadeInDown.delay(450).duration(400)}
              style={s.resultSubtitle}
            >
              {crewWins
                ? "El impostor fue descubierto"
                : "El impostor engañó a todos"}
            </Animated.Text>

            {/* Impostor info card */}
            <Animated.View
              entering={FadeInUp.delay(600).duration(500)}
              style={{ width: "100%" }}
            >
              <View style={[s.resultInfoCard, { borderColor: `${RED}20` }]}>
                <View style={s.resultInfoRow}>
                  <KnifeIcon size={18} color={RED} />
                  <Text style={s.resultInfoLabel}>EL IMPOSTOR ERA</Text>
                </View>
                <Text style={s.resultImpostorName}>
                  {impostor?.display_name ?? "???"}
                </Text>

                <View style={s.resultDivider} />

                <View style={s.resultInfoRow}>
                  <StarIcon size={18} color={CYAN} />
                  <Text style={s.resultInfoLabel}>PALABRA SECRETA</Text>
                </View>
                <Text style={s.resultSecretWord}>{room.secret_word}</Text>
              </View>
            </Animated.View>

            {/* Vote summary */}
            <Animated.View
              entering={FadeInUp.delay(800).duration(500)}
              style={{ width: "100%" }}
            >
              <View style={s.voteSummaryCard}>
                <View style={s.voteSummaryHeader}>
                  <VoteIcon size={16} color={TEXT_DIM} />
                  <Text style={s.voteSummaryTitle}>RESULTADOS DE VOTOS</Text>
                </View>

                {players.map((p, i) => (
                  <Animated.View
                    key={p.id}
                    entering={SlideInRight.delay(900 + i * 80).duration(400)}
                    style={s.voteResultRow}
                  >
                    <View style={s.voteResultLeft}>
                      <View
                        style={[
                          s.voteResultDot,
                          {
                            backgroundColor: p.is_impostor
                              ? RED
                              : PLAYER_COLORS[i % PLAYER_COLORS.length],
                          },
                        ]}
                      />
                      <Text style={s.voteResultName}>{p.display_name}</Text>
                      {p.is_impostor && <KnifeIcon size={12} color={RED} />}
                    </View>
                    <View style={s.voteBar}>
                      <View
                        style={[
                          s.voteBarFill,
                          {
                            width:
                              maxVotes > 0
                                ? `${(p.votes / maxVotes) * 100}%`
                                : "0%",
                            backgroundColor: p.is_impostor ? RED : CYAN,
                          },
                        ]}
                      />
                    </View>
                    <Text
                      style={[
                        s.voteResultCount,
                        p.votes === maxVotes && { color: GOLD },
                      ]}
                    >
                      {p.votes}
                    </Text>
                  </Animated.View>
                ))}
              </View>
            </Animated.View>

            {/* End button */}
            <Animated.View
              entering={FadeInUp.delay(1100).duration(400)}
              style={{ width: "100%" }}
            >
              <Pressable
                onPress={handleEndGame}
                style={({ pressed }) => [
                  s.actionBtn,
                  {
                    backgroundColor: CARD,
                    borderColor: CARD_BORDER,
                    shadowColor: "transparent",
                  },
                  pressed && { opacity: 0.8, transform: [{ scale: 0.97 }] },
                ]}
              >
                <HomeIcon size={18} color={TEXT_DIM} />
                <Text style={[s.actionBtnText, { color: TEXT_DIM }]}>
                  VOLVER AL INICIO
                </Text>
              </Pressable>
            </Animated.View>
          </Animated.View>
        </ScrollView>
      </View>
    );
  }

  return null;
}

// ═══════════════════════════════════════════
//  STYLES
// ═══════════════════════════════════════════
const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
  },
  scroll: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 60,
  },
  nebula: {
    position: "absolute",
    width: 300,
    height: 300,
    borderRadius: 150,
    opacity: 0.035,
  },

  // ── Phase header ──
  phaseHeader: {
    alignItems: "center",
    marginBottom: 24,
    gap: 10,
  },
  phaseIconRow: {
    marginBottom: 4,
  },
  phaseIconBubble: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  phaseTitle: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "900",
    letterSpacing: 5,
  },
  phaseSubtitle: {
    color: TEXT_DIM,
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },

  // ── Role reveal ──
  revealSection: {
    alignItems: "center",
    paddingTop: 20,
    gap: 20,
  },
  badgeContainer: {
    width: 160,
    height: 160,
    justifyContent: "center",
    alignItems: "center",
  },
  roleBadge: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  roleTitle: {
    fontSize: 26,
    fontWeight: "900",
    letterSpacing: 4,
  },
  roleSubtitle: {
    color: TEXT_DIM,
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
  wordCard: {
    width: "100%",
    backgroundColor: CARD,
    borderRadius: 24,
    borderWidth: 1,
    padding: 28,
    alignItems: "center",
    gap: 12,
    overflow: "hidden",
  },
  wordGlow: {
    position: "absolute",
    top: -40,
    width: 200,
    height: 80,
    borderRadius: 100,
    opacity: 0.08,
  },
  wordLabel: {
    color: TEXT_DIM,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 4,
  },
  wordText: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "900",
  },
  wordCategoryRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 4,
  },
  categoryDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  wordCategory: {
    color: MUTED,
    fontSize: 13,
    fontWeight: "600",
  },

  // ── Action button ──
  actionBtn: {
    width: "100%",
    height: 58,
    borderRadius: 29,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
    borderColor: "transparent",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  actionBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "900",
    letterSpacing: 3,
  },

  // ── Wait card ──
  waitCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    justifyContent: "center",
    paddingVertical: 16,
  },
  waitText: {
    color: MUTED,
    fontSize: 14,
    textAlign: "center",
  },

  // ── Timer card ──
  timerCard: {
    backgroundColor: CARD,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    padding: 20,
    marginBottom: 16,
    alignItems: "center",
    gap: 12,
  },
  timerTopRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  timerText: {
    color: GOLD,
    fontSize: 32,
    fontWeight: "900",
    letterSpacing: 4,
  },
  timerBarOuter: {
    width: "100%",
    height: 6,
    borderRadius: 3,
    backgroundColor: `${CARD_BORDER}`,
    overflow: "hidden",
  },
  timerBarFill: {
    height: "100%",
    borderRadius: 3,
  },

  // ── Info card ──
  infoCard: {
    backgroundColor: CARD,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    padding: 24,
    marginBottom: 16,
  },
  infoCardText: {
    color: TEXT_DIM,
    fontSize: 15,
    lineHeight: 24,
    textAlign: "center",
  },

  // ── Role reminder ──
  roleReminder: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
  },
  roleReminderInfo: {
    flex: 1,
    gap: 2,
  },
  roleReminderTitle: {
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 2,
  },
  roleReminderSub: {
    color: TEXT_DIM,
    fontSize: 14,
    fontWeight: "600",
  },

  // ── Vote progress pill ──
  voteProgressPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: CARD,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    padding: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  voteProgressText: {
    color: TEXT_DIM,
    fontSize: 13,
    fontWeight: "700",
  },
  voteProgressBar: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: CARD_BORDER,
    overflow: "hidden",
  },
  voteProgressFill: {
    height: "100%",
    borderRadius: 2,
    backgroundColor: RED,
  },

  // ── Vote card ──
  voteCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: CARD,
    borderRadius: 18,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    gap: 14,
  },
  voteCardSelected: {
    borderColor: `${RED}60`,
    backgroundColor: `${RED}10`,
  },
  voteAvatar: {
    width: 46,
    height: 46,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  voteAvatarText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "900",
  },
  voteName: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    flex: 1,
  },
  votedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: `${RED}20`,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  votedBadgeText: {
    color: RED,
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1,
  },
  voteArrow: {
    opacity: 0.4,
  },

  // ── Results ──
  resultsSection: {
    alignItems: "center",
    paddingTop: 10,
    gap: 20,
  },
  resultBadge: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  resultTitle: {
    fontSize: 24,
    fontWeight: "900",
    letterSpacing: 3,
  },
  resultSubtitle: {
    color: TEXT_DIM,
    fontSize: 14,
    marginTop: -8,
  },

  // ── Result info card ──
  resultInfoCard: {
    backgroundColor: CARD,
    borderRadius: 24,
    borderWidth: 1,
    padding: 28,
    alignItems: "center",
    gap: 6,
  },
  resultInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 4,
  },
  resultInfoLabel: {
    color: TEXT_DIM,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 3,
  },
  resultImpostorName: {
    color: RED,
    fontSize: 24,
    fontWeight: "900",
    marginBottom: 4,
  },
  resultDivider: {
    width: "80%",
    height: 1,
    backgroundColor: CARD_BORDER,
    marginVertical: 10,
  },
  resultSecretWord: {
    color: CYAN,
    fontSize: 28,
    fontWeight: "900",
  },

  // ── Vote summary ──
  voteSummaryCard: {
    backgroundColor: CARD,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    padding: 22,
    gap: 14,
  },
  voteSummaryHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginBottom: 4,
  },
  voteSummaryTitle: {
    color: TEXT_DIM,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 3,
  },
  voteResultRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  voteResultLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    width: 110,
  },
  voteResultDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  voteResultName: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "700",
    flex: 1,
  },
  voteBar: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    backgroundColor: CARD_BORDER,
    overflow: "hidden",
  },
  voteBarFill: {
    height: "100%",
    borderRadius: 4,
  },
  voteResultCount: {
    color: TEXT_DIM,
    fontSize: 14,
    fontWeight: "900",
    width: 24,
    textAlign: "right",
  },

  // ── Starter + Direction card ──
  starterCard: {
    width: "100%",
    backgroundColor: CARD,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    paddingVertical: 20,
    paddingHorizontal: 18,
    marginBottom: 16,
    overflow: "hidden",
    position: "relative",
  },
  starterCardAccent: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: CYAN,
    opacity: 0.5,
  },
  starterSection: {
    alignItems: "center",
  },
  starterLabelWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 14,
  },
  starterLabelLine: {
    width: 20,
    height: 1,
    backgroundColor: "#ffffff0a",
  },
  starterLabel: {
    color: MUTED,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 3,
  },
  starterAvatarOuter: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 1.5,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  starterAvatarCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    borderWidth: 2.5,
    justifyContent: "center",
    alignItems: "center",
  },
  starterAvatarText: {
    fontSize: 24,
    fontWeight: "900",
  },
  starterName: {
    fontSize: 20,
    fontWeight: "900",
    letterSpacing: 1,
  },
  starterSeparator: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginVertical: 16,
    paddingHorizontal: 20,
  },
  starterSepLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#ffffff06",
  },
  starterSepDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#ffffff10",
  },
  directionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    width: "100%",
  },
  directionIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 18,
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
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: 4,
  },
  directionHintText: {
    color: MUTED,
    fontSize: 12,
    fontWeight: "600",
    marginTop: 4,
  },

  // ── Pista del impostor ──
  hintBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    backgroundColor: `${GOLD}08`,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: `${GOLD}18`,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginTop: 8,
    width: "100%",
  },
  hintIconWrap: {
    width: 30,
    height: 30,
    borderRadius: 9,
    backgroundColor: `${GOLD}10`,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 1,
  },
  hintContent: {
    flex: 1,
  },
  hintLabel: {
    color: `${GOLD}80`,
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 2,
    marginBottom: 3,
  },
  hintText: {
    color: GOLD,
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 18,
  },
});
