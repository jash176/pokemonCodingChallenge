import { useMutation } from "@tanstack/react-query";
import { Alert } from "react-native";
import { authApi } from "../api/auth";
import { useAuth } from "../contexts/auth";
import { NotificationService } from "../services/NotificationService";
import { StorageUtils } from "../utils/storage";
export const useGoogleLogin = () => {
  const {login} = useAuth()
    return useMutation( {
      mutationFn: authApi.googleLogin,
      onSuccess: async (data) => {
        login(data.user);
        const token = await NotificationService.getFcmToken();
        StorageUtils.setItem("fcmtoken", token);
      },
      onError: (error: any) => {
        Alert.alert(error.message);
    },
    });
  };