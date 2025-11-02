import { pokemonData } from '@/constants/pokemon';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PokemonDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const pokemon = pokemonData.find(p => p.id === Number(id));

  if (!pokemon) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.title}>Pokémon Not Found</Text>
        </View>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backText}>Go Back</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.title}>{pokemon.name}</Text>
        <View style={styles.idBadge}>
          <Text style={styles.idText}>{String(pokemon.id).padStart(3, '0')}</Text>
        </View>
        <View style={[styles.typeBadge, { backgroundColor: getTypeColor(pokemon.type) }]}> 
          <Text style={styles.typeText}>{pokemon.type}</Text>
        </View>
      </View>
      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backText}>Go Back</Text>
      </Pressable>
    </SafeAreaView>
  );
}

function getTypeColor(type: string) {
  switch (type) {
    case 'Electric': return '#F8D030';
    case 'Fire': return '#F08030';
    case 'Water': return '#6890F0';
    case 'Grass': return '#78C850';
    case 'Ghost': return '#705898';
    case 'Psychic': return '#F85888';
    default: return '#A8A878';
  }
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFCB05',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2A75BB',
    textShadowColor: '#3B4CCA',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
    marginBottom: 8,
  },
  idBadge: {
    backgroundColor: '#6C47FF',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginBottom: 8,
  },
  idText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  typeBadge: {
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginBottom: 8,
  },
  typeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  backButton: {
    marginTop: 16,
    backgroundColor: '#2A75BB',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
  },
  backText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
