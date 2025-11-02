import { fetchPokemonDetail } from '@/api/pokemon';
import { addFavorite, initFavoritesTable, isFavorite, removeFavorite } from '@/db/favorites';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, Pressable, Share, StyleSheet, Text, View } from 'react-native';
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
  const AboutRoute = () => (
    <View style={styles.tabContent}>
      <Text style={styles.title}>{data.name}</Text>
      <View style={styles.actionRow}>
        <Pressable style={[styles.favoriteBtn, favorite ? styles.favActive : styles.favInactive]} onPress={handleFavorite}>
          <Text style={styles.favoriteText}>{favorite ? '❤️ Unfavorite' : '🤍 Favorite'}</Text>
        </Pressable>
        <Pressable style={styles.shareBtn} onPress={handleShare}>
          <Text style={styles.favoriteText}>🔗 Share</Text>
        </Pressable>
      </View>
      <View style={[styles.typeBadge, { backgroundColor: getTypeColor(data.types[0]?.type.name) }]}> 
        <Text style={styles.typeText}>{data.types.map((t: any) => t.type.name).join(', ')}</Text>
      </View>
      <Text style={styles.sectionTitle}>Height</Text>
      <Text>{data.height}</Text>
      <Text style={styles.sectionTitle}>Weight</Text>
      <Text>{data.weight}</Text>
    </View>
  );

  // Stats Tab
  const StatsRoute = () => (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Stats</Text>
      {data.stats.map((stat: any) => (
        <View key={stat.stat.name} style={styles.statRow}>
          <Text style={styles.statName}>{stat.stat.name}</Text>
          <Text style={styles.statValue}>{stat.base_stat}</Text>
        </View>
      ))}
    </View>
  );

  // Evolution Tab
  const EvolutionRoute = () => (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Evolution Chain</Text>
      {isEvoLoading && <ActivityIndicator size="small" color="#2A75BB" />}
      {isEvoError && <Text style={styles.error}>Failed to load evolution chain.</Text>}
      {evolutionData && (
        <View style={styles.evoChain}>
          {renderEvolutionChain(evolutionData.chain)}
        </View>
      )}
    </View>
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
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: Dimensions.get('window').width }}
        renderTabBar={props => (
          <TabBar
            {...props}
            indicatorStyle={{ backgroundColor: '#2A75BB' }}
            style={{ backgroundColor: '#FFCB05' }}
            activeColor="#2A75BB"
            inactiveColor="#888"
            tabStyle={{}}
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
    backgroundColor: '#FFCB05',
  },
  tabContent: {
    flex: 1,
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2A75BB',
    marginBottom: 12,
  },
  typeBadge: {
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginBottom: 16,
  },
  typeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    color: '#2A75BB',
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginBottom: 4,
  },
  statName: {
    fontWeight: 'bold',
    color: '#3B4CCA',
  },
  statValue: {
    color: '#2A75BB',
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
  },
  evoStage: {
    fontWeight: 'bold',
    color: '#2A75BB',
    fontSize: 16,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    marginVertical: 8,
  },
  favoriteBtn: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
  },
  shareBtn: {
    backgroundColor: '#6C47FF',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
  },
  favActive: {
    backgroundColor: '#F08030',
  },
  favInactive: {
    backgroundColor: '#6C47FF',
  },
  favoriteText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
