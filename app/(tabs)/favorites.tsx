import { getFavorites, initFavoritesTable, removeFavorite } from '@/db/favorites';
import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Favorite = { id: number; name: string; type: string };

export default function FavoritesScreen() {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);

  const loadFavorites = async () => {
    setLoading(true);
    await initFavoritesTable();
    const favs = await getFavorites();
    setFavorites(favs);
    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [])
  );

  const handleUnfavorite = async (id: number) => {
    await removeFavorite(id);
    await loadFavorites();
  };

  const renderItem = ({ item }: { item: Favorite }) => (
    <Pressable
      style={styles.pokemonCard}
      onPress={() => router.push(`/pokemon/${item.id}`)}
    >
      <View style={styles.cardBg}>
        <View style={styles.idBadge}>
          <Text style={styles.idText}>{String(item.id).padStart(3, '0')}</Text>
        </View>
        <Text style={styles.name}>{item.name.charAt(0).toUpperCase() + item.name.slice(1)}</Text>
        <Text style={styles.type}>{item.type}</Text>
        <Pressable style={styles.unfavoriteBtn} onPress={() => handleUnfavorite(item.id)}>
          <Text style={styles.unfavoriteText}>❌ Remove</Text>
        </Pressable>
      </View>
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.title}>Favorites</Text>
      </View>
      {loading && <ActivityIndicator size="large" color="#2A75BB" style={styles.loader} />}
      {!loading && favorites.length === 0 && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No favorites yet!</Text>
          <Text style={styles.emptySubtext}>Add Pokémon to your favorites from their detail page.</Text>
        </View>
      )}
      {!loading && favorites.length > 0 && (
        <FlatList
          data={favorites}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
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
    fontFamily: 'Rubik-Bold',
    color: '#2A75BB',
    textShadowColor: '#3B4CCA',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  loader: {
    marginTop: 32,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'Rubik-Bold',
    color: '#2A75BB',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 16,
    fontFamily: 'Rubik-Regular',
    color: '#3B4CCA',
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
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2A75BB',
    marginBottom: 4,
    textAlign: 'center',
  },
  type: {
    fontSize: 14,
    color: '#6C47FF',
    fontWeight: '600',
    marginBottom: 8,
  },
  unfavoriteBtn: {
    backgroundColor: '#F08030',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  unfavoriteText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
});
