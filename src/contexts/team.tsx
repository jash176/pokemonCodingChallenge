import React, { createContext, useContext, useState, useEffect } from 'react';
import { StorageUtils } from '../utils/storage';

export interface Pokemon {
  name: string;
  url: string;
}

interface TeamContextType {
  team: Pokemon[];
  addPokemon: (pokemon: Pokemon) => boolean;
  removePokemon: (pokemonName: string) => void;
  isPokemonInTeam: (pokemonName: string) => boolean;
}

export const TeamContext = createContext<TeamContextType | undefined>(undefined);

export function TeamProvider({ children }: { children: React.ReactNode }) {
  const [team, setTeam] = useState<Pokemon[]>([]);

  // Load team from storage on initial load
  useEffect(() => {
    const storedTeam = StorageUtils.getItem('pokemon-team');
    if (storedTeam) {
      setTeam(storedTeam);
    }
  }, []);

  // Save team to storage whenever it changes
  useEffect(() => {
    StorageUtils.setItem('pokemon-team', team);
  }, [team]);

  // Add a Pokemon to the team (max 6)
  const addPokemon = (pokemon: Pokemon): boolean => {
    // Check if team is already full (max 6 Pokémon)
    if (team.length >= 6) {
      return false;
    }
    
    // Check if Pokémon is already in team
    if (team.some(p => p.name === pokemon.name)) {
      return false;
    }
    
    setTeam(prevTeam => [...prevTeam, pokemon]);
    return true;
  };

  // Remove a Pokemon from the team
  const removePokemon = (pokemonName: string) => {
    setTeam(prevTeam => prevTeam.filter(pokemon => pokemon.name !== pokemonName));
  };

  // Check if a Pokemon is already in the team
  const isPokemonInTeam = (pokemonName: string): boolean => {
    return team.some(pokemon => pokemon.name === pokemonName);
  };

  return (
    <TeamContext.Provider
      value={{
        team,
        addPokemon,
        removePokemon,
        isPokemonInTeam,
      }}
    >
      {children}
    </TeamContext.Provider>
  );
}

export function useTeam() {
  const context = useContext(TeamContext);
  if (!context) {
    throw new Error('useTeam must be used within TeamProvider');
  }
  return context;
}