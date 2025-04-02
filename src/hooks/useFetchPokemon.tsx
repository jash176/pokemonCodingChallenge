import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';
import { pokemonApi } from '../api/pokemon';

const fetchPokemon = async ({ pageParam = 0 }) => {
  try {
    const response = await axios.get(`https://pokeapi.co/api/v2/pokemon?limit=10&offset=${pageParam}`);
    return {
      results: response.data.results,
      nextOffset: pageParam + 10,
    };
  } catch (error) {
    throw new Error('Failed to fetch Pokémon. Please try again.');
  }
};

export const useFetchPokemon = () => {
  return useInfiniteQuery({
    queryKey: ['pokemon'],
    queryFn: pokemonApi.fetch,
    getNextPageParam: (lastPage) => lastPage.nextOffset,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    retry: 2, // Retry twice on failure
    initialPageParam: 0,
  });
};
