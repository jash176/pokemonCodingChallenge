import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterBody {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: FirebaseAuthTypes.User;
}

export interface RegisterResponse {
  user: FirebaseAuthTypes.User;
}

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const { email, password } = credentials;
    const response = await auth().signInWithEmailAndPassword(email, password);
    return response
  },
  register: async (credentials: RegisterBody): Promise<RegisterResponse> => {
    const { email, password } = credentials;
    const response = await auth().createUserWithEmailAndPassword(email, password);
    return response
  },
  googleLogin: async (): Promise<LoginResponse> => {
    await GoogleSignin.hasPlayServices();
    const signInResult = await GoogleSignin.signIn();
    const idToken = signInResult.data?.idToken;
    if (!idToken) {
      throw new Error('No ID token found');
    }
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);
    return  auth().signInWithCredential(googleCredential)
  },
};
