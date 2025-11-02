import { fetchPokemonList } from '@/api/pokemon';
import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PokemonScreen() {
  const [search, setSearch] = useState('');
  
  const { data, isLoading, isError } = useQuery({
    queryKey: ['pokemonList'],
    queryFn: () => fetchPokemonList(0, 50),
  });

  const filtered = data?.results.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase())
  ) || [];

  const renderItem = ({ item, index }: { item: { name: string; url: string }; index: number }) => {
    const id = parseInt(item.url.split('/').slice(-2, -1)[0]);
    
    return (
      <Pressable
        style={styles.pokemonCard}
        onPress={() => router.push(`/pokemon/${id}`)}
      >
        <View style={styles.cardBg}>
          <View style={styles.idBadge}>
            <Text style={styles.idText}>{String(id).padStart(3, '0')}</Text>
          </View>
          <Text style={styles.name}>{item.name.charAt(0).toUpperCase() + item.name.slice(1)}</Text>
        </View>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.title}>Pokédex</Text>
        <TextInput
          style={styles.search}
          placeholder="Search Pokémon..."
          value={search}
          onChangeText={setSearch}
        />
      </View>
      {isLoading && <ActivityIndicator size="large" color="#2A75BB" style={styles.loader} />}
      {isError && <Text style={styles.error}>Failed to load Pokémon.</Text>}
      {!isLoading && !isError && (
        <FlatList
          data={filtered}
          renderItem={renderItem}
          keyExtractor={item => item.name}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.listContent}
        />
      )}
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
  search: {
    marginTop: 12,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#fff',
    width: '90%',
    fontSize: 16,
    borderWidth: 2,
    borderColor: '#2A75BB',
  },
  loader: {
    marginTop: 32,
  },
  error: {
    color: '#CC0000',
    marginTop: 32,
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
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
