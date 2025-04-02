// screens/RegisterScreen.js
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
import { useRegisterMutation } from '../hooks/useRegisterMutation';

// Include required icons (example)
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const RegisterScreen = () => {
  const navigation = useNavigation<NavigationProp<any>>()
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const {mutateAsync: register, isPending: isLoading} = useRegisterMutation()
  const handleRegister = async () => {
    await register({
      email,
      password,
    })
  };

  const handleGoogleSignIn = () => {
    // Implement Google Sign-In logic
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
              source={{ uri: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/7.png' }}
              style={styles.logo}
            />
            <Text style={styles.title}>Become a Trainer</Text>
            <Text style={styles.subtitle}>Register to start your Pokémon journey!</Text>
          </View>

          <View style={styles.formContainer}>
            <Input
              label="Trainer Name"
              value={name}
              onChangeText={setName}
              placeholder="Ash Ketchum"
              // icon={<Icon name="account-outline" size={20} color={COLORS.gray} />}
            />

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
              placeholder="Create your secret code"
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

            <Input
              label="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirm your secret code"
              secureTextEntry={!showPassword}
              // icon={<Icon name="lock-check-outline" size={20} color={COLORS.gray} />}
            />

            <Button
              title="Register"
              onPress={handleRegister}
              loading={isLoading}
              type="secondary"
            />

            <Divider text="OR" />

            <Button
              title="Sign up with Google"
              onPress={handleGoogleSignIn}
              type="google"
              // icon={<Icon name="google" size={20} color={COLORS.dark} />}
            />
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
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