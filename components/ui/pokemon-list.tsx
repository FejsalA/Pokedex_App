import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

export interface Pokemon {
  id: number;
  name: string;
  type: string;
}

interface PokemonListProps {
  data: Pokemon[];
}

export const PokemonList: React.FC<PokemonListProps> = ({ data }) => {
  const router = useRouter();

  const renderItem = ({ item }: { item: Pokemon }) => (
    <Pressable
      style={styles.pokemonCard}
      onPress={() => router.push(`/pokemon/${item.id}`)}
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
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={item => item.id.toString()}
      numColumns={2}
      columnWrapperStyle={styles.row}
      contentContainerStyle={styles.listContent}
    />
  );
};

const styles = StyleSheet.create({
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
