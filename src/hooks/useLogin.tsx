import { NavigationProp, useNavigation } from "@react-navigation/native";
import { useMutation } from "@tanstack/react-query";
import { Alert } from "react-native";
import { authApi } from "../api/auth";
import { useAuth } from "../contexts/auth";
import { NotificationService } from "../services/NotificationService";
import { StorageUtils } from "../utils/storage";

export const useLoginMutation = () => {
    const {login} = useAuth()
    // const navigation = useNavigation<NavigationProp<any>>();
    return useMutation({
        mutationFn: authApi.login,
        onSuccess: async (data) => {
            login(data.user)
            const token = await NotificationService.getFcmToken();
            console.log(token)
            StorageUtils.setItem("fcmtoken", token);
            // navigation.navigate("Home");
        },
        onError: (error: any) => {
            Alert.alert(error.message);
        },
    });
}