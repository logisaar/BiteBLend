import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (name: string, phone: string, password: string) => Promise<{ error: any }>;
  signIn: (phone: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (name: string, phone: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: `${phone}@restaurant.local`,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            name,
            phone
          }
        }
      });

      if (error) return { error };

      // Create profile and track visit
      if (data.user) {
        await supabase.from('profiles').insert({
          id: data.user.id,
          name,
          phone
        });

        await supabase.from('site_visits').insert({
          user_id: data.user.id
        });
      }

      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const signIn = async (phone: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: `${phone}@restaurant.local`,
      password,
    });

    // Track visit on login
    if (data.user && !error) {
      await supabase.from('site_visits').insert({
        user_id: data.user.id
      });
    }

    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
