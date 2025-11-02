import { fetchPokemonDetail } from '@/api/pokemon';
import { addFavorite, initFavoritesTable, isFavorite, removeFavorite } from '@/db/favorites';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, Image, Pressable, ScrollView, Share, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SceneMap, TabBar, TabView } from 'react-native-tab-view';

async function fetchEvolutionChain(speciesUrl: string) {
  const speciesRes = await axios.get(speciesUrl);
  const evoUrl = speciesRes.data.evolution_chain.url;
  const evoRes = await axios.get(evoUrl);
  return evoRes.data;
}

export default function PokemonDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, isLoading, isError } = useQuery({
    queryKey: ['pokemonDetail', id],
    queryFn: () => fetchPokemonDetail(id!),
    enabled: !!id,
  });

  // Favorite state
  const [favorite, setFavorite] = useState(false);

  useEffect(() => {
    initFavoritesTable();
    if (data) {
      isFavorite(data.id).then(setFavorite);
    }
  }, [data]);

  const handleFavorite = () => {
    if (!data) return;
    if (favorite) {
      removeFavorite(data.id);
      setFavorite(false);
    } else {
      addFavorite(data.id, data.name, data.types[0]?.type.name || '');
      setFavorite(true);
    }
  };

  const handleShare = async () => {
    if (!data) return;
    try {
      await Share.share({
        message: `Check out ${data.name}! https://pokeapi.co/api/v2/pokemon/${data.id}`,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const speciesUrl = data?.species?.url;
  const {
    data: evolutionData,
    isLoading: isEvoLoading,
    isError: isEvoError,
  } = useQuery({
    queryKey: ['evolutionChain', speciesUrl],
    queryFn: () => fetchEvolutionChain(speciesUrl!),
    enabled: !!speciesUrl,
  });

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'about', title: 'About' },
    { key: 'stats', title: 'Stats' },
    { key: 'evolution', title: 'Evolution' },
  ]);

  // About Tab
  const AboutRoute = () => {
    const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${data.id}.png`;
    
    return (
      <ScrollView style={styles.tabContent} contentContainerStyle={styles.tabScrollContent}>
        <Image 
          source={{ uri: imageUrl }} 
          style={styles.pokemonImage}
          resizeMode="contain"
        />
        
        <View style={styles.infoGrid}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Name</Text>
            <Text style={styles.infoValue}>{data.name.charAt(0).toUpperCase() + data.name.slice(1)}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>ID</Text>
            <Text style={styles.infoValue}>{String(data.id).padStart(3, '0')}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Base</Text>
            <Text style={styles.infoValue}>{data.base_experience || 64} XP</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Weight</Text>
            <Text style={styles.infoValue}>{(data.weight / 10).toFixed(1)} kg</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Height</Text>
            <Text style={styles.infoValue}>{(data.height / 10).toFixed(1)} m</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Types</Text>
            <Text style={styles.infoValue}>
              {data.types.map((t: any) => t.type.name.charAt(0).toUpperCase() + t.type.name.slice(1)).join(', ')}
            </Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Abilities</Text>
            <Text style={styles.infoValue}>
              {data.abilities?.map((a: any) => a.ability.name.charAt(0).toUpperCase() + a.ability.name.slice(1)).join(', ') || 'Unknown'}
            </Text>
          </View>
        </View>
      </ScrollView>
    );
  };

  // Stats Tab
  const StatsRoute = () => (
    <ScrollView style={styles.tabContent} contentContainerStyle={styles.tabScrollContent}>
      <Text style={styles.sectionTitle}>Stats</Text>
      {data.stats.map((stat: any) => (
        <View key={stat.stat.name} style={styles.infoRow}>
          <Text style={styles.statName}>{stat.stat.name.replace('-', ' ')}</Text>
          <Text style={styles.statValue}>{stat.base_stat}</Text>
        </View>
      ))}
    </ScrollView>
  );

  // Evolution Tab
  const EvolutionRoute = () => (
    <ScrollView style={styles.tabContent} contentContainerStyle={styles.tabScrollContent}>
      <Text style={styles.sectionTitle}>Evolution Chain</Text>
      {isEvoLoading && <ActivityIndicator size="small" color="#5D5FEF" />}
      {isEvoError && <Text style={styles.error}>Failed to load evolution chain.</Text>}
      {evolutionData && (
        <View style={styles.evoChain}>
          {renderEvolutionChain(evolutionData.chain)}
        </View>
      )}
    </ScrollView>
  );

  const renderScene = SceneMap({
    about: AboutRoute,
    stats: StatsRoute,
    evolution: EvolutionRoute,
  });

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ActivityIndicator size="large" color="#2A75BB" />
      </SafeAreaView>
    );
  }
  if (isError || !data) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Text style={styles.error}>Failed to load Pokémon details.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerBar}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color="#000" />
          <Text style={styles.backText}>Vorige</Text>
        </Pressable>
        <Pressable onPress={handleFavorite} style={styles.favoriteButton}>
          <Ionicons 
            name={favorite ? "heart" : "heart-outline"} 
            size={28} 
            color={favorite ? "#FF6B6B" : "#000"} 
          />
        </Pressable>
      </View>
      
      <View style={styles.titleSection}>
        <Text style={styles.pokemonName}>{data.name.charAt(0).toUpperCase() + data.name.slice(1)}</Text>
        <Text style={styles.pokemonId}>#{String(data.id).padStart(3, '0')}</Text>
      </View>
      
      <View style={styles.typeBadgesContainer}>
        {data.types.map((t: any) => (
          <View 
            key={t.type.name} 
            style={[styles.typeBadge, { backgroundColor: getTypeColor(t.type.name) }]}
          >
            <Text style={styles.typeText}>● {t.type.name.charAt(0).toUpperCase() + t.type.name.slice(1)}</Text>
          </View>
        ))}
      </View>
      
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: Dimensions.get('window').width }}
        renderTabBar={props => (
          <TabBar
            {...props}
            indicatorStyle={styles.tabIndicator}
            style={styles.tabBar}
            activeColor="#5D5FEF"
            inactiveColor="#9E9E9E"
          />
        )}
      />
    </SafeAreaView>
  );
}

function renderEvolutionChain(chain: any) {
  const evoStages = [];
  let current = chain;
  while (current) {
    evoStages.push(current.species.name);
    current = current.evolves_to[0];
  }
  return evoStages.map((name: string, idx: number) => (
    <Text key={name} style={styles.evoStage}>
      {name}
      {idx < evoStages.length - 1 ? ' → ' : ''}
    </Text>
  ));
}

function getTypeColor(type: string) {
  switch (type) {
    case 'electric': return '#F8D030';
    case 'fire': return '#F08030';
    case 'water': return '#6890F0';
    case 'grass': return '#78C850';
    case 'ghost': return '#705898';
    case 'psychic': return '#F85888';
    default: return '#A8A878';
  }
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    fontSize: 16,
    color: '#000',
    marginLeft: 4,
    fontFamily: 'Rubik-Regular',
  },
  favoriteButton: {
    padding: 4,
  },
  titleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    marginBottom: 12,
  },
  pokemonName: {
    fontSize: 32,
    fontWeight: 'bold',
    fontFamily: 'Rubik-Bold',
    color: '#1A1A2E',
  },
  pokemonId: {
    fontSize: 20,
    color: '#9E9E9E',
    fontFamily: 'Rubik-Medium',
  },
  typeBadgesContainer: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  typeBadge: {
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  typeText: {
    color: '#fff',
    fontWeight: '600',
    fontFamily: 'Rubik-SemiBold',
    fontSize: 14,
  },
  tabBar: {
    backgroundColor: '#fff',
    elevation: 0,
    shadowOpacity: 0,
  },
  tabIndicator: {
    backgroundColor: '#5D5FEF',
    height: 3,
  },
  tabContent: {
    flex: 1,
    backgroundColor: '#fff',
  },
  tabScrollContent: {
    padding: 24,
  },
  pokemonImage: {
    width: 200,
    height: 200,
    alignSelf: 'center',
    marginBottom: 24,
  },
  infoGrid: {
    width: '100%',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Rubik-Bold',
    color: '#1A1A2E',
  },
  infoValue: {
    fontSize: 16,
    color: '#6E6E6E',
    fontFamily: 'Rubik-Regular',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'Rubik-Bold',
    marginTop: 16,
    marginBottom: 8,
    color: '#2A75BB',
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: 8,
    paddingHorizontal: 24,
  },
  statName: {
    fontWeight: 'bold',
    color: '#1A1A2E',
    fontFamily: 'Rubik-Bold',
    fontSize: 16,
    textTransform: 'capitalize',
  },
  statValue: {
    color: '#6E6E6E',
    fontFamily: 'Rubik-Regular',
    fontSize: 16,
  },
  error: {
    color: 'red',
    marginTop: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  evoChain: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
    marginBottom: 16,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  evoStage: {
    fontWeight: 'bold',
    color: '#5D5FEF',
    fontSize: 18,
    fontFamily: 'Rubik-Bold',
  },
});
