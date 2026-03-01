import {
  AlienIcon,
  ArrowLeftIcon,
  BriefcaseIcon,
  ClockIcon,
  CloseIcon,
  DownloadIcon,
  FilmIcon,
  FolderIcon,
  GlobeIcon,
  MapPinIcon,
  PawIcon,
  PlusIcon,
  RocketIcon,
  SaveIcon,
  SoccerIcon,
  TrashIcon,
  UserIcon,
  UsersIcon,
  UtensilsIcon,
  WrenchIcon,
} from "@/components/Icons";
import { useGame } from "@/context/GameContext";
import { categories } from "@/data/categories";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Modal,
  Platform,
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
  SlideInRight,
} from "react-native-reanimated";

const { width } = Dimensions.get("window");
const TIME_OPTIONS = [60, 120, 180, 300];
const GROUPS_STORAGE_KEY = "@impostor_saved_groups";

type SavedGroup = {
  id: string;
  name: string;
  players: string[];
  createdAt: number;
};

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

// ── Mapeo de categoría → componente de icono SVG ──
const CATEGORY_ICONS: Record<
  string,
  (props: { size?: number; color?: string }) => React.JSX.Element
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

export default function SetupScreen() {
  const router = useRouter();
  const {
    state,
    addPlayer,
    removePlayer,
    setPlayers,
    setCategoryIndex,
    setDiscussionTime,
    startGame,
  } = useGame();
  const [playerName, setPlayerName] = useState("");

  // ── Grupos guardados ──
  const [savedGroups, setSavedGroups] = useState<SavedGroup[]>([]);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [showSaveInput, setShowSaveInput] = useState(false);

  // Cargar grupos al montar
  useEffect(() => {
    loadGroups();
  }, []);

  const loadGroups = useCallback(async () => {
    try {
      const json = await AsyncStorage.getItem(GROUPS_STORAGE_KEY);
      if (json) setSavedGroups(JSON.parse(json));
    } catch {
      console.warn("Error cargando grupos");
    }
  }, []);

  const saveGroup = async () => {
    const name = groupName.trim();
    if (!name) {
      Alert.alert("Nombre requerido", "Escribe un nombre para el grupo.");
      return;
    }
    if (state.players.length === 0) {
      Alert.alert("Sin jugadores", "Agrega jugadores antes de guardar.");
      return;
    }
    const newGroup: SavedGroup = {
      id: Date.now().toString(),
      name,
      players: state.players.map((p) => p.name),
      createdAt: Date.now(),
    };
    const updated = [...savedGroups, newGroup];
    try {
      await AsyncStorage.setItem(GROUPS_STORAGE_KEY, JSON.stringify(updated));
      setSavedGroups(updated);
      setGroupName("");
      setShowSaveInput(false);
      Alert.alert(
        "Guardado ✓",
        `Grupo "${name}" guardado con ${newGroup.players.length} jugadores.`,
      );
    } catch {
      Alert.alert("Error", "No se pudo guardar el grupo.");
    }
  };

  const loadGroup = (group: SavedGroup) => {
    setPlayers(group.players);
    setShowGroupModal(false);
  };

  const deleteGroup = async (id: string) => {
    const updated = savedGroups.filter((g) => g.id !== id);
    try {
      await AsyncStorage.setItem(GROUPS_STORAGE_KEY, JSON.stringify(updated));
      setSavedGroups(updated);
    } catch {
      Alert.alert("Error", "No se pudo eliminar el grupo.");
    }
  };

  const confirmDeleteGroup = (group: SavedGroup) => {
    Alert.alert("Eliminar grupo", `¿Eliminar "${group.name}"?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: () => deleteGroup(group.id),
      },
    ]);
  };

  const handleAddPlayer = () => {
    const name = playerName.trim();
    if (!name) return;
    if (state.players.length >= 10) {
      Alert.alert(
        "Máximo alcanzado",
        "Solo puedes agregar hasta 10 jugadores.",
      );
      return;
    }
    if (
      state.players.some((p) => p.name.toLowerCase() === name.toLowerCase())
    ) {
      Alert.alert("Nombre repetido", "Ese nombre ya existe.");
      return;
    }
    addPlayer(name);
    setPlayerName("");
  };

  const handleStart = () => {
    if (state.players.length < 3) {
      Alert.alert(
        "Pocos jugadores",
        "Necesitas al menos 3 jugadores para empezar.",
      );
      return;
    }
    startGame();
    router.push("/role-reveal");
  };

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    return `${mins} min`;
  };

  const canStart = state.players.length >= 3;

  // ── Progress bar for min players ──
  const progressPercent = Math.min(state.players.length / 3, 1);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ── */}
        <Animated.View
          entering={FadeInDown.duration(400)}
          style={styles.header}
        >
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <View style={styles.backBtnInner}>
              <ArrowLeftIcon size={20} color="#fff" />
            </View>
          </Pressable>
          <View style={styles.headerCenter}>
            <Text style={styles.headerSubtitle}>NUEVA PARTIDA</Text>
            <Text style={styles.headerTitle}>CONFIGURACIÓN</Text>
          </View>
          <View style={styles.headerBadge}>
            <View style={styles.headerBadgeGlow}>
              <AlienIcon size={24} color="#e74c3c" />
            </View>
          </View>
        </Animated.View>

        {/* ── Divider ── */}
        <View style={styles.headerDividerWrap}>
          <View style={styles.headerDivider} />
        </View>

        {/* ── Sección: Jugadores ── */}
        <Animated.View entering={FadeInDown.delay(100).duration(400)}>
          {/* Section Card Container */}
          <View style={styles.sectionCard}>
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
                style={({ pressed }) => [
                  styles.addBtn,
                  pressed && styles.btnPressed,
                ]}
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
                  entering={SlideInRight.delay(index * 60).duration(300)}
                  style={styles.playerCard}
                >
                  <View
                    style={[
                      styles.playerAvatarRing,
                      { borderColor: color + "60" },
                    ]}
                  >
                    <View
                      style={[styles.playerAvatar, { backgroundColor: color }]}
                    >
                      <Text style={styles.playerIndex}>{index + 1}</Text>
                    </View>
                  </View>
                  <View style={styles.playerInfo}>
                    <Text style={styles.playerName}>{player.name}</Text>
                    <Text style={styles.playerLabel}>Jugador {index + 1}</Text>
                  </View>
                  <View
                    style={[styles.playerColorBar, { backgroundColor: color }]}
                  />
                  <Pressable
                    onPress={() => removePlayer(player.id)}
                    style={({ pressed }) => [
                      styles.removeBtn,
                      pressed && { opacity: 0.6 },
                    ]}
                  >
                    <CloseIcon size={14} color="#666" />
                  </Pressable>
                </Animated.View>
              );
            })}

            {state.players.length === 0 && (
              <View style={styles.emptyBox}>
                <View style={styles.emptyIconWrap}>
                  <UsersIcon size={30} color="#ffffff15" />
                </View>
                <Text style={styles.emptyText}>
                  Agrega al menos 3 jugadores
                </Text>
                <Text style={styles.emptySubText}>Mínimo 3 · Máximo 10</Text>
              </View>
            )}

            {/* Progress bar */}
            {state.players.length > 0 && state.players.length < 3 && (
              <View style={styles.progressSection}>
                <View style={styles.progressBarBg}>
                  <Animated.View
                    entering={FadeIn.duration(300)}
                    style={[
                      styles.progressBarFill,
                      {
                        width: `${progressPercent * 100}%`,
                        backgroundColor: "#f1c40f",
                      },
                    ]}
                  />
                </View>
                <Text style={styles.progressText}>
                  Faltan {3 - state.players.length} jugador
                  {3 - state.players.length > 1 ? "es" : ""} más
                </Text>
              </View>
            )}

            {/* ── Botones de Grupos ── */}
            <View style={styles.groupActions}>
              {/* Guardar grupo */}
              {!showSaveInput ? (
                <Pressable
                  onPress={() => {
                    if (state.players.length === 0) {
                      Alert.alert(
                        "Sin jugadores",
                        "Agrega jugadores antes de guardar.",
                      );
                      return;
                    }
                    setShowSaveInput(true);
                  }}
                  style={({ pressed }) => [
                    styles.groupBtn,
                    styles.groupBtnSave,
                    pressed && styles.btnPressed,
                  ]}
                >
                  <SaveIcon size={16} color="#2ecc71" />
                  <Text style={styles.groupBtnTextSave}>Guardar grupo</Text>
                </Pressable>
              ) : (
                <View style={styles.saveInputRow}>
                  <TextInput
                    style={styles.saveInput}
                    placeholder="Nombre del grupo..."
                    placeholderTextColor="#444"
                    value={groupName}
                    onChangeText={setGroupName}
                    onSubmitEditing={saveGroup}
                    maxLength={20}
                    autoFocus
                  />
                  <Pressable
                    onPress={saveGroup}
                    style={({ pressed }) => [
                      styles.saveConfirmBtn,
                      pressed && styles.btnPressed,
                    ]}
                  >
                    <SaveIcon size={16} color="#fff" />
                  </Pressable>
                  <Pressable
                    onPress={() => {
                      setShowSaveInput(false);
                      setGroupName("");
                    }}
                    style={styles.saveCancelBtn}
                  >
                    <CloseIcon size={16} color="#e74c3c" />
                  </Pressable>
                </View>
              )}

              {/* Cargar grupo */}
              <Pressable
                onPress={() => setShowGroupModal(true)}
                style={({ pressed }) => [
                  styles.groupBtn,
                  styles.groupBtnLoad,
                  pressed && styles.btnPressed,
                ]}
              >
                <DownloadIcon size={16} color="#3498db" />
                <Text style={styles.groupBtnTextLoad}>Mis grupos</Text>
                {savedGroups.length > 0 && (
                  <View style={styles.groupCountBadge}>
                    <Text style={styles.groupCountText}>
                      {savedGroups.length}
                    </Text>
                  </View>
                )}
              </Pressable>
            </View>
          </View>
        </Animated.View>

        {/* ── Modal: Grupos Guardados ── */}
        <Modal
          visible={showGroupModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowGroupModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              {/* Handle bar */}
              <View style={styles.modalHandle} />
              {/* Header modal */}
              <View style={styles.modalHeader}>
                <View style={styles.modalHeaderLeft}>
                  <View style={styles.modalHeaderIcon}>
                    <UsersIcon size={18} color="#00ffff" />
                  </View>
                  <Text style={styles.modalTitle}>Mis Grupos</Text>
                </View>
                <Pressable
                  onPress={() => setShowGroupModal(false)}
                  style={styles.modalCloseBtn}
                >
                  <CloseIcon size={18} color="#fff" />
                </Pressable>
              </View>

              <ScrollView
                style={styles.modalScroll}
                showsVerticalScrollIndicator={false}
              >
                {savedGroups.length === 0 ? (
                  <View style={styles.modalEmpty}>
                    <View style={styles.modalEmptyIconWrap}>
                      <FolderIcon size={36} color="#333" />
                    </View>
                    <Text style={styles.modalEmptyText}>
                      No hay grupos guardados
                    </Text>
                    <Text style={styles.modalEmptySubText}>
                      Agrega jugadores y usa "Guardar grupo"
                    </Text>
                  </View>
                ) : (
                  savedGroups.map((group) => (
                    <View key={group.id} style={styles.groupCard}>
                      <Pressable
                        onPress={() => loadGroup(group)}
                        style={({ pressed }) => [
                          styles.groupCardMain,
                          pressed && { opacity: 0.7 },
                        ]}
                      >
                        <View style={styles.groupCardAvatarWrap}>
                          <UsersIcon size={18} color="#3498db" />
                        </View>
                        <View style={styles.groupCardInfo}>
                          <Text style={styles.groupCardName}>{group.name}</Text>
                          <Text
                            style={styles.groupCardPlayers}
                            numberOfLines={1}
                          >
                            {group.players.join(", ")}
                          </Text>
                          <Text style={styles.groupCardCount}>
                            {group.players.length} jugador
                            {group.players.length !== 1 ? "es" : ""}
                          </Text>
                        </View>
                        <DownloadIcon size={18} color="#3498db" />
                      </Pressable>
                      <Pressable
                        onPress={() => confirmDeleteGroup(group)}
                        style={({ pressed }) => [
                          styles.groupDeleteBtn,
                          pressed && { opacity: 0.6 },
                        ]}
                      >
                        <TrashIcon size={15} color="#e74c3c" />
                      </Pressable>
                    </View>
                  ))
                )}
              </ScrollView>
            </View>
          </View>
        </Modal>

        {/* ── Sección: Categoría ── */}
        <Animated.View entering={FadeInDown.delay(200).duration(400)}>
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <View
                style={[
                  styles.sectionIconCircle,
                  { backgroundColor: "#9b59b620" },
                ]}
              >
                <FolderIcon size={18} color="#9b59b6" />
              </View>
              <Text style={styles.sectionTitle}>Categoría</Text>
              <View style={styles.categoryActiveBadge}>
                <Text style={styles.categoryActiveBadgeText}>
                  {categories[state.categoryIndex].name}
                </Text>
              </View>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.categoryScroll}
              contentContainerStyle={styles.categoryScrollContent}
            >
              {categories.map((cat, index) => {
                const isActive = state.categoryIndex === index;
                const IconComponent = CATEGORY_ICONS[cat.name];
                const iconColor = isActive ? "#00ffff" : "#555";
                return (
                  <Pressable
                    key={cat.name}
                    onPress={() => setCategoryIndex(index)}
                    style={[
                      styles.categoryCard,
                      isActive && styles.categoryCardActive,
                    ]}
                  >
                    {isActive && (
                      <View style={styles.categoryGlowDot} />
                    )}
                    <View
                      style={[
                        styles.categoryIconContainer,
                        isActive && styles.categoryIconContainerActive,
                      ]}
                    >
                      {IconComponent ? (
                        <IconComponent size={24} color={iconColor} />
                      ) : (
                        <FolderIcon size={24} color={iconColor} />
                      )}
                    </View>
                    <Text
                      style={[
                        styles.categoryName,
                        isActive && styles.categoryNameActive,
                      ]}
                    >
                      {cat.name}
                    </Text>
                    <Text
                      style={[
                        styles.categoryCount,
                        isActive && styles.categoryCountActive,
                      ]}
                    >
                      {cat.words.length} palabras
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>
        </Animated.View>

        {/* ── Sección: Tiempo ── */}
        <Animated.View entering={FadeInDown.delay(300).duration(400)}>
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <View
                style={[
                  styles.sectionIconCircle,
                  { backgroundColor: "#f1c40f20" },
                ]}
              >
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
                    {isActive && (
                      <View style={styles.timeActiveIndicator}>
                        <View style={[styles.timeActiveIndicatorInner, { backgroundColor: "#f1c40f" }]} />
                      </View>
                    )}
                    <Text
                      style={[
                        styles.timeValue,
                        isActive && styles.timeValueActive,
                      ]}
                    >
                      {Math.floor(t / 60)}
                    </Text>
                    <Text
                      style={[
                        styles.timeUnit,
                        isActive && styles.timeUnitActive,
                      ]}
                    >
                      min
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </Animated.View>

        {/* ── Botón Iniciar ── */}
        <Animated.View
          entering={FadeInUp.delay(400).duration(500)}
          style={styles.startSection}
        >
          {canStart && (
            <View style={styles.configSummary}>
              <View style={styles.configSummaryRow}>
                <View style={styles.configChip}>
                  <UsersIcon size={12} color="#00ffff" />
                  <Text style={styles.configChipText}>
                    {state.players.length} jugadores
                  </Text>
                </View>
                <View style={styles.configDot} />
                <View style={styles.configChip}>
                  <FolderIcon size={12} color="#9b59b6" />
                  <Text style={styles.configChipText}>
                    {categories[state.categoryIndex].name}
                  </Text>
                </View>
                <View style={styles.configDot} />
                <View style={styles.configChip}>
                  <ClockIcon size={12} color="#f1c40f" />
                  <Text style={styles.configChipText}>
                    {formatTime(state.discussionTime)}
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* Start Button with glow wrap */}
          <View style={canStart ? styles.startBtnGlow : undefined}>
            <Pressable
              onPress={handleStart}
              style={({ pressed }) => [
                styles.startButton,
                !canStart && styles.startButtonDisabled,
                pressed && canStart && styles.btnPressed,
              ]}
            >
              <View style={[
                styles.startButtonInner,
                !canStart && { backgroundColor: "#1a1b2e" },
              ]}>
                <RocketIcon size={22} color={canStart ? "#fff" : "#555"} />
                <Text
                  style={[
                    styles.startText,
                    !canStart && styles.startTextDisabled,
                  ]}
                >
                  INICIAR JUEGO
                </Text>
              </View>
            </Pressable>
          </View>

          {!canStart && (
            <Text style={styles.startHint}>
              Agrega {3 - state.players.length} jugador(es) más
            </Text>
          )}
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#050610",
  },
  scroll: {
    padding: 20,
    paddingTop: 55,
    paddingBottom: 60,
  },

  // ── Header ──
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  backBtn: {
    padding: 4,
  },
  backBtnInner: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "#ffffff08",
    borderWidth: 1,
    borderColor: "#ffffff12",
    justifyContent: "center",
    alignItems: "center",
  },
  headerCenter: {
    flex: 1,
    alignItems: "center",
  },
  headerSubtitle: {
    color: "#e74c3c80",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 4,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "900",
    letterSpacing: 5,
    marginTop: 2,
  },
  headerBadge: {
    width: 42,
    height: 42,
    justifyContent: "center",
    alignItems: "center",
  },
  headerBadgeGlow: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "#e74c3c10",
    borderWidth: 1,
    borderColor: "#e74c3c25",
    justifyContent: "center",
    alignItems: "center",
  },
  headerDividerWrap: {
    marginBottom: 22,
    paddingHorizontal: 20,
  },
  headerDivider: {
    height: 1,
    backgroundColor: "#e74c3c20",
  },

  // ── Section Cards (glassmorphism container) ──
  sectionCard: {
    backgroundColor: "#0a0b1480",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ffffff0a",
    padding: 18,
    marginBottom: 18,
  },

  // ── Secciones ──
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#ffffff06",
  },
  sectionIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: "#00ffff12",
    justifyContent: "center",
    alignItems: "center",
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "800",
    letterSpacing: 0.5,
    flex: 1,
  },
  badge: {
    backgroundColor: "#00ffff08",
    borderWidth: 1,
    borderColor: "#00ffff20",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeText: {
    color: "#00ffff",
    fontSize: 12,
    fontWeight: "700",
  },

  // ── Input ──
  inputRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 14,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0d0e18",
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "#1a1b2e",
    paddingHorizontal: 14,
    gap: 10,
  },
  input: {
    flex: 1,
    color: "#fff",
    fontSize: 15,
    paddingVertical: 14,
  },
  addBtn: {
    backgroundColor: "#2ecc71",
    width: 54,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#2ecc7140",
    shadowColor: "#2ecc71",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  btnPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.96 }],
  },

  // ── Player Cards ──
  playerCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0d0e18",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#1a1b2e",
    padding: 10,
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  playerAvatarRing: {
    width: 40,
    height: 40,
    borderRadius: 13,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  playerAvatar: {
    width: 30,
    height: 30,
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
  },
  playerIndex: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "900",
  },
  playerInfo: {
    flex: 1,
    marginLeft: 12,
  },
  playerName: {
    color: "#e8e8e8",
    fontSize: 15,
    fontWeight: "700",
  },
  playerLabel: {
    color: "#ffffff25",
    fontSize: 11,
    fontWeight: "600",
    marginTop: 1,
  },
  playerColorBar: {
    width: 3,
    height: 20,
    borderRadius: 2,
    marginRight: 10,
  },
  removeBtn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: "#ffffff06",
    justifyContent: "center",
    alignItems: "center",
  },

  // ── Empty State ──
  emptyBox: {
    alignItems: "center",
    paddingVertical: 40,
    backgroundColor: "#0d0e1860",
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: "#1a1b2e",
    borderStyle: "dashed",
  },
  emptyIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: "#ffffff04",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  emptyText: {
    color: "#ffffff30",
    fontSize: 14,
    fontWeight: "700",
  },
  emptySubText: {
    color: "#ffffff15",
    fontSize: 12,
    marginTop: 4,
    letterSpacing: 1,
  },

  // ── Progress indicator ──
  progressSection: {
    marginTop: 8,
    marginBottom: 4,
  },
  progressBarBg: {
    height: 4,
    backgroundColor: "#1a1b2e",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 8,
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressText: {
    color: "#f1c40f",
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
  },

  // ── Categories ──
  categoryScroll: {
    marginHorizontal: -18,
  },
  categoryScrollContent: {
    paddingHorizontal: 18,
    gap: 10,
  },
  categoryActiveBadge: {
    backgroundColor: "#9b59b615",
    borderWidth: 1,
    borderColor: "#9b59b630",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  categoryActiveBadgeText: {
    color: "#9b59b6",
    fontSize: 11,
    fontWeight: "700",
  },
  categoryCard: {
    width: 105,
    alignItems: "center",
    backgroundColor: "#0d0e18",
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: "#1a1b2e",
    paddingVertical: 14,
    paddingHorizontal: 8,
    position: "relative",
    overflow: "hidden",
  },
  categoryCardActive: {
    borderColor: "#00ffff",
    backgroundColor: "#00ffff06",
  },
  categoryGlowDot: {
    position: "absolute",
    top: -10,
    right: -10,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#00ffff15",
  },
  categoryIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#1a1b2e",
    justifyContent: "center" as const,
    alignItems: "center" as const,
    marginBottom: 10,
  },
  categoryIconContainerActive: {
    backgroundColor: "#00ffff12",
  },
  categoryName: {
    color: "#666",
    fontSize: 12,
    fontWeight: "700",
  },
  categoryNameActive: {
    color: "#00ffff",
  },
  categoryCount: {
    color: "#333",
    fontSize: 10,
    marginTop: 4,
    fontWeight: "600",
  },
  categoryCountActive: {
    color: "#00ffff80",
  },

  // ── Time ──
  timeRow: {
    flexDirection: "row",
    gap: 10,
  },
  timeCard: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#0d0e18",
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: "#1a1b2e",
    paddingVertical: 18,
    position: "relative",
    overflow: "hidden",
  },
  timeCardActive: {
    borderColor: "#f1c40f",
    backgroundColor: "#f1c40f06",
  },
  timeActiveIndicator: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    overflow: "hidden",
  },
  timeActiveIndicatorInner: {
    flex: 1,
    borderRadius: 2,
  },
  timeValue: {
    color: "#555",
    fontSize: 26,
    fontWeight: "900",
  },
  timeValueActive: {
    color: "#f1c40f",
  },
  timeUnit: {
    color: "#444",
    fontSize: 11,
    fontWeight: "600",
    marginTop: 2,
  },
  timeUnitActive: {
    color: "#f1c40f80",
  },

  // ── Start Button ──
  startSection: {
    alignItems: "center",
    marginTop: 14,
  },
  configSummary: {
    backgroundColor: "#0a0b1480",
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "#ffffff08",
    width: "100%",
  },
  configSummaryRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  configChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  configChipText: {
    color: "#ffffff60",
    fontSize: 12,
    fontWeight: "600",
  },
  configDot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: "#ffffff20",
  },
  startBtnGlow: {
    width: "100%",
    shadowColor: "#e74c3c",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 12,
  },
  startButton: {
    width: "100%",
    borderRadius: 18,
    overflow: "hidden",
    borderWidth: 1.5,
    borderColor: "#ff6b6b30",
  },
  startButtonInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    height: 60,
    backgroundColor: "#e74c3c",
    borderRadius: 16,
  },
  startButtonDisabled: {
    borderColor: "#1a1b2e",
    shadowOpacity: 0,
    elevation: 0,
  },
  startText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: 3,
  },
  startTextDisabled: {
    color: "#555",
  },
  startHint: {
    color: "#555",
    fontSize: 12,
    marginTop: 10,
  },

  // ── Grupos ──
  groupActions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 14,
  },
  groupBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1.5,
  },
  groupBtnSave: {
    borderColor: "#2ecc7135",
    backgroundColor: "#2ecc7108",
  },
  groupBtnLoad: {
    borderColor: "#3498db35",
    backgroundColor: "#3498db08",
  },
  groupBtnTextSave: {
    color: "#2ecc71",
    fontSize: 13,
    fontWeight: "700",
  },
  groupBtnTextLoad: {
    color: "#3498db",
    fontSize: 13,
    fontWeight: "700",
  },
  groupCountBadge: {
    backgroundColor: "#3498db",
    borderRadius: 8,
    minWidth: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 5,
  },
  groupCountText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "800",
  },
  saveInputRow: {
    flex: 1,
    flexDirection: "row",
    gap: 8,
  },
  saveInput: {
    flex: 1,
    backgroundColor: "#0d0e18",
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "#2ecc7135",
    color: "#fff",
    fontSize: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  saveConfirmBtn: {
    backgroundColor: "#2ecc71",
    width: 44,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  saveCancelBtn: {
    width: 44,
    borderRadius: 14,
    backgroundColor: "#e74c3c08",
    borderWidth: 1,
    borderColor: "#e74c3c25",
    justifyContent: "center",
    alignItems: "center",
  },

  // ── Modal ──
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.88)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#0d0e18",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: "72%",
    borderWidth: 1,
    borderColor: "#ffffff0a",
    borderBottomWidth: 0,
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#ffffff15",
    alignSelf: "center",
    marginTop: 12,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    paddingTop: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ffffff08",
  },
  modalHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  modalHeaderIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: "#00ffff10",
    justifyContent: "center",
    alignItems: "center",
  },
  modalTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "800",
  },
  modalCloseBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "#ffffff08",
    justifyContent: "center",
    alignItems: "center",
  },
  modalScroll: {
    padding: 16,
    paddingBottom: 40,
  },
  modalEmpty: {
    alignItems: "center",
    paddingVertical: 44,
  },
  modalEmptyIconWrap: {
    width: 70,
    height: 70,
    borderRadius: 22,
    backgroundColor: "#ffffff04",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
  },
  modalEmptyText: {
    color: "#555",
    fontSize: 16,
    fontWeight: "700",
  },
  modalEmptySubText: {
    color: "#333",
    fontSize: 13,
    marginTop: 6,
  },
  groupCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#111222",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#1a1b2e",
    marginBottom: 10,
    overflow: "hidden",
  },
  groupCardMain: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    gap: 12,
  },
  groupCardAvatarWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "#3498db12",
    borderWidth: 1,
    borderColor: "#3498db25",
    justifyContent: "center",
    alignItems: "center",
  },
  groupCardInfo: {
    flex: 1,
  },
  groupCardName: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "800",
  },
  groupCardPlayers: {
    color: "#666",
    fontSize: 12,
    marginTop: 3,
  },
  groupCardCount: {
    color: "#3498db",
    fontSize: 11,
    fontWeight: "700",
    marginTop: 4,
  },
  groupDeleteBtn: {
    width: 46,
    height: "100%" as any,
    justifyContent: "center" as const,
    alignItems: "center" as const,
    backgroundColor: "#e74c3c08",
    borderLeftWidth: 1,
    borderLeftColor: "#1a1b2e",
    paddingVertical: 16,
  },
});
