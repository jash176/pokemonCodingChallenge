// screens/LoginScreen.js
import React, { useState } from 'react';
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
import { COLORS, SPACING, FONT_SIZES, SHADOWS, BORDER_RADIUS } from '../utils/theme';
import Button from '../components/Button';
import Input from '../components/Input';
import Divider from '../components/Divider';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { useLoginMutation } from '../hooks/useLogin';
import { useGoogleLogin } from '../hooks/useGoogleLogin';

// Include required icons (example)
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const LoginScreen = () => {
  const navigation = useNavigation<NavigationProp<any>>()
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { mutateAsync: loginUser, isPending } = useLoginMutation();
  const { mutateAsync: loginWithGoogle, isPending: isLoading } = useGoogleLogin();
  const handleLogin = async () => {
    await loginUser({
      email,
      password,
    })
  };

  const handleGoogleSignIn = async () => {
    await loginWithGoogle();
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Image
              source={{ uri: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png' }}
              style={styles.logo}
            />
            <Text style={styles.title}>Pokémon Trainer</Text>
            <Text style={styles.subtitle}>Sign in to continue your journey!</Text>
          </View>

          <View style={styles.formContainer}>
            <Input
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="trainer@pokemon.com"
              keyboardType="email-address"
              autoCapitalize="none"
            // icon={<Icon name="email-outline" size={20} color={COLORS.gray} />}
            />

            <Input
              label="Password"
              value={password}
              onChangeText={setPassword}
              placeholder="Your secret code"
              secureTextEntry={!showPassword}
            // icon={<Icon name="lock-outline" size={20} color={COLORS.gray} />}
            // rightIcon={
            //   <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            //     <Icon
            //       name={showPassword ? 'eye-off-outline' : 'eye-outline'}
            //       size={20}
            //       color={COLORS.gray}
            //     />
            //   </TouchableOpacity>
            // }
            />

            <TouchableOpacity style={styles.forgotPassword}>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            <Button
              title="Sign In"
              onPress={handleLogin}
              loading={isPending}
              disabled={isLoading}
            />

            <Divider text="OR" />

            <Button
              title="Sign in with Google"
              onPress={handleGoogleSignIn}
              type="google"
              loading={isLoading}
              disabled={isPending}
            // icon={<Icon name="google" size={20} color={COLORS.dark} />}
            />
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.registerText}>Register</Text>
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
    color: COLORS.primary,
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
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: SPACING.m,
  },
  forgotPasswordText: {
    color: COLORS.accent,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: SPACING.m,
  },
  footerText: {
    color: COLORS.gray,
  },
  registerText: {
    color: COLORS.primary,
    fontWeight: 'bold',
    marginLeft: SPACING.xs,
  },
});

export default LoginScreen;