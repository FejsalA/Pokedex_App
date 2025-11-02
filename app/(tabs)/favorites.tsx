import { PokemonList } from '@/components/ui/pokemon-list';
import { pokemonData } from '@/constants/pokemon';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function FavoritesScreen() {
  // Example: first 2 Pokémon as favorites
  const favorites = pokemonData.slice(0, 2);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.title}>Favorites</Text>
      </View>
      <PokemonList data={favorites} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFCB05',
  },
  header: {
    paddingTop: 24,
    paddingBottom: 8,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2A75BB',
    textShadowColor: '#3B4CCA',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
});
