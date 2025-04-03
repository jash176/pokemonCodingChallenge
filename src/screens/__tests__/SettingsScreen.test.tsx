import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import SettingsScreen from '../settingsscreen';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../contexts/auth';
import { StorageUtils } from '../../utils/storage';
import { Alert } from 'react-native';

// Mock the required modules
jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
}));

jest.mock('../../contexts/auth', () => ({
  useAuth: jest.fn(),
}));

jest.mock('../../utils/storage', () => ({
  StorageUtils: {
    clearAll: jest.fn(),
    removeItem: jest.fn(),
  },
}));

// Mock Alert more effectively
jest.mock('react-native/Libraries/Alert/Alert', () => ({
  alert: jest.fn(),
  Alert: {
    alert: jest.fn((title, message, buttons) => {
      // Find the "Logout" button and call its onPress handler
      const logoutButton = buttons.find((button: any) => button.text === 'Logout');
      if (logoutButton && logoutButton.onPress) {
        logoutButton.onPress();
      }
    }),
  },
}));

describe('SettingsScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders user information correctly', () => {
    // Mock the navigation
    const mockNavigate = jest.fn();
    (useNavigation as jest.Mock).mockReturnValue({
      navigate: mockNavigate,
      goBack: jest.fn(),
    });
    
    // Mock the auth context with user data
    (useAuth as jest.Mock).mockReturnValue({
      logout: jest.fn(),
      user: {
        email: 'ash.ketchum@pokemon.com',
        displayName: 'Ash Ketchum',
      },
    });

    const { getByText } = render(<SettingsScreen />);
    
    // Check if user name and email are displayed
    expect(getByText('Ash Ketchum')).toBeTruthy();
    expect(getByText('ash.ketchum@pokemon.com')).toBeTruthy();
  });

  it('calls logout function when logout button is pressed', async () => {
    const { getByTestId } = render(<SettingsScreen />);
    
    // Simulate pressing the logout button
    fireEvent.press(getByTestId('btn-logout'));

    // Check if alert is displayed
    expect(Alert.alert).toHaveBeenCalledWith(
      'Logout',
      'Are you sure you want to logout? This will also clear your team data.',
      expect.any(Array) // Expecting buttons array
    );
  });
  it('calls StorageUtils.clearAll and logout when confirmed', async () => {
    jest.spyOn(Alert, 'alert').mockImplementation((_, __, buttons) => {
      // Simulate pressing "Logout"
      const logoutButton = buttons?.find(button => button.text === 'Logout');
      logoutButton?.onPress?.();
    });

    const { getByTestId } = render(<SettingsScreen />);
    
    fireEvent.press(getByTestId('btn-logout'));

    await waitFor(() => {
      expect(StorageUtils.clearAll).toHaveBeenCalled();
    });
  });
});