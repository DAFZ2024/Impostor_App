import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type PlayerCardProps = {
  name: string;
  index: number;
  onRemove?: () => void;
  showRemove?: boolean;
  isSelected?: boolean;
  onPress?: () => void;
  votes?: number;
  showVotes?: boolean;
  isImpostor?: boolean;
  showImpostor?: boolean;
};

const PLAYER_COLORS = [
  '#e74c3c', '#3498db', '#2ecc71', '#f1c40f', '#9b59b6',
  '#e67e22', '#1abc9c', '#e91e63', '#00bcd4', '#ff5722',
];

export default function PlayerCard({
  name,
  index,
  onRemove,
  showRemove = false,
  isSelected = false,
  onPress,
  votes,
  showVotes = false,
  isImpostor = false,
  showImpostor = false,
}: PlayerCardProps) {
  const color = PLAYER_COLORS[index % PLAYER_COLORS.length];

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.card,
        { borderColor: color },
        isSelected && { backgroundColor: color + '40' },
      ]}
    >
      <View style={[styles.avatar, { backgroundColor: color }]}>
        <MaterialCommunityIcons name="account" size={28} color="#fff" />
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>{name}</Text>
        {showVotes && (
          <Text style={styles.votes}>
            {votes} {votes === 1 ? 'voto' : 'votos'}
          </Text>
        )}
      </View>
      {showImpostor && (
        <View style={[styles.badge, isImpostor ? styles.badgeImpostor : styles.badgeCrew]}>
          <Text style={styles.badgeText}>
            {isImpostor ? '🔪 IMPOSTOR' : '✅ INOCENTE'}
          </Text>
        </View>
      )}
      {showRemove && onRemove && (
        <Pressable onPress={onRemove} style={styles.removeBtn}>
          <MaterialCommunityIcons name="close-circle" size={24} color="#e74c3c" />
        </Pressable>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    borderWidth: 2,
    padding: 12,
    marginVertical: 5,
    width: '100%',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  votes: {
    color: '#aaa',
    fontSize: 13,
    marginTop: 2,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  badgeImpostor: {
    backgroundColor: '#e74c3c40',
  },
  badgeCrew: {
    backgroundColor: '#2ecc7140',
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '800',
  },
  removeBtn: {
    padding: 5,
  },
});
