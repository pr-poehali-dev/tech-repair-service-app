import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { User, LoginCredentials, RegisterData, Session } from "@/lib/types";
import { apiService } from "@/services/api";
import { toast } from "sonner";

interface AuthContextType {
  session: Session | null;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const userData = localStorage.getItem("userData");

    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        setSession({
          user,
          token,
          isAuthenticated: true,
        });
      } catch (error) {
        console.error("Failed to parse user data:", error);
        localStorage.removeItem("authToken");
        localStorage.removeItem("userData");
      }
    }

    setLoading(false);
  }, []);

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    try {
      const response = await apiService.login(credentials);

      if (response.success && response.data) {
        const { user, token } = response.data;
        const newSession = {
          user,
          token,
          isAuthenticated: true,
        };

        setSession(newSession);
        localStorage.setItem("userData", JSON.stringify(user));
        toast.success("Успешный вход в систему");
        return true;
      } else {
        toast.error(response.error || "Ошибка входа");
        return false;
      }
    } catch (error) {
      toast.error("Ошибка сети");
      return false;
    }
  };

  const register = async (data: RegisterData): Promise<boolean> => {
    try {
      const response = await apiService.register(data);

      if (response.success) {
        toast.success("Регистрация успешна! Теперь можете войти в систему");
        return true;
      } else {
        toast.error(response.error || "Ошибка регистрации");
        return false;
      }
    } catch (error) {
      toast.error("Ошибка сети");
      return false;
    }
  };

  const logout = () => {
    setSession(null);
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    apiService.logout();
    toast.success("Выход выполнен");
  };

  return (
    <AuthContext.Provider value={{ session, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
