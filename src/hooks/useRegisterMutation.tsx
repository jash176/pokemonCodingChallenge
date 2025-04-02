import { NavigationProp, useNavigation } from "@react-navigation/native";
import { useMutation } from "@tanstack/react-query";
import { Alert } from "react-native";
import { authApi } from "../api/auth";
import { useAuth } from "../contexts/auth";

export const useRegisterMutation = () => {
    const {login} = useAuth()
    // const navigation = useNavigation<NavigationProp<any>>();
    return useMutation({
        mutationFn: authApi.register,
        onSuccess: (data) => {
            login(data.user)
            // navigation.navigate("Home");
        },
        onError: (error: any) => {
            Alert.alert(error.message);
        },
    });
}