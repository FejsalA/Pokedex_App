import { fetchPokemonList } from '@/api/pokemon';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, FlatList, Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
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
    const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
    
    return (
      <Pressable
        style={styles.pokemonCard}
        onPress={() => router.push(`/pokemon/${id}`)}
      >
        <View style={styles.cardBg}>
          <View style={styles.cardHeader}>
            <View style={styles.idBadge}>
              <Text style={styles.idText}>{String(id).padStart(3, '0')}</Text>
            </View>
            <Pressable style={styles.menuButton}>
              <Ionicons name="ellipsis-vertical" size={20} color="#000" />
            </Pressable>
          </View>
          <Image 
            source={{ uri: imageUrl }} 
            style={styles.pokemonImage}
            resizeMode="contain"
          />
          <Text style={styles.name}>{item.name.charAt(0).toUpperCase() + item.name.slice(1)}</Text>
        </View>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.titleHeader}>All Pokémon</Text>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
          <TextInput
            style={styles.search}
            placeholder="Search for Pokémon.."
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>
      {isLoading && <ActivityIndicator size="large" color="#6C47FF" style={styles.loader} />}
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
    backgroundColor: '#E8EAF6', // Light purple/blue background
  },
  header: {
    paddingTop: 8,
    paddingBottom: 16,
    paddingHorizontal: 16,
    backgroundColor: '#E8EAF6',
  },
  titleHeader: {
    fontSize: 28,
    fontWeight: 'bold',
    fontFamily: 'Rubik-Bold',
    color: '#1A1A2E',
    marginBottom: 12,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  search: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Rubik-Regular',
    color: '#000',
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
    paddingHorizontal: 8,
    paddingBottom: 16,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  pokemonCard: {
    flex: 1,
    marginHorizontal: 8,
  },
  cardBg: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  idBadge: {
    backgroundColor: '#6C47FF',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  idText: {
    color: '#fff',
    fontWeight: 'bold',
    fontFamily: 'Rubik-Bold',
    fontSize: 12,
  },
  menuButton: {
    padding: 4,
  },
  pokemonImage: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginVertical: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Rubik-Bold',
    color: '#1A1A2E',
    textAlign: 'center',
  },
});
