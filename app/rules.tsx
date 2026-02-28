import {
  AlienIcon,
  ArrowLeftIcon,
  ChatIcon,
  EyeOffIcon,
  LightbulbIcon,
  TrophyIcon,
  UsersIcon,
  VoteIcon,
} from "@/components/Icons";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown, FadeInLeft } from "react-native-reanimated";

const RULES = [
  {
    Icon: UsersIcon,
    color: "#3498db",
    title: "Preparación",
    description:
      "Agrega entre 3 y 10 jugadores y elige una categoría de palabras.",
  },
  {
    Icon: EyeOffIcon,
    color: "#9b59b6",
    title: "Roles Secretos",
    description:
      "Cada jugador recibe una palabra secreta en su turno, excepto el IMPOSTOR que no la conoce.",
  },
  {
    Icon: ChatIcon,
    color: "#00bcd4",
    title: "Discusión",
    description:
      "Todos describen la palabra sin decirla directamente. El impostor debe disimular que la conoce.",
  },
  {
    Icon: VoteIcon,
    color: "#f1c40f",
    title: "Votación",
    description:
      "Cada jugador vota en secreto a quién cree que es el impostor. El más votado es eliminado.",
  },
  {
    Icon: TrophyIcon,
    color: "#2ecc71",
    title: "¿Quién gana?",
    description:
      "• Tripulantes ganan si votan al impostor.\n• El impostor gana si logra no ser descubierto.",
  },
];

export default function RulesScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <View style={styles.backBtnInner}>
            <ArrowLeftIcon size={22} color="#fff" />
          </View>
        </Pressable>
        <View style={styles.headerCenter}>
          <Text style={styles.headerSubtitle}>CÓMO JUGAR</Text>
          <Text style={styles.headerTitle}>REGLAS</Text>
        </View>
        <View style={styles.headerRight}>
          <AlienIcon size={28} color="#e74c3c" />
        </View>
      </View>

      {/* Divider line */}
      <View style={styles.divider} />

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Timeline */}
        {RULES.map((rule, index) => {
          const isLast = index === RULES.length - 1;
          return (
            <Animated.View
              key={index}
              entering={FadeInDown.delay(index * 120)
                .duration(500)
                .springify()}
              style={styles.timelineRow}
            >
              {/* Left timeline column */}
              <View style={styles.timelineLeft}>
                <View style={[styles.stepDot, { backgroundColor: rule.color }]}>
                  <Text style={styles.stepDotText}>{index + 1}</Text>
                </View>
                {!isLast && (
                  <View
                    style={[
                      styles.timelineLine,
                      { backgroundColor: rule.color + "30" },
                    ]}
                  />
                )}
              </View>

              {/* Card */}
              <View
                style={[styles.ruleCard, { borderColor: rule.color + "20" }]}
              >
                {/* Card header row */}
                <View style={styles.cardHeader}>
                  <View
                    style={[
                      styles.iconCircle,
                      { backgroundColor: rule.color + "18" },
                    ]}
                  >
                    <View
                      style={[
                        styles.iconInner,
                        { backgroundColor: rule.color + "25" },
                      ]}
                    >
                      <rule.Icon size={24} color={rule.color} />
                    </View>
                  </View>
                  <View style={styles.cardTitleWrap}>
                    <Text style={[styles.ruleTitle, { color: rule.color }]}>
                      {rule.title}
                    </Text>
                    <View
                      style={[
                        styles.titleAccent,
                        { backgroundColor: rule.color },
                      ]}
                    />
                  </View>
                </View>

                {/* Description */}
                <Text style={styles.ruleDescription}>{rule.description}</Text>
              </View>
            </Animated.View>
          );
        })}

        {/* Tip box */}
        <Animated.View
          entering={FadeInLeft.delay(650).duration(500).springify()}
          style={styles.tipBox}
        >
          <View style={styles.tipIconWrap}>
            <LightbulbIcon size={22} color="#f1c40f" />
          </View>
          <View style={styles.tipContent}>
            <Text style={styles.tipLabel}>CONSEJO</Text>
            <Text style={styles.tipText}>
              El impostor puede hacer preguntas vagas para descubrir la palabra
              sin levantar sospechas. ¡Sé astuto!
            </Text>
          </View>
        </Animated.View>

        {/* Bottom spacer */}
        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#050610",
  },

  /* ── Header ── */
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 54,
    paddingHorizontal: 20,
    paddingBottom: 14,
  },
  backBtn: {
    padding: 4,
  },
  backBtnInner: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "#ffffff0d",
    borderWidth: 1,
    borderColor: "#ffffff15",
    justifyContent: "center",
    alignItems: "center",
  },
  headerCenter: {
    flex: 1,
    alignItems: "center",
  },
  headerSubtitle: {
    color: "#ffffff50",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 4,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "900",
    letterSpacing: 6,
    marginTop: 2,
  },
  headerRight: {
    width: 38,
    height: 38,
    justifyContent: "center",
    alignItems: "center",
  },
  divider: {
    height: 1,
    backgroundColor: "#ffffff0a",
    marginHorizontal: 20,
    marginBottom: 6,
  },

  /* ── Scroll ── */
  scroll: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 40,
  },

  /* ── Timeline ── */
  timelineRow: {
    flexDirection: "row",
    marginBottom: 4,
  },
  timelineLeft: {
    width: 40,
    alignItems: "center",
  },
  stepDot: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 18,
  },
  stepDotText: {
    color: "#050610",
    fontSize: 13,
    fontWeight: "900",
  },
  timelineLine: {
    width: 2,
    flex: 1,
    marginTop: 4,
    borderRadius: 1,
  },

  /* ── Card ── */
  ruleCard: {
    flex: 1,
    backgroundColor: "#0a0b14",
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginLeft: 8,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  iconInner: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  cardTitleWrap: {
    marginLeft: 12,
    flex: 1,
  },
  ruleTitle: {
    fontSize: 17,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  titleAccent: {
    width: 24,
    height: 3,
    borderRadius: 2,
    marginTop: 4,
    opacity: 0.6,
  },
  ruleDescription: {
    color: "#8890a4",
    fontSize: 13.5,
    lineHeight: 21,
    letterSpacing: 0.2,
  },

  /* ── Tip ── */
  tipBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#f1c40f08",
    borderWidth: 1,
    borderColor: "#f1c40f20",
    borderRadius: 14,
    padding: 14,
    marginTop: 12,
    marginLeft: 48,
  },
  tipIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#f1c40f15",
    justifyContent: "center",
    alignItems: "center",
  },
  tipContent: {
    flex: 1,
    marginLeft: 12,
  },
  tipLabel: {
    color: "#f1c40f",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 2,
    marginBottom: 4,
  },
  tipText: {
    color: "#8890a4",
    fontSize: 13,
    lineHeight: 20,
  },
});
