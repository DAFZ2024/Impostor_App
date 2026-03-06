import {
  ArrowLeftIcon,
  GamepadIcon,
  PlusIcon,
  UsersIcon,
} from "@/components/Icons";
import { useAuth } from "@/context/AuthContext";
import { useOnlineGame } from "@/context/OnlineGameContext";
import { useRouter } from "expo-router";
import {
  ChevronRight,
  Hash,
  Swords,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Animated, {
  Easing,
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

// ── Design tokens ──────────────────────────────────────────────
const BG = "#070810";
const CARD = "#0d0f1e";
const BORDER = "#1c1f36";
const CYAN = "#00ffff";
const GREEN = "#2ecc71";
const BLUE = "#3498db";
const RED = "#e74c3c";

// ── Animated glow ring behind an icon ─────────────────────────
function GlowRing({ color }: { color: string }) {
    const scale = useSharedValue(1);
    useEffect(() => {
        scale.value = withRepeat(
            withSequence(
                withTiming(1.18, { duration: 1600, easing: Easing.inOut(Easing.ease) }),
                withTiming(1, { duration: 1600, easing: Easing.inOut(Easing.ease) })
            ),
            -1,
            true
        );
    }, []);
    const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
    return (
        <Animated.View
            style={[
                {
                    position: "absolute",
                    width: 90, height: 90, borderRadius: 45,
                    borderWidth: 1, borderColor: color + "40",
                    backgroundColor: color + "08",
                },
                style,
            ]}
        />
    );
}

// ── Individual code character box ─────────────────────────────
function CodeBoxes({ value }: { value: string }) {
    const slots = Array.from({ length: 6 }, (_, i) => value[i] ?? "");
    return (
        <View style={codeStyles.row}>
            {slots.map((ch, i) => (
                <View key={i} style={[codeStyles.box, ch && codeStyles.boxFilled]}>
                    <Text style={[codeStyles.char, !ch && codeStyles.placeholder]}>
                        {ch || "·"}
                    </Text>
                </View>
            ))}
        </View>
    );
}
const codeStyles = StyleSheet.create({
    row: { flexDirection: "row", gap: 8, justifyContent: "center" },
    box: {
        width: 44, height: 52, borderRadius: 12,
        backgroundColor: "#09091a", borderWidth: 1.5, borderColor: BORDER,
        justifyContent: "center", alignItems: "center",
    },
    boxFilled: { borderColor: CYAN + "60", backgroundColor: CYAN + "0d" },
    char: { color: CYAN, fontSize: 22, fontWeight: "900", letterSpacing: 0 },
    placeholder: { color: "#2a2d44", fontSize: 18 },
});

// ── Main Screen ────────────────────────────────────────────────
export default function JoinScreen() {
    const router = useRouter();
    const { user, displayName } = useAuth();
    const { createRoom, joinRoom, loading } = useOnlineGame();
    const [code, setCode] = useState("");
    const [mode, setMode] = useState<"menu" | "join">("menu");

    const handleCreate = async () => {
        if (!user) return;
        const roomCode = await createRoom(user.id, displayName ?? "Jugador");
        if (roomCode) router.replace("/(online)/lobby");
    };

    const handleJoin = async () => {
        if (!user || !code.trim()) return;
        const success = await joinRoom(code.trim().toUpperCase(), user.id, displayName ?? "Jugador");
        if (success) router.replace("/(online)/lobby");
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            {/* Background blobs */}
            <View style={styles.blob1} />
            <View style={styles.blob2} />
            <View style={styles.blob3} />

            {/* ── Header ── */}
            <Animated.View entering={FadeInDown.duration(400)} style={styles.header}>
                <Pressable
                    onPress={() => router.back()}
                    style={({ pressed }) => [styles.iconBtn, pressed && { opacity: 0.6 }]}
                >
                    <ArrowLeftIcon size={20} color="#fff" />
                </Pressable>

                <View style={styles.headerCenter}>
                    <Text style={styles.headerSub}>MODO</Text>
                    <Text style={styles.headerTitle}>ONLINE</Text>
                </View>

                <View style={[styles.iconBtn, { backgroundColor: CYAN + "12", borderColor: CYAN + "30" }]}>
                    <Swords size={20} color={CYAN} strokeWidth={1.8} />
                </View>
            </Animated.View>

            {mode === "menu" ? (
                <View style={styles.menuWrap}>

                    {/* Tagline */}
                    <Animated.View entering={FadeInDown.delay(60).duration(400)} style={styles.taglineRow}>
                        <View style={styles.taglineLine} />
                        <Text style={styles.taglineText}>ELIGE UNA OPCIÓN</Text>
                        <View style={styles.taglineLine} />
                    </Animated.View>

                    {/* CREATE card */}
                    <Animated.View entering={FadeInDown.delay(120).duration(500)} style={{ position: "relative" }}>
                        <Pressable
                            onPress={handleCreate}
                            disabled={loading}
                            style={({ pressed }) => [
                                styles.optionCard,
                                { borderColor: GREEN + "45" },
                                pressed && styles.cardPressed,
                            ]}
                        >
                            <View style={styles.cardLeft}>
                                <View style={styles.iconWrap}>
                                    <GlowRing color={GREEN} />
                                    <View style={[styles.iconCircle, { backgroundColor: GREEN + "18", borderColor: GREEN + "40" }]}>
                                        {loading
                                            ? <ActivityIndicator color={GREEN} size="large" />
                                            : <PlusIcon size={34} color={GREEN} />
                                        }
                                    </View>
                                </View>

                                <View style={styles.cardText}>
                                    <Text style={styles.cardTitle}>CREAR SALA</Text>
                                    <Text style={styles.cardDesc}>
                                        Crea una sala y comparte el código con tus amigos
                                    </Text>
                                </View>
                            </View>
                            <ChevronRight size={20} color={GREEN + "80"} strokeWidth={2.5} />
                        </Pressable>
                        {/* 3-D shadow */}
                        <View style={[styles.cardShadow, { backgroundColor: "#0a2e18" }]} />
                    </Animated.View>

                    {/* JOIN card */}
                    <Animated.View entering={FadeInDown.delay(220).duration(500)} style={{ position: "relative" }}>
                        <Pressable
                            onPress={() => setMode("join")}
                            style={({ pressed }) => [
                                styles.optionCard,
                                { borderColor: BLUE + "45" },
                                pressed && styles.cardPressed,
                            ]}
                        >
                            <View style={styles.cardLeft}>
                                <View style={styles.iconWrap}>
                                    <GlowRing color={BLUE} />
                                    <View style={[styles.iconCircle, { backgroundColor: BLUE + "18", borderColor: BLUE + "40" }]}>
                                        <UsersIcon size={34} color={BLUE} />
                                    </View>
                                </View>

                                <View style={styles.cardText}>
                                    <Text style={styles.cardTitle}>UNIRSE A SALA</Text>
                                    <Text style={styles.cardDesc}>
                                        Ingresa el código de sala de tu amigo para unirte
                                    </Text>
                                </View>
                            </View>
                            <ChevronRight size={20} color={BLUE + "80"} strokeWidth={2.5} />
                        </Pressable>
                        {/* 3-D shadow */}
                        <View style={[styles.cardShadow, { backgroundColor: "#0a1a2e" }]} />
                    </Animated.View>
                </View>
            ) : (
                <Animated.View entering={FadeInUp.duration(380)} style={styles.joinWrap}>
                    {/* Join code card */}
                    <View style={styles.joinCard}>
                        {/* Icon */}
                        <View style={styles.joinIconWrap}>
                            <GlowRing color={CYAN} />
                            <View style={[styles.iconCircle, { backgroundColor: CYAN + "15", borderColor: CYAN + "40" }]}>
                                <Hash size={30} color={CYAN} strokeWidth={2} />
                            </View>
                        </View>

                        <View style={styles.joinHeader}>
                            <Text style={styles.joinTitle}>CÓDIGO DE SALA</Text>
                            <Text style={styles.joinSub}>Ingresa el código de 4-6 caracteres</Text>
                        </View>

                        {/* Visual code boxes (display only) */}
                        <CodeBoxes value={code} />

                        {/* Hidden real input */}
                        <TextInput
                            style={styles.hiddenInput}
                            value={code}
                            onChangeText={(t) => setCode(t.toUpperCase())}
                            maxLength={6}
                            autoCapitalize="characters"
                            autoCorrect={false}
                            autoFocus
                            caretHidden
                        />

                        <Text style={styles.inputHint}>Toca arriba para escribir</Text>

                        {/* Buttons */}
                        <View style={styles.btnRow}>
                            <Pressable
                                onPress={() => { setMode("menu"); setCode(""); }}
                                style={({ pressed }) => [styles.cancelBtn, pressed && { opacity: 0.7 }]}
                            >
                                <Text style={styles.cancelText}>CANCELAR</Text>
                            </Pressable>

                            <View style={{ flex: 1.4, position: "relative" }}>
                                <Pressable
                                    onPress={handleJoin}
                                    disabled={loading || code.length < 4}
                                    style={({ pressed }) => [
                                        styles.joinBtn,
                                        (loading || code.length < 4) && styles.joinBtnDisabled,
                                        pressed && code.length >= 4 && styles.joinBtnPressed,
                                    ]}
                                >
                                    {loading
                                        ? <ActivityIndicator color="#fff" />
                                        : <>
                                            <GamepadIcon size={18} color={code.length >= 4 ? "#fff" : "#444"} />
                                            <Text style={[styles.joinBtnText, code.length < 4 && { color: "#444" }]}>
                                                UNIRSE
                                            </Text>
                                        </>
                                    }
                                </Pressable>
                                {code.length >= 4 && <View style={styles.joinBtnShadow} />}
                            </View>
                        </View>
                    </View>
                </Animated.View>
            )}
        </KeyboardAvoidingView>
    );
}

// ── Styles ─────────────────────────────────────────────────────
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: BG, padding: 20, paddingTop: 55 },

    // Blobs
    blob1: { position: "absolute", top: -100, right: -70, width: 300, height: 300, borderRadius: 150, backgroundColor: GREEN, opacity: 0.03 },
    blob2: { position: "absolute", bottom: -130, left: -90, width: 350, height: 350, borderRadius: 175, backgroundColor: BLUE, opacity: 0.035 },
    blob3: { position: "absolute", top: "50%", left: "30%", width: 180, height: 180, borderRadius: 90, backgroundColor: RED, opacity: 0.025 },

    // Header
    header: { flexDirection: "row", alignItems: "center", marginBottom: 38, gap: 12 },
    iconBtn: {
        width: 44, height: 44, borderRadius: 14,
        backgroundColor: "#ffffff08", borderWidth: 1, borderColor: "#ffffff12",
        justifyContent: "center", alignItems: "center",
    },
    headerCenter: { flex: 1, alignItems: "center" },
    headerSub: { color: CYAN + "80", fontSize: 10, fontWeight: "700", letterSpacing: 4 },
    headerTitle: { color: "#fff", fontSize: 22, fontWeight: "900", letterSpacing: 5, marginTop: 2 },

    // Tagline divider
    taglineRow: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 10 },
    taglineLine: { flex: 1, height: 1, backgroundColor: BORDER },
    taglineText: { color: "#2a3050", fontSize: 10, fontWeight: "800", letterSpacing: 2.5 },

    // Option cards
    menuWrap: { flex: 1, justifyContent: "center", gap: 20, paddingHorizontal: 2 },
    optionCard: {
        backgroundColor: CARD,
        borderRadius: 22,
        borderWidth: 1.5,
        paddingVertical: 24,
        paddingHorizontal: 20,
        flexDirection: "row",
        alignItems: "center",
        gap: 14,
        zIndex: 1,
    },
    cardPressed: { transform: [{ translateY: 4 }] },
    cardShadow: {
        position: "absolute",
        bottom: -5, left: 6, right: 6,
        height: "100%", borderRadius: 22,
        zIndex: 0,
    },
    cardLeft: { flex: 1, flexDirection: "row", alignItems: "center", gap: 16 },
    iconWrap: { width: 70, height: 70, justifyContent: "center", alignItems: "center" },
    iconCircle: {
        width: 64, height: 64, borderRadius: 20,
        borderWidth: 1.5, justifyContent: "center", alignItems: "center",
    },
    cardText: { flex: 1 },
    cardTitle: { color: "#fff", fontSize: 16, fontWeight: "900", letterSpacing: 2.5, marginBottom: 4 },
    cardDesc: { color: "#4a5568", fontSize: 12, lineHeight: 18 },

    // Join mode
    joinWrap: { flex: 1, justifyContent: "center", paddingHorizontal: 2 },
    joinCard: {
        backgroundColor: CARD,
        borderRadius: 24,
        borderWidth: 1.5,
        borderColor: BLUE + "40",
        padding: 28,
        alignItems: "center",
        gap: 20,
    },
    joinIconWrap: { width: 80, height: 80, justifyContent: "center", alignItems: "center" },
    joinHeader: { alignItems: "center", gap: 6 },
    joinTitle: { color: "#fff", fontSize: 16, fontWeight: "900", letterSpacing: 3 },
    joinSub: { color: "#4a5568", fontSize: 12 },

    hiddenInput: {
        position: "absolute",
        opacity: 0,
        width: "100%",
        height: 60,
    },
    inputHint: { color: "#2a2d44", fontSize: 11, fontWeight: "600", letterSpacing: 1 },

    btnRow: { flexDirection: "row", gap: 12, width: "100%", marginTop: 4 },
    cancelBtn: {
        flex: 1, height: 52, borderRadius: 14,
        backgroundColor: "#0a0c1a", borderWidth: 1, borderColor: BORDER,
        justifyContent: "center", alignItems: "center",
    },
    cancelText: { color: "#3d4a6b", fontSize: 13, fontWeight: "800", letterSpacing: 2 },

    joinBtn: {
        height: 52, borderRadius: 14,
        backgroundColor: BLUE, borderWidth: 1, borderColor: "#5baee8",
        flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 8,
        shadowColor: BLUE, shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.45, shadowRadius: 12, elevation: 10,
        zIndex: 1,
    },
    joinBtnDisabled: { backgroundColor: "#13151f", borderColor: BORDER, shadowOpacity: 0, elevation: 0 },
    joinBtnPressed: { transform: [{ translateY: 4 }], shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25 },
    joinBtnShadow: {
        position: "absolute", bottom: -5, left: 4, right: 4,
        height: 52, borderRadius: 14, backgroundColor: "#1a3a5c", zIndex: 0,
    },
    joinBtnText: { color: "#fff", fontSize: 16, fontWeight: "900", letterSpacing: 2 },
});
