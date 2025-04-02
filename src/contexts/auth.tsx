import { createContext, useContext, useState, useEffect } from "react";
import { setAuthToken } from "../api/queryClient";
import { StorageUtils } from "../utils/storage";
import { FirebaseAuthTypes } from "@react-native-firebase/auth";

interface AuthContextType {
  isAuthenticated: boolean;
  user: FirebaseAuthTypes.User | null;
  token: string | null;
  login: ( user: FirebaseAuthTypes.User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Check MMKV storage on initial load
  useEffect(() => {
    // const storedToken = StorageUtils.getItem("token");
    const storedUser = StorageUtils.getItem("user");

    if (storedUser) {
      // setToken(storedToken);
      setUser(storedUser);
      setIsAuthenticated(true);
      // setAuthToken(storedToken); // Set token in queryClient
    }
  }, []);

  const login = ( newUser: FirebaseAuthTypes.User) => {
    // StorageUtils.setItem("token", newToken);
    StorageUtils.setItem("user", newUser);
    // setToken(newToken);
    setUser(newUser);
    setIsAuthenticated(true);
    // setAuthToken(newToken); // Set token in queryClient
  };

  const logout = () => {
    StorageUtils.removeItem("token");
    StorageUtils.removeItem("user");
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    setAuthToken(null); // Clear token in queryClient
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        token,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
