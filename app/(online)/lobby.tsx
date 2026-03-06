import { showAlert } from "@/components/CustomAlert";
import {
    AlienIcon,
    ArrowLeftIcon,
    BriefcaseIcon,
    CheckCircleIcon,
    ClockIcon,
    CopyIcon,
    CrownIcon,
    FilmIcon,
    GearIcon,
    GlobeIcon,
    MapPinIcon,
    PawIcon,
    RocketIcon,
    ShareIcon,
    SignalIcon,
    SoccerIcon,
    UsersIcon,
    UtensilsIcon,
    WifiIcon,
    WrenchIcon,
} from "@/components/Icons";
import { useAuth } from "@/context/AuthContext";
import { useOnlineGame } from "@/context/OnlineGameContext";
import { categories } from "@/data/categories";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect } from "react";
import {
    Clipboard,
    Dimensions,
    Pressable,
    ScrollView,
    Share,
    StyleSheet,
    Text,
    View,
} from "react-native";
import Animated, {
    Easing,
    FadeInDown,
    FadeInUp,
    SlideInRight,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withRepeat,
    withSequence,
    withTiming,
} from "react-native-reanimated";

const { width: SCREEN_W } = Dimensions.get("window");

// ── Design Tokens ──────────────────────────────────────────────
const BG = "#060712";
const CARD = "#0c0e1e";
const CARD_ELEVATED = "#10132a";
const BORDER = "#1a1d38";
const BORDER_LIGHT = "#252950";
const CYAN = "#00e5ff";
const RED = "#ff4757";
const GOLD = "#ffc312";
const GREEN = "#00d68f";
const PURPLE = "#a855f7";
const BLUE = "#3b82f6";
const WHITE = "#eef0ff";
const MUTED = "#3d4a6b";

const PLAYER_COLORS = [
  "#ff4757",
  "#3498db",
  "#00d68f",
  "#ffc312",
  "#a855f7",
  "#e67e22",
  "#1abc9c",
  "#e91e63",
  "#00bcd4",
  "#ff5722",
];
const TIME_OPTIONS = [60, 120, 180, 300];

// ── Category → SVG Icon mapping ───────────────────────────────
const CATEGORY_ICONS: Record<
  string,
  React.ComponentType<{ size?: number; color?: string }>
> = {
  Animales: PawIcon,
  Paises: GlobeIcon,
  Comidas: UtensilsIcon,
  Deportes: SoccerIcon,
  Profesiones: BriefcaseIcon,
  Peliculas: FilmIcon,
  Lugares: MapPinIcon,
  Objetos: WrenchIcon,
};

// ── Animated pulsing dot ───────────────────────────────────────
function PulseDot({ color }: { color: string }) {
  const scale = useSharedValue(1);
  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.8, { duration: 800, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 800, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      true,
    );
  }, []);
  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: 0.45,
  }));
  return (
    <View
      style={{
        width: 10,
        height: 10,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Animated.View
        style={[
          { width: 10, height: 10, borderRadius: 5, backgroundColor: color },
          style,
        ]}
      />
      <View
        style={{
          position: "absolute",
          width: 6,
          height: 6,
          borderRadius: 3,
          backgroundColor: color,
        }}
      />
    </View>
  );
}

// ── Floating particles background ──────────────────────────────
function FloatingParticle({
  delay,
  x,
  size,
  color,
}: {
  delay: number;
  x: number;
  size: number;
  color: string;
}) {
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(0);
  useEffect(() => {
    translateY.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(-120, {
            duration: 4000,
            easing: Easing.inOut(Easing.ease),
          }),
          withTiming(0, { duration: 4000, easing: Easing.inOut(Easing.ease) }),
        ),
        -1,
        true,
      ),
    );
    opacity.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(0.6, { duration: 2000 }),
          withTiming(0.15, { duration: 2000 }),
        ),
        -1,
        true,
      ),
    );
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
          bottom: "20%",
          left: x,
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

