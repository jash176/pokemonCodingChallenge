// screens/RegisterScreen.js
import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import {
  COLORS,
  SPACING,
  FONT_SIZES,
  SHADOWS,
  BORDER_RADIUS,
} from '../utils/theme';
import Button from '../components/Button';
import Input from '../components/Input';
import Divider from '../components/Divider';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {useRegisterMutation} from '../hooks/useRegisterMutation';
import EmailOutline from '../assets/icons/EmailOutline';
import EyeOffOutline from '../assets/icons/EyeOffOutline';
import EyeOutline from '../assets/icons/EyeOutline';
import LockOutline from '../assets/icons/LockOutline';
import AccountOutline from '../assets/icons/AccountOutline';
import GoogleIcon from '../assets/icons/GoogleIcon';
import { useGoogleLogin } from '../hooks/useGoogleLogin';

// Include required icons (example)
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const RegisterScreen = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const {mutateAsync: register, isPending: isLoading} = useRegisterMutation();
  const {mutateAsync: loginWithGoogle, isPending: isLoadingGoogle} = useGoogleLogin();
  const handleRegister = async () => {
    await register({
      email,
      password,
    });
  };

  const handleGoogleSignIn = async () => {
    await loginWithGoogle();
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Image
              source={{
                uri: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/7.png',
              }}
              style={styles.logo}
            />
            <Text style={styles.title}>Become a Trainer</Text>
            <Text style={styles.subtitle}>
              Register to start your Pokémon journey!
            </Text>
          </View>

          <View style={styles.formContainer}>
            <Input
              testID='name-input'
              label="Trainer Name"
              value={name}
              onChangeText={setName}
              placeholder="Ash Ketchum"
              icon={<AccountOutline />}
            />

            <Input
              testID='email-input'
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="trainer@pokemon.com"
              keyboardType="email-address"
              autoCapitalize="none"
              icon={<EmailOutline />}
            />

            <Input
              testID='password-input'
              label="Password"
              value={password}
              onChangeText={setPassword}
              placeholder="Create your password"
              secureTextEntry={!showPassword}
              icon={<LockOutline />}
              rightIcon={
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOffOutline /> : <EyeOutline />}
                </TouchableOpacity>
              }
            />

            <Input
              testID='confirm-password-input'
              label="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirm your password"
              secureTextEntry={!showPassword}
              icon={<LockOutline />}
            />

            <Button
              testID='register-button'
              title="Register"
              onPress={handleRegister}
              loading={isLoading}
              type="secondary"
            />

            <Divider text="OR" />

            <Button
              testID='google-login-button'
              title="Sign up with Google"
              onPress={handleGoogleSignIn}
              type="google"
              icon={<GoogleIcon />}
            />
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account?</Text>
            <TouchableOpacity testID='btn-login' onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginText}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.light,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: SPACING.l,
  },
  header: {
    alignItems: 'center',
    marginVertical: SPACING.xl,
  },
  logo: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
  },
  title: {
    fontSize: FONT_SIZES.title,
    fontWeight: 'bold',
    color: COLORS.secondary,
    marginTop: SPACING.m,
  },
  subtitle: {
    color: COLORS.gray,
    fontSize: FONT_SIZES.medium,
    marginTop: SPACING.s,
  },
  formContainer: {
    ...SHADOWS.medium,
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.large,
    padding: SPACING.l,
    marginBottom: SPACING.l,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: SPACING.m,
  },
  footerText: {
    color: COLORS.gray,
  },
  loginText: {
    color: COLORS.secondary,
    fontWeight: 'bold',
    marginLeft: SPACING.xs,
  },
});

export default RegisterScreen;
