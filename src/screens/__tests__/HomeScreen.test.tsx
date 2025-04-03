import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import HomeScreen from '../HomeScreen';
import { useNavigation } from '@react-navigation/native';
import { useFetchPokemon } from '../../hooks/useFetchPokemon';
import { useTeam } from '../../contexts/team';

// Mock the required modules
jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
}));

jest.mock('../../hooks/useFetchPokemon', () => ({
  useFetchPokemon: jest.fn(),
}));

jest.mock('../../contexts/team', () => ({
  useTeam: jest.fn(),
}));

jest.mock('@gorhom/bottom-sheet', () => {
  const BottomSheetModalProvider = ({ children }: { children: React.ReactNode }) => children;
  return {
    __esModule: true,
    default: () => null,
    BottomSheetModalProvider,
  };
});

jest.mock('@react-native-firebase/messaging', () => {
  return () => ({
    getInitialNotification: jest.fn(() => Promise.resolve(null)),
    onNotificationOpenedApp: jest.fn(() => Promise.resolve()),
  });
});

describe('HomeScreen', () => {

  it('navigates to Teams screen when Teams button is pressed', () => {
    // Mock the hooks with some data
    (useFetchPokemon as jest.Mock).mockReturnValue({
      data: {
        pages: [
          {
            results: [
              { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
              { name: 'ivysaur', url: 'https://pokeapi.co/api/v2/pokemon/2/' },
            ],
          },
        ],
      },
      fetchNextPage: jest.fn(),
      hasNextPage: true,
      isFetchingNextPage: false,
      isLoading: false,
      error: null,
    });
    
    (useTeam as jest.Mock).mockReturnValue({
      addPokemon: jest.fn(),
      isPokemonInTeam: jest.fn(() => false),
    });
    
    const mockNavigate = jest.fn();
    (useNavigation as jest.Mock).mockReturnValue({
      navigate: mockNavigate,
    });

    const { getByText } = render(<HomeScreen />);
    
    // Press the Teams button
    fireEvent.press(getByText('Teams'));
    
    // Check if navigation was called with correct screen
    expect(mockNavigate).toHaveBeenCalledWith('Teams');
  });
});