// ── Player row ─────────────────────────────────────────────────
function PlayerRow({
  player,
  color,
  isMe,
  isPlayerHost,
  index,
}: {
  player: { id: string; display_name: string };
  color: string;
  isMe: boolean;
  isPlayerHost: boolean;
  index: number;
}) {
  return (
    <Animated.View
      entering={SlideInRight.delay(index * 80)
        .duration(400)
        .springify()}
      style={[playerStyles.row, isMe && playerStyles.rowMe]}
    >
      {/* Avatar */}
      <View style={[playerStyles.avatar, { borderColor: color }]}>
        <View
          style={[playerStyles.avatarInner, { backgroundColor: color + "20" }]}
        >
          <Text style={[playerStyles.avatarLetter, { color }]}>
            {player.display_name[0]?.toUpperCase() ?? "?"}
          </Text>
        </View>
        {/* Online indicator */}
        <View style={playerStyles.onlineDot} />
      </View>

      <View style={playerStyles.info}>
        <Text style={playerStyles.name} numberOfLines={1}>
          {player.display_name}
        </Text>
        <View style={playerStyles.badgeRow}>
          {isMe && (
            <View
              style={[
                playerStyles.badge,
                { backgroundColor: CYAN + "15", borderColor: CYAN + "40" },
              ]}
            >
              <Text style={[playerStyles.badgeTxt, { color: CYAN }]}>TÚ</Text>
            </View>
          )}
          {isPlayerHost && (
            <View
              style={[
                playerStyles.badge,
                { backgroundColor: GOLD + "15", borderColor: GOLD + "40" },
              ]}
            >
              <CrownIcon size={10} color={GOLD} />
              <Text style={[playerStyles.badgeTxt, { color: GOLD }]}>HOST</Text>
            </View>
          )}
        </View>
      </View>

      <View style={playerStyles.statusIcon}>
        <CheckCircleIcon size={18} color={GREEN} />
      </View>
    </Animated.View>
  );
}

const playerStyles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: CARD_ELEVATED,
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: BORDER,
    gap: 14,
  },
  rowMe: {
    borderColor: CYAN + "35",
    backgroundColor: CYAN + "08",
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 16,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  avatarInner: {
    width: 42,
    height: 42,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarLetter: {
    fontSize: 19,
    fontWeight: "900",
  },
  onlineDot: {
    position: "absolute",
    bottom: -2,
    right: -2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: GREEN,
    borderWidth: 2.5,
    borderColor: CARD_ELEVATED,
  },
  info: { flex: 1 },
  name: { color: WHITE, fontSize: 15, fontWeight: "700" },
  badgeRow: { flexDirection: "row", gap: 6, marginTop: 4 },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badgeTxt: { fontSize: 9, fontWeight: "900", letterSpacing: 1.2 },
  statusIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: GREEN + "12",
    justifyContent: "center",
    alignItems: "center",
  },
});

