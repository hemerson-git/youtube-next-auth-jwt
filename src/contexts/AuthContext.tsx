import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

import Router from "next/router";

import { setCookie, parseCookies } from "nookies";

import { recoverUserInformation, signInRequest } from "../services/auth";
import api from "../services/api";

type UserProps = {
  name: string;
  email: string;
  avatar_url: string;
};

type SignInData = {
  email: string;
  password: string;
};

type AuthContextType = {
  isAuthenticated: boolean;
  user: UserProps;
  signIn: (data: SignInData) => Promise<void>;
};

type AuthContextProviderProps = {
  children: ReactNode;
};

export const AuthContext = createContext({} as AuthContextType);

export function AuthProvider({ children }: AuthContextProviderProps) {
  const [user, setUser] = useState<UserProps | null>(null);

  const isAuthenticated = !!user;

  useEffect(() => {
    const { "nextauth.token": token } = parseCookies();

    if (token) {
      // IIFE

      (async () => {
        const { user } = await recoverUserInformation(token);
        setUser(user);
      })();
    }
  }, []);

  async function signIn(data: SignInData) {
    const { email, password } = data;

    const { token, user } = await signInRequest({
      email,
      password,
    });

    setCookie(undefined, "nextauth.token", token, {
      maxAge: 60 * 60 * 1, // 1 Hora
    });

    api.defaults.headers["Authorization"] = `Bearer ${token}`;

    setUser(user);

    Router.push("/dashboard");
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, signIn, user }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuthContext = () => {
  return useContext(AuthContext);
};
