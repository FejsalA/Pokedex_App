import { openDatabaseSync } from 'expo-sqlite';

const db = openDatabaseSync('favorites.db');

type Favorite = { id: number; name: string; type: string };

export async function initFavoritesTable() {
  await db.execAsync(
    'CREATE TABLE IF NOT EXISTS favorites (id INTEGER PRIMARY KEY NOT NULL, name TEXT, type TEXT);'
  );
}

export async function addFavorite(id: number, name: string, type: string) {
  await db.execAsync(`INSERT INTO favorites (id, name, type) VALUES (${id}, '${name}', '${type}');`);
}

export async function removeFavorite(id: number) {
  await db.execAsync(`DELETE FROM favorites WHERE id = ${id};`);
}

export async function getFavorites(): Promise<Favorite[]> {
  const result = await db.getAllAsync('SELECT * FROM favorites;');
  return result as Favorite[];
}

export async function isFavorite(id: number): Promise<boolean> {
  const result = await db.getAllAsync(`SELECT * FROM favorites WHERE id = ${id};`);
  return (result as Favorite[]).length > 0;
}

