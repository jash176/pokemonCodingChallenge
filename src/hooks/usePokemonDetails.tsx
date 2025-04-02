import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { pokemonApi } from '../api/pokemon';

export const usePokemonDetails = (url: string) => {
  return useQuery({
    queryKey: [url],
    queryFn: () => pokemonApi.fetchDetail(url),
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    retry: 2, // Retry twice on failure
  });
};
