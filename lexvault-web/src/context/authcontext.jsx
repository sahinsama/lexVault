import { createContext, useContext, useEffect, useState } from "react";
import supabase from "../config/supabase.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // profil satırı yoksa ve auth metadata'sında kullanıcı adı varsa
  // (email+şifre ile kayıt olup sonradan onaylayan kullanıcılar için),
  // oturum kurulduğu anda otomatik profil oluşturur.
  async function loadProfile(currentUser) {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", currentUser.id)
      .maybeSingle();

    if (data) {
      setProfile(data);
      return;
    }

    const meta = currentUser.user_metadata || {};

    if (meta.username) {
      const { data: created } = await supabase
        .from("profiles")
        .upsert({
          id: currentUser.id,
          username: meta.username,
          native_language: meta.native_language,
        })
        .select()
        .maybeSingle();

      setProfile(created || null);
      return;
    }

    setProfile(null);
  }

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      const currentUser = data.session?.user || null;
      setUser(currentUser);

      if (currentUser) await loadProfile(currentUser);

      setIsLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const currentUser = session?.user || null;
        setUser(currentUser);

        if (currentUser) {
          await loadProfile(currentUser);
        } else {
          setProfile(null);
        }
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  async function signUp(email, password, nativeLanguage, username) {
    // profili hemen yazmıyoruz — email doğrulaması açıkken henüz
    // oturum yok, RLS reddeder. bilgiyi metadata'ya koyup, gerçek
    // ilk girişte loadProfile otomatik oluşturuyor.
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
          native_language: nativeLanguage,
        },
      },
    });

    if (error) throw error;

    if (data.session && data.user) {
      // email doğrulaması kapalıysa oturum hemen kuruluyor,
      // o durumda profili şimdi oluşturabiliriz.
      await loadProfile(data.user);
    }

    return data;
  }

  async function signIn(email, password) {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
  }

  async function signInWithGoogle() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/app`,
      },
    });

    if (error) throw error;
  }

  async function completeProfile(username, nativeLanguage) {
    if (!user) throw new Error("giriş yapmamışsın");

    const { error } = await supabase.from("profiles").upsert({
      id: user.id,
      username,
      native_language: nativeLanguage,
    });

    if (error) throw error;

    await loadProfile(user);
  }

  async function signOut() {
    await supabase.auth.signOut();
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isLoading,
        signUp,
        signIn,
        signInWithGoogle,
        completeProfile,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}