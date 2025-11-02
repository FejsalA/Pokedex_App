import axios from 'axios';

export interface PokemonListItem {
  name: string;
  url: string;
}

export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonListItem[];
}

export async function fetchPokemonList(offset = 0, limit = 50): Promise<PokemonListResponse> {
  const response = await axios.get<PokemonListResponse>(
    `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`
  );
  return response.data;
}

export async function fetchPokemonDetail(name: string) {
  const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`);
  return response.data;
}
