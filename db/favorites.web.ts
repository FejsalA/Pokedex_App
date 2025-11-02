import AsyncStorage from '@react-native-async-storage/async-storage';

type Favorite = { id: number; name: string; type: string };

export async function initFavoritesTable() {
  // No initialization needed for AsyncStorage
}

export async function addFavorite(id: number, name: string, type: string) {
  const favs = await getFavorites();
  favs.push({ id, name, type });
  await AsyncStorage.setItem('favorites', JSON.stringify(favs));
}

export async function removeFavorite(id: number) {
  let favs = await getFavorites();
  favs = favs.filter(f => f.id !== id);
  await AsyncStorage.setItem('favorites', JSON.stringify(favs));
}

export async function getFavorites(): Promise<Favorite[]> {
  const favs = await AsyncStorage.getItem('favorites');
  return favs ? JSON.parse(favs) : [];
}

export async function isFavorite(id: number): Promise<boolean> {
  const favs = await getFavorites();
  return favs.some(f => f.id === id);
}
