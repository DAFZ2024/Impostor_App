import React from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const RULES = [
  {
    icon: 'account-group' as const,
    color: '#3498db',
    title: 'Preparación',
    description: 'Agrega entre 3 y 10 jugadores y elige una categoría de palabras.',
  },
  {
    icon: 'eye-off' as const,
    color: '#9b59b6',
    title: 'Roles Secretos',
    description:
      'Cada jugador recibe una palabra secreta en su turno, excepto el IMPOSTOR que no la conoce.',
  },
  {
    icon: 'chat-processing' as const,
    color: '#00bcd4',
    title: 'Discusión',
    description:
      'Todos describen la palabra sin decirla directamente. El impostor debe disimular que la conoce.',
  },
  {
    icon: 'vote' as const,
    color: '#f1c40f',
    title: 'Votación',
    description:
      'Cada jugador vota en secreto a quién cree que es el impostor. El más votado es eliminado.',
  },
  {
    icon: 'trophy' as const,
    color: '#2ecc71',
    title: '¿Quién gana?',
    description:
      '• Tripulantes ganan si votan al impostor.\n• El impostor gana si logra no ser descubierto.',
  },
];

export default function RulesScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <MaterialCommunityIcons name="arrow-left" size={28} color="#fff" />
        </Pressable>
        <Text style={styles.headerTitle}>REGLAS DEL JUEGO</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {RULES.map((rule, index) => (
          <View key={index} style={styles.ruleCard}>
            <View style={styles.ruleNumber}>
              <Text style={styles.ruleNumberText}>{index + 1}</Text>
            </View>
            <View style={[styles.iconCircle, { backgroundColor: rule.color + '25' }]}>
              <MaterialCommunityIcons name={rule.icon} size={30} color={rule.color} />
            </View>
            <Text style={[styles.ruleTitle, { color: rule.color }]}>{rule.title}</Text>
            <Text style={styles.ruleDescription}>{rule.description}</Text>
          </View>
        ))}

        <View style={styles.tipBox}>
          <MaterialCommunityIcons name="lightbulb-on" size={24} color="#f1c40f" />
          <Text style={styles.tipText}>
            El impostor puede hacer preguntas vagas para descubrir la palabra sin levantar sospechas.
            ¡Sé astuto!
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b0c10',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  backBtn: {
    padding: 5,
  },
  headerTitle: {
    color: '#00ffff',
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 3,
    marginLeft: 10,
  },
  scroll: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  ruleCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 15,
    padding: 20,
    marginBottom: 12,
    alignItems: 'center',
  },
  ruleNumber: {
    position: 'absolute',
    top: -10,
    left: -5,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#00ffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ruleNumberText: {
    color: '#0b0c10',
    fontSize: 14,
    fontWeight: '900',
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  ruleTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 6,
  },
  ruleDescription: {
    color: '#aaa',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
  },
  tipBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1c40f15',
    borderWidth: 1,
    borderColor: '#f1c40f40',
    borderRadius: 12,
    padding: 15,
    gap: 12,
    marginTop: 10,
  },
  tipText: {
    color: '#ccc',
    fontSize: 13,
    flex: 1,
    lineHeight: 19,
  },
});
