import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import LoginScreen from '../LoginScreen';
import { useNavigation } from '@react-navigation/native';
import { useLoginMutation } from '../../hooks/useLogin';
import { useGoogleLogin } from '../../hooks/useGoogleLogin';

// Fix the import paths and add proper typing
jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
}));

jest.mock('../../hooks/useLogin', () => ({
  useLoginMutation: jest.fn(),
}));

jest.mock('../../hooks/useGoogleLogin', () => ({
  useGoogleLogin: jest.fn(),
}));

describe('LoginScreen', () => {
  // Add proper types for the mocked functions and navigation
  let navigation: { navigate: jest.Mock };
  let loginUser: jest.Mock;
  let loginWithGoogle: jest.Mock;

  beforeEach(() => {
    navigation = { navigate: jest.fn() };
    (useNavigation as jest.Mock).mockReturnValue(navigation);
    
    loginUser = jest.fn();
    loginWithGoogle = jest.fn();
    
    (useLoginMutation as jest.Mock).mockReturnValue({ mutateAsync: loginUser, isPending: false });
    (useGoogleLogin as jest.Mock).mockReturnValue({ mutateAsync: loginWithGoogle, isPending: false });
  });

  it('renders login screen correctly', () => {
    const { getByText, getByPlaceholderText } = render(<LoginScreen />);
    expect(getByText('Pokémon Trainer')).toBeTruthy();
    expect(getByText('Sign in to continue your journey!')).toBeTruthy();
    expect(getByPlaceholderText('trainer@pokemon.com')).toBeTruthy();
    expect(getByPlaceholderText('Your password')).toBeTruthy();
    expect(getByText('Sign In')).toBeTruthy();
  });

  it('allows user to type email and password', () => {
    const { getByTestId } = render(<LoginScreen />);
    const emailInput = getByTestId('email-input');
    const passwordInput = getByTestId('password-input');

    fireEvent.changeText(emailInput, 'test@pokemon.com');
    fireEvent.changeText(passwordInput, 'password123');

    expect(emailInput.props.value).toBe('test@pokemon.com');
    expect(passwordInput.props.value).toBe('password123');
  });

  it('calls login function on sign in button press', async () => {
    const { getByTestId } = render(<LoginScreen />);
    fireEvent.changeText(getByTestId('email-input'), 'test@pokemon.com');
    fireEvent.changeText(getByTestId('password-input'), 'password123');
    fireEvent.press(getByTestId('login-button'));

    await waitFor(() => {
      expect(loginUser).toHaveBeenCalledWith({ email: 'test@pokemon.com', password: 'password123' });
    });
  });

  it('calls Google login function on Google sign-in button press', async () => {
    const { getByTestId } = render(<LoginScreen />);
    fireEvent.press(getByTestId('google-login-button'));

    await waitFor(() => {
      expect(loginWithGoogle).toHaveBeenCalled();
    });
  });

  it('navigates to register screen on Register button press', () => {
    const { getByTestId } = render(<LoginScreen />);
    fireEvent.press(getByTestId('btn-register'));
    expect(navigation.navigate).toHaveBeenCalledWith('Register');
  });
});
