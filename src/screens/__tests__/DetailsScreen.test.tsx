import React from 'react';
import { render } from '@testing-library/react-native';
import PokemonDetailScreen from '../DetailsScreen';
import { useNavigation, useRoute } from '@react-navigation/native';
import { usePokemonDetails } from '../../hooks/usePokemonDetails';

// Mock the required modules
jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
  useRoute: jest.fn(),
}));

jest.mock('../../hooks/usePokemonDetails', () => ({
  usePokemonDetails: jest.fn(),
}));

describe('PokemonDetailScreen', () => {
  it('renders pokemon details correctly', () => {
    // Mock the navigation and route
    const mockNavigate = jest.fn();
    (useNavigation as jest.Mock).mockReturnValue({
      navigate: mockNavigate,
      goBack: jest.fn(),
    });
    
    (useRoute as jest.Mock).mockReturnValue({
      params: {
        url: 'https://pokeapi.co/api/v2/pokemon/1/',
        name: 'bulbasaur',
      },
    });
    
    // Mock the pokemon details data
    const mockPokemonData = {
      id: 1,
      name: 'bulbasaur',
      height: 7,
      weight: 69,
      base_experience: 64,
      types: [
        { type: { name: 'grass' } },
        { type: { name: 'poison' } },
      ],
      abilities: [
        { ability: { name: 'overgrow' }, is_hidden: false },
        { ability: { name: 'chlorophyll' }, is_hidden: true },
      ],
      stats: [
        { stat: { name: 'hp' }, base_stat: 45 },
        { stat: { name: 'attack' }, base_stat: 49 },
        { stat: { name: 'defense' }, base_stat: 49 },
      ],
      moves: [
        { move: { name: 'razor-wind' } },
        { move: { name: 'swords-dance' } },
        { move: { name: 'cut' } },
        { move: { name: 'bind' } },
        { move: { name: 'vine-whip' } },
        { move: { name: 'headbutt' } },
      ],
    };
    
    (usePokemonDetails as jest.Mock).mockReturnValue({
      data: mockPokemonData,
      isLoading: false,
      isError: false,
      error: null,
    });

    const { getByText } = render(<PokemonDetailScreen />);
    
    // Check if pokemon name is displayed
    expect(getByText('Bulbasaur')).toBeTruthy();
    
    // Check if pokemon types are displayed
    expect(getByText('Grass')).toBeTruthy();
    expect(getByText('Poison')).toBeTruthy();
    
    // Check if pokemon stats are displayed
    expect(getByText('HP')).toBeTruthy();
    expect(getByText('45')).toBeTruthy();
    
    // Check if pokemon abilities are displayed
    expect(getByText('Overgrow')).toBeTruthy();
    expect(getByText('(Hidden)')).toBeTruthy();
    
    // Check if pokemon moves are displayed
    expect(getByText('Razor Wind')).toBeTruthy();
    expect(getByText('+1 more moves')).toBeTruthy();
  });

  it('renders loading state correctly', () => {
    // Mock the navigation and route
    (useNavigation as jest.Mock).mockReturnValue({
      navigate: jest.fn(),
      goBack: jest.fn(),
    });
    
    (useRoute as jest.Mock).mockReturnValue({
      params: {
        url: 'https://pokeapi.co/api/v2/pokemon/1/',
        name: 'bulbasaur',
      },
    });
    
    // Mock loading state
    (usePokemonDetails as jest.Mock).mockReturnValue({
      data: null,
      isLoading: true,
      isError: false,
      error: null,
    });

    const { getByText } = render(<PokemonDetailScreen />);
    
    // Check if loading text is displayed
    expect(getByText('Loading bulbasaur...')).toBeTruthy();
  });
});