import { useMutation } from "@tanstack/react-query";
import { Alert } from "react-native";
import { authApi } from "../api/auth";
import { useAuth } from "../contexts/auth";
export const useGoogleLogin = () => {
  const {login} = useAuth()
    return useMutation( {
      mutationFn: authApi.googleLogin,
      onSuccess: (data) => {
        login(data.user)
      },
      onError: (error: any) => {
        Alert.alert(error.message);
    },
    });
  };