import { pokemonData } from '@/constants/pokemon';
import React from 'react';
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PokemonScreen() {
  const renderItem = ({ item }) => (
    <Pressable
      style={styles.pokemonCard}
      onPress={() => Alert.alert('Catch Pokémon', `You caught ${item.name}!`)}
    >
      <View style={styles.cardBg}>
        <View style={styles.idBadge}>
          <Text style={styles.idText}>{String(item.id).padStart(3, '0')}</Text>
        </View>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.type}>{item.type}</Text>
      </View>
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.title}>Pokédex</Text>
      </View>
      <FlatList
        data={pokemonData}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFCB05', // Pokémon yellow
  },
  header: {
    paddingTop: 24,
    paddingBottom: 8,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2A75BB', // Pokémon blue
    textShadowColor: '#3B4CCA',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  pokemonCard: {
    flex: 1,
    marginHorizontal: 8,
    backgroundColor: 'transparent',
    borderRadius: 16,
    shadowColor: '#3B4CCA',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  cardBg: {
    backgroundColor: '#E0E7FF',
    borderRadius: 16,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
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
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2A75BB',
    marginBottom: 4,
  },
  type: {
    fontSize: 14,
    color: '#6C47FF',
    fontWeight: '600',
  },
});
