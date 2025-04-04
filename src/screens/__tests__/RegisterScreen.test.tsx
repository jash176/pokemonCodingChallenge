import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import RegisterScreen from '../RegisterScreen';
import { useNavigation } from '@react-navigation/native';
import { useRegisterMutation } from '../../hooks/useRegisterMutation';
import { useGoogleLogin } from '../../hooks/useGoogleLogin';

// Mock the icon components
jest.mock('../../assets/icons/EmailOutline', () => 'EmailOutline');
jest.mock('../../assets/icons/EyeOffOutline', () => 'EyeOffOutline');
jest.mock('../../assets/icons/EyeOutline', () => 'EyeOutline');
jest.mock('../../assets/icons/LockOutline', () => 'LockOutline');
jest.mock('../../assets/icons/AccountOutline', () => 'AccountOutline');
jest.mock('../../assets/icons/GoogleIcon', () => 'GoogleIcon');

// Mock the navigation and hooks
jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
}));

jest.mock('../../hooks/useRegisterMutation', () => ({
  useRegisterMutation: jest.fn(),
}));

jest.mock('../../hooks/useGoogleLogin', () => ({
  useGoogleLogin: jest.fn(),
}));

describe('RegisterScreen', () => {
  // Set up properly typed mocks
  let mockNavigate: jest.Mock;
  let registerMock: jest.Mock;
  let googleLoginMock: jest.Mock;

  beforeEach(() => {
    mockNavigate = jest.fn();
    (useNavigation as jest.Mock).mockReturnValue({ 
      navigate: mockNavigate 
    });
    
    registerMock = jest.fn();
    (useRegisterMutation as jest.Mock).mockReturnValue({ 
      mutateAsync: registerMock, 
      isPending: false 
    });
    
    googleLoginMock = jest.fn();
    (useGoogleLogin as jest.Mock).mockReturnValue({ 
      mutateAsync: googleLoginMock, 
      isPending: false 
    });
  });

  it('renders register screen correctly', () => {
    const { getByText, getByTestId } = render(<RegisterScreen />);
    
    expect(getByText('Become a Trainer')).toBeTruthy();
    expect(getByText('Register to start your Pokémon journey!')).toBeTruthy();
    expect(getByTestId('email-input')).toBeTruthy();
    expect(getByTestId('password-input')).toBeTruthy();
    expect(getByTestId('confirm-password-input')).toBeTruthy();
    expect(getByTestId('register-button')).toBeTruthy();
    expect(getByTestId('google-login-button')).toBeTruthy();
  });

  it('allows user to input registration details', () => {
    const { getByTestId } = render(<RegisterScreen />);
    
    const emailInput = getByTestId('email-input');
    const passwordInput = getByTestId('password-input');
    const confirmPasswordInput = getByTestId('confirm-password-input');
    
    fireEvent.changeText(emailInput, 'ash@pokemon.com');
    fireEvent.changeText(passwordInput, 'pikachu123');
    fireEvent.changeText(confirmPasswordInput, 'pikachu123');
    
    expect(emailInput.props.value).toBe('ash@pokemon.com');
    expect(passwordInput.props.value).toBe('pikachu123');
    expect(confirmPasswordInput.props.value).toBe('pikachu123');
  });

  it('calls register function when Register button is pressed', async () => {
    const { getByTestId } = render(<RegisterScreen />);
    
    // Fill in the form
    fireEvent.changeText(getByTestId('email-input'), 'ash@pokemon.com');
    fireEvent.changeText(getByTestId('password-input'), 'pikachu123');
    
    // Press the Register button
    fireEvent.press(getByTestId('register-button'));
    
    // Check if register function was called with correct arguments
    await waitFor(() => {
      expect(registerMock).toHaveBeenCalledWith({
        email: 'ash@pokemon.com',
        password: 'pikachu123',
      });
    });
  });

  it('calls Google login function when Google sign-up button is pressed', async () => {
    const { getByTestId } = render(<RegisterScreen />);
    
    // Press the Google sign-up button
    fireEvent.press(getByTestId('google-login-button'));
    
    // Check if Google login function was called
    await waitFor(() => {
      expect(googleLoginMock).toHaveBeenCalled();
    });
  });

  it('navigates to Login screen when Sign In link is pressed', () => {
    const { getByTestId } = render(<RegisterScreen />);
    
    // Press the Sign In link
    fireEvent.press(getByTestId('btn-login'));
    
    // Check if navigation was called with correct screen
    expect(mockNavigate).toHaveBeenCalledWith('Login');
  });
});