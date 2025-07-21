'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase/client';
import { User as AppUser } from '@/types';
import axios from 'axios';
import { config } from '@/lib/config';

interface AuthContextType {
  user: User | null;
  profile: AppUser | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<AppUser>) => Promise<void>;
  getAuthLevel: () => Promise<{ currentAuthLevel: 'aal0' | 'aal1' | 'aal2' | null; requiredAuthLevel: 'aal1' | 'aal2' | null; error: Error | null }>;
  getUser: () => Promise<any>;
  version: number;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<AppUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [version, setVersion] = useState<number>(0);

  // Debug: Check if Supabase is configured
  useEffect(() => {
    // Add a timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      console.warn('Auth loading timeout - setting loading to false');
      setLoading(false);
    }, 10000); // 10 second timeout

    // Get initial session
    supabase.auth
      .getSession()
      .then(async ({ data: { session } }) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          await fetchProfile(session.user.id);
        }
        setLoading(false);
        setVersion(v => v + 1); // Increment version on initial session
        clearTimeout(timeout);
      })
      .catch(error => {
        setLoading(false);
        clearTimeout(timeout);
      });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (event === 'SIGNED_IN' && session?.user) {
        await fetchProfile(session.user.id);
      } else if (event === 'SIGNED_OUT') {
        setProfile(null);
      }

      setLoading(false);
      setVersion(v => v + 1); // Increment version on auth state change
    });

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_APP_URL}/api/profile/${userId}`);
      if (res.data && res.data.user) {
        setProfile(res.data.user);
      } else {
        setProfile(null);
      }
    } catch (error: any) {
      console.error('Error fetching profile:', error);
      setProfile(null);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { error };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        return { error };
      }

      // Profile will be created automatically by the database trigger
      // No need to manually create profile here

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const updateProfile = async (updates: Partial<AppUser>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase.from('profiles').update(updates).eq('id', user.id).select().single();

      if (error) {
        console.error('Error updating profile:', error);
        return;
      }

      setProfile(data);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const getAuthLevel = async () => {
    if (!user) return { currentAuthLevel: 'aal0' as const, requiredAuthLevel: null, error: null };

    try {
      const { data, error } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();

      if (error) {
        return { currentAuthLevel: null, requiredAuthLevel: null, error: error };
      }

      return { currentAuthLevel: data.currentLevel as 'aal0' | 'aal1' | 'aal2', requiredAuthLevel: data.nextLevel as 'aal1' | 'aal2', error: null };
    } catch (error) {
      return { currentAuthLevel: null, requiredAuthLevel: null, error: error as Error };
    }
  };

  const getUser = async () => {
    try {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        return null;
      }
      return data.user;
    } catch (error) {
      return null;
    }
  };

  const value = {
    user,
    profile,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
    getAuthLevel,
    getUser,
    version,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