// ── Main Screen ────────────────────────────────────────────────
export default function LobbyScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const {
    room,
    players,
    loading,
    leaveRoom,
    updateRoomSettings,
    startOnlineGame,
  } = useOnlineGame();

  const isHost = room?.host_id === user?.id;
  const canStart = players.length >= 3;

  // Animated glow for code box
  const codeGlow = useSharedValue(0.4);
  const codePulse = useSharedValue(1);
  useEffect(() => {
    codeGlow.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 2200, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.3, { duration: 2200, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      true,
    );
    codePulse.value = withRepeat(
      withSequence(
        withTiming(1.02, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      true,
    );
  }, []);
  const codeGlowStyle = useAnimatedStyle(() => ({ opacity: codeGlow.value }));
  const codePulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: codePulse.value }],
  }));

  // Animated start button glow
  const startGlow = useSharedValue(0.5);
  useEffect(() => {
    if (canStart) {
      startGlow.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
          withTiming(0.4, {
            duration: 1200,
            easing: Easing.inOut(Easing.ease),
          }),
        ),
        -1,
        true,
      );
    }
  }, [canStart]);
  const startGlowStyle = useAnimatedStyle(() => ({ opacity: startGlow.value }));

  useEffect(() => {
    if (room && room.phase !== "lobby") {
      router.replace("/(online)/play");
    }
  }, [room?.phase]);

  const handleLeave = () =>
    showAlert(
      isHost ? "Cerrar sala" : "Salir de la sala",
      isHost
        ? "Si sales, la sala se cerrará para todos."
        : "¿Seguro que quieres salir?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Salir",
          style: "destructive",
          onPress: async () => {
            await leaveRoom();
            router.replace("/");
          },
        },
      ],
    );

  const handleShare = async () => {
    if (!room) return;
    try {
      await Share.share({
        message: `¡Únete a mi sala en The Impostor! 🕵️\n\nCódigo: ${room.id}\n\n¡Descarga la app y entra con este código!`,
      });
    } catch {}
  };

  const handleCopy = useCallback(() => {
    if (!room) return;
    Clipboard.setString(room.id);
    showAlert("Copiado", "Código copiado al portapapeles");
  }, [room]);

  const handleStart = async () => {
    if (!canStart) {
      showAlert("Pocos jugadores", "Necesitas al menos 3 jugadores.");
      return;
    }
    await startOnlineGame();
  };

  if (!room) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <AlienIcon size={64} color={RED + "80"} />
          <Text style={styles.errorText}>No hay sala activa</Text>
          <Pressable
            onPress={() => router.replace("/")}
            style={styles.backLink}
          >
            <Text style={styles.backLinkText}>Volver al inicio</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Background effects */}
      <View style={styles.blob1} />
      <View style={styles.blob2} />
      <View style={styles.blob3} />
      <View style={styles.blob4} />
      <FloatingParticle delay={0} x={SCREEN_W * 0.15} size={4} color={CYAN} />
      <FloatingParticle
        delay={600}
        x={SCREEN_W * 0.45}
        size={3}
        color={PURPLE}
      />
      <FloatingParticle
        delay={1200}
        x={SCREEN_W * 0.75}
        size={5}
        color={GOLD}
      />
      <FloatingParticle
        delay={1800}
        x={SCREEN_W * 0.3}
        size={3}
        color={GREEN}
      />
      <FloatingParticle
        delay={2400}
        x={SCREEN_W * 0.85}
        size={4}
        color={BLUE}
      />

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ── */}
        <Animated.View
          entering={FadeInDown.duration(400)}
          style={styles.header}
        >
          <Pressable
            onPress={handleLeave}
            style={({ pressed }) => [
              styles.iconBtn,
              pressed && { opacity: 0.6, transform: [{ scale: 0.92 }] },
            ]}
          >
            <ArrowLeftIcon size={20} color={WHITE} />
          </Pressable>

          <View style={styles.headerCenter}>
            <View style={styles.liveChip}>
              <PulseDot color={GREEN} />
              <SignalIcon size={12} color={GREEN} />
              <Text style={styles.liveText}>EN VIVO</Text>
            </View>
            <Text style={styles.headerTitle}>LOBBY</Text>
            <Text style={styles.headerSubtitle}>Sala de espera</Text>
          </View>

          <View style={[styles.iconBtn, styles.iconBtnRed]}>
            <AlienIcon size={24} color={RED} />
          </View>
        </Animated.View>

        {/* ── Room Code Card ── */}
        <Animated.View
          entering={FadeInDown.delay(100).duration(500)}
          style={styles.codeCard}
        >
          {/* animated top glow */}
          <Animated.View style={[styles.codeCardGlow, codeGlowStyle]} />
          {/* animated side glows */}
          <Animated.View style={[styles.codeCardGlowLeft, codeGlowStyle]} />
          <Animated.View style={[styles.codeCardGlowRight, codeGlowStyle]} />

          <View style={styles.codeLabelRow}>
            <View style={styles.codeLabelDot} />
            <Text style={styles.codeLabel}>CÓDIGO DE SALA</Text>
            <View style={styles.codeLabelDot} />
          </View>

          <Animated.View style={codePulseStyle}>
            <Text style={styles.codeText}>{room.id}</Text>
          </Animated.View>

          <Text style={styles.codeHint}>
            Comparte este código con tus amigos
          </Text>

          <View style={styles.codeActions}>
            <Pressable
              onPress={handleShare}
              style={({ pressed }) => [
                styles.codeBtn,
                styles.codeBtnPrimary,
                pressed && { opacity: 0.7, transform: [{ scale: 0.96 }] },
              ]}
            >
              <ShareIcon size={16} color={CYAN} />
              <Text style={[styles.codeBtnText, { color: CYAN }]}>
                COMPARTIR
              </Text>
            </Pressable>
            <Pressable
              onPress={handleCopy}
              style={({ pressed }) => [
                styles.codeBtn,
                styles.codeBtnSecondary,
                pressed && { opacity: 0.7, transform: [{ scale: 0.96 }] },
              ]}
            >
              <CopyIcon size={16} color={MUTED} />
              <Text style={[styles.codeBtnText, { color: MUTED }]}>COPIAR</Text>
            </Pressable>
          </View>
        </Animated.View>

        {/* ── Players ── */}
        <Animated.View
          entering={FadeInDown.delay(200).duration(500)}
          style={styles.sectionCard}
        >
          <View style={styles.sectionHeader}>
            <View
              style={[styles.sectionIcon, { backgroundColor: CYAN + "12" }]}
            >
              <UsersIcon size={18} color={CYAN} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.sectionTitle}>JUGADORES</Text>
              <Text style={styles.sectionSubtitle}>Conectados a la sala</Text>
            </View>
            <View style={styles.countBadge}>
              <Text style={styles.countText}>{players.length}</Text>
              <Text style={styles.countMax}>/10</Text>
            </View>
          </View>

          {/* Progress bar */}
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${Math.min((players.length / 10) * 100, 100)}%` },
              ]}
            />
            <View style={[styles.progressMin, { left: "30%" }]}>
              <View style={styles.progressMinLine} />
            </View>
          </View>
          <View style={styles.progressLabels}>
            <Text style={styles.progressLabelMuted}>Mín. 3</Text>
            <Text style={styles.progressLabelMuted}>Máx. 10</Text>
          </View>

          {players.map((player, index) => (
            <PlayerRow
              key={player.id}
              player={player}
              color={PLAYER_COLORS[index % PLAYER_COLORS.length]}
              isMe={player.user_id === user?.id}
              isPlayerHost={player.user_id === room.host_id}
              index={index}
            />
          ))}

          {players.length < 3 && (
            <Animated.View
              entering={FadeInDown.delay(350).duration(400)}
              style={styles.waitingRow}
            >
              <View style={styles.waitingIconWrap}>
                <WifiIcon size={16} color={GOLD} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.waitingText}>Esperando jugadores…</Text>
                <Text style={styles.waitingSubText}>
                  Faltan {3 - players.length} para empezar
                </Text>
              </View>
              <View style={styles.waitingDots}>
                <PulseDot color={GOLD} />
              </View>
            </Animated.View>
          )}
        </Animated.View>

        {/* ── Settings (Host only) ── */}
        {isHost && (
          <Animated.View
            entering={FadeInDown.delay(300).duration(500)}
            style={styles.sectionCard}
          >
            <View style={styles.sectionHeader}>
              <View
                style={[styles.sectionIcon, { backgroundColor: PURPLE + "15" }]}
              >
                <GearIcon size={18} color={PURPLE} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.sectionTitle}>CONFIGURACIÓN</Text>
                <Text style={styles.sectionSubtitle}>
                  Personaliza la partida
                </Text>
              </View>
            </View>

            {/* Category */}
            <View style={styles.settingBlock}>
              <Text style={styles.settingLabel}>CATEGORÍA</Text>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{ marginBottom: 8 }}
            >
              {categories.map((cat, idx) => {
                const active = room.category_index === idx;
                const iconColor = active ? PURPLE : "#555";
                const CategorySvg = CATEGORY_ICONS[cat.name];
                return (
                  <Pressable
                    key={cat.name}
                    onPress={() =>
                      updateRoomSettings(idx, room.discussion_time)
                    }
                    style={({ pressed }) => [
                      styles.chip,
                      active && styles.chipActive,
                      pressed && { transform: [{ scale: 0.95 }] },
                    ]}
                  >
                    <View
                      style={[
                        styles.chipIconWrap,
                        active && styles.chipIconWrapActive,
                      ]}
                    >
                      {CategorySvg ? (
                        <CategorySvg size={16} color={iconColor} />
                      ) : (
                        <Text style={styles.chipEmoji}>{cat.emoji}</Text>
                      )}
                    </View>
                    <Text
                      style={[styles.chipText, active && styles.chipTextActive]}
                    >
                      {cat.name}
                    </Text>
                    {active && <View style={styles.chipActiveDot} />}
                  </Pressable>
                );
              })}
            </ScrollView>

            {/* Time */}
            <View style={styles.settingBlock}>
              <Text style={[styles.settingLabel, { marginTop: 12 }]}>
                TIEMPO DE DISCUSIÓN
              </Text>
            </View>
            <View style={styles.timeRow}>
              {TIME_OPTIONS.map((t) => {
                const active = room.discussion_time === t;
                return (
                  <Pressable
                    key={t}
                    onPress={() => updateRoomSettings(room.category_index, t)}
                    style={({ pressed }) => [
                      styles.timeChip,
                      active && styles.timeChipActive,
                      pressed && { transform: [{ scale: 0.95 }] },
                    ]}
                  >
                    <ClockIcon size={16} color={active ? GOLD : "#555"} />
                    <Text
                      style={[styles.timeText, active && styles.timeTextActive]}
                    >
                      {Math.floor(t / 60)}
                    </Text>
                    <Text
                      style={[
                        styles.timeUnit,
                        active && { color: GOLD + "90" },
                      ]}
                    >
                      min
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </Animated.View>
        )}

        {/* ── Start button (Host) ── */}
        {isHost && (
          <Animated.View
            entering={FadeInUp.delay(400).duration(500).springify()}
            style={styles.startSection}
          >
            <View style={styles.startWrapper}>
              {canStart && (
                <Animated.View style={[styles.startGlow, startGlowStyle]} />
              )}
              <Pressable
                onPress={handleStart}
                disabled={!canStart || loading}
                style={({ pressed }) => [
                  styles.startBtn,
                  !canStart && styles.startBtnDisabled,
                  pressed && canStart && styles.startBtnPressed,
                ]}
              >
                <View style={styles.startBtnInner}>
                  <RocketIcon size={24} color={canStart ? "#fff" : "#555"} />
                  <Text
                    style={[styles.startText, !canStart && { color: "#555" }]}
                  >
                    INICIAR PARTIDA
                  </Text>
                </View>
              </Pressable>
            </View>

            {!canStart && (
              <View style={styles.startHintRow}>
                <UsersIcon size={14} color={MUTED} />
                <Text style={styles.startHint}>
                  Faltan {3 - players.length} jugador(es) para comenzar
                </Text>
              </View>
            )}
          </Animated.View>
        )}

        {/* ── Waiting (Guest) ── */}
        {!isHost && (
          <Animated.View
            entering={FadeInUp.delay(300).duration(500)}
            style={styles.waitingCard}
          >
            <View style={styles.waitingCardIcon}>
              <ClockIcon size={28} color={GOLD} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.waitingCardTitle}>Esperando al host</Text>
              <Text style={styles.waitingCardSub}>
                El host iniciará la partida en cualquier momento…
              </Text>
            </View>
            <PulseDot color={GOLD} />
          </Animated.View>
        )}

        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
}

// ── Styles ─────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG },
  scroll: { padding: 20, paddingTop: 55, paddingBottom: 40 },

  // Background blobs
  blob1: {
    position: "absolute",
    top: -120,
    right: -100,
    width: 340,
    height: 340,
    borderRadius: 170,
    backgroundColor: CYAN,
    opacity: 0.025,
  },
  blob2: {
    position: "absolute",
    bottom: -140,
    left: -100,
    width: 380,
    height: 380,
    borderRadius: 190,
    backgroundColor: BLUE,
    opacity: 0.03,
  },
  blob3: {
    position: "absolute",
    top: "40%",
    right: -80,
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: PURPLE,
    opacity: 0.02,
  },
  blob4: {
    position: "absolute",
    top: "65%",
    left: -60,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: RED,
    opacity: 0.02,
  },

  // Error
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  errorText: {
    color: RED,
    fontSize: 20,
    fontWeight: "800",
    textAlign: "center",
  },
  backLink: {
    backgroundColor: CYAN + "15",
    borderWidth: 1,
    borderColor: CYAN + "30",
    borderRadius: 14,
    paddingHorizontal: 24,
    paddingVertical: 12,
    marginTop: 8,
  },
  backLinkText: { color: CYAN, fontSize: 14, fontWeight: "700" },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    gap: 12,
  },
  iconBtn: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: "#ffffff06",
    borderWidth: 1,
    borderColor: "#ffffff10",
    justifyContent: "center",
    alignItems: "center",
  },
  iconBtnRed: { backgroundColor: RED + "10", borderColor: RED + "25" },
  headerCenter: { flex: 1, alignItems: "center" },
  liveChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: GREEN + "12",
    borderWidth: 1,
    borderColor: GREEN + "30",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginBottom: 6,
  },
  liveText: {
    color: GREEN,
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 2.5,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "900",
    letterSpacing: 8,
  },
  headerSubtitle: {
    color: MUTED,
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 1.5,
    marginTop: 2,
  },

  // Code card
  codeCard: {
    backgroundColor: CARD,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: CYAN + "25",
    padding: 28,
    alignItems: "center",
    marginBottom: 20,
    overflow: "hidden",
  },
  codeCardGlow: {
    position: "absolute",
    top: -40,
    alignSelf: "center",
    width: "70%",
    height: 80,
    backgroundColor: CYAN,
    borderRadius: 40,
    opacity: 0.5,
  },
  codeCardGlowLeft: {
    position: "absolute",
    top: "20%",
    left: -20,
    width: 50,
    height: 90,
    backgroundColor: CYAN,
    borderRadius: 25,
    opacity: 0.12,
  },
  codeCardGlowRight: {
    position: "absolute",
    top: "20%",
    right: -20,
    width: 50,
    height: 90,
    backgroundColor: PURPLE,
    borderRadius: 25,
    opacity: 0.1,
  },
  codeLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 14,
  },
  codeLabelDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: CYAN + "40",
  },
  codeLabel: {
    color: MUTED,
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 3.5,
  },
  codeText: {
    fontSize: 42,
    fontWeight: "900",
    color: CYAN,
    letterSpacing: 14,
    textShadowColor: CYAN + "60",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 24,
  },
  codeHint: {
    color: MUTED,
    fontSize: 11,
    fontWeight: "500",
    marginTop: 10,
    letterSpacing: 0.5,
  },
  codeActions: {
    flexDirection: "row",
    marginTop: 20,
    gap: 10,
    width: "100%",
  },
  codeBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 13,
    borderRadius: 14,
    borderWidth: 1,
  },
  codeBtnPrimary: {
    backgroundColor: CYAN + "10",
    borderColor: CYAN + "30",
  },
  codeBtnSecondary: {
    backgroundColor: "#ffffff06",
    borderColor: "#ffffff10",
  },
  codeBtnText: { fontSize: 11, fontWeight: "800", letterSpacing: 1.5 },

  // Section
  sectionCard: {
    backgroundColor: CARD,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 20,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 18,
  },
  sectionIcon: {
    width: 40,
    height: 40,
    borderRadius: 13,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "transparent",
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "900",
    letterSpacing: 2,
  },
  sectionSubtitle: {
    color: MUTED,
    fontSize: 11,
    fontWeight: "500",
    marginTop: 2,
  },
  countBadge: {
    flexDirection: "row",
    alignItems: "baseline",
    backgroundColor: CYAN + "0d",
    borderWidth: 1,
    borderColor: CYAN + "20",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  countText: { color: CYAN, fontSize: 16, fontWeight: "900" },
  countMax: { color: MUTED, fontSize: 11, fontWeight: "700" },

  // Progress bar
  progressBar: {
    height: 4,
    borderRadius: 2,
    backgroundColor: BORDER,
    marginBottom: 8,
    overflow: "visible",
    position: "relative",
  },
  progressFill: {
    height: 4,
    borderRadius: 2,
    backgroundColor: CYAN,
    opacity: 0.7,
  },
  progressMin: {
    position: "absolute",
    top: -4,
    height: 12,
    width: 1,
    backgroundColor: GREEN + "50",
  },
  progressMinLine: {
    width: 1,
    height: 12,
    backgroundColor: GREEN + "60",
  },
  progressLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  progressLabelMuted: {
    color: MUTED,
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 1,
  },

  // Waiting row (inside players)
  waitingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: GOLD + "08",
    borderWidth: 1,
    borderColor: GOLD + "20",
    borderRadius: 14,
    padding: 14,
    marginTop: 6,
  },
  waitingIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: GOLD + "15",
    justifyContent: "center",
    alignItems: "center",
  },
  waitingText: { color: GOLD, fontSize: 13, fontWeight: "700" },
  waitingSubText: {
    color: MUTED,
    fontSize: 11,
    fontWeight: "500",
    marginTop: 2,
  },
  waitingDots: { marginLeft: 4 },

  // Settings
  settingBlock: { marginBottom: 10 },
  settingLabel: {
    color: MUTED,
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 3,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: CARD_ELEVATED,
    borderWidth: 1,
    borderColor: BORDER,
    marginRight: 10,
  },
  chipActive: {
    borderColor: PURPLE + "60",
    backgroundColor: PURPLE + "12",
  },
  chipActiveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: PURPLE,
  },
  chipEmoji: { fontSize: 17 },
  chipIconWrap: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: "#ffffff08",
    justifyContent: "center" as const,
    alignItems: "center" as const,
  },
  chipIconWrapActive: {
    backgroundColor: PURPLE + "18",
  },
  chipText: { color: "#666", fontSize: 13, fontWeight: "700" },
  chipTextActive: { color: PURPLE, fontWeight: "800" },
  timeRow: { flexDirection: "row", gap: 10 },
  timeChip: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: CARD_ELEVATED,
    borderWidth: 1,
    borderColor: BORDER,
    alignItems: "center",
    gap: 4,
  },
  timeChipActive: {
    borderColor: GOLD + "50",
    backgroundColor: GOLD + "0d",
  },
  timeText: { color: "#666", fontSize: 18, fontWeight: "900" },
  timeTextActive: { color: GOLD },
  timeUnit: {
    color: "#444",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1,
  },

  // Start
  startSection: { alignItems: "center", marginTop: 6 },
  startWrapper: { width: "100%", position: "relative" },
  startGlow: {
    position: "absolute",
    top: -8,
    left: -8,
    right: -8,
    bottom: -8,
    borderRadius: 24,
    backgroundColor: RED + "30",
  },
  startBtn: {
    width: "100%",
    height: 64,
    borderRadius: 20,
    backgroundColor: RED,
    borderWidth: 1.5,
    borderColor: "#ff6b6b",
    overflow: "hidden",
    shadowColor: RED,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 14,
  },
  startBtnInner: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 14,
  },
  startBtnDisabled: {
    backgroundColor: "#13151f",
    borderColor: BORDER,
    shadowOpacity: 0,
    elevation: 0,
  },
  startBtnPressed: {
    transform: [{ translateY: 3 }],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
  },
  startText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: 4,
  },
  startHintRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 16,
    paddingHorizontal: 16,
  },
  startHint: { color: MUTED, fontSize: 12, fontWeight: "600" },

  // Waiting card (guest)
  waitingCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    backgroundColor: CARD,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: GOLD + "20",
    padding: 22,
    marginTop: 6,
  },
  waitingCardIcon: {
    width: 52,
    height: 52,
    borderRadius: 18,
    backgroundColor: GOLD + "10",
    borderWidth: 1,
    borderColor: GOLD + "20",
    justifyContent: "center",
    alignItems: "center",
  },
  waitingCardTitle: { color: GOLD, fontSize: 15, fontWeight: "800" },
  waitingCardSub: {
    color: MUTED,
    fontSize: 12,
    fontWeight: "500",
    marginTop: 4,
    lineHeight: 18,
  },
});
