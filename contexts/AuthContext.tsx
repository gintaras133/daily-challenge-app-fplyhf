
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/app/integrations/supabase/client';

interface UserProfile {
  id: string;
  full_name?: string;
  age?: number;
  username?: string;
  country?: string;
  town?: string;
  telephone_number?: string;
  onboarding_completed: boolean;
  profile_photo_url?: string;
  facebook_url?: string;
  instagram_url?: string;
  tiktok_url?: string;
  linkedin_url?: string;
}

interface AuthContextType {
  session: Session | null;
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  profileChecked: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  userProfile: null,
  loading: true,
  profileChecked: false,
  signOut: async () => {},
  refreshProfile: async () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileChecked, setProfileChecked] = useState(false);

  const fetchUserProfile = async (userId: string) => {
    try {
      console.log('Fetching user profile for userId:', userId);
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.log('No profile found or error fetching profile:', error.message);
        setUserProfile(null);
        setProfileChecked(true);
        return;
      }

      console.log('User profile fetched successfully:', data);
      setUserProfile(data);
      setProfileChecked(true);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setUserProfile(null);
      setProfileChecked(true);
    }
  };

  const refreshProfile = async () => {
    if (user) {
      console.log('Refreshing profile for user:', user.id);
      setProfileChecked(false);
      await fetchUserProfile(user.id);
    }
  };

  useEffect(() => {
    console.log('AuthProvider: Initializing...');
    
    // Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('Error getting initial session:', error);
      }
      
      console.log('Initial session retrieved:', !!session);
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchUserProfile(session.user.id).finally(() => {
          console.log('Initial profile fetch complete, setting loading to false');
          setLoading(false);
        });
      } else {
        console.log('No session found, setting loading to false');
        setLoading(false);
        setProfileChecked(true);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, 'Session exists:', !!session);
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          setProfileChecked(false);
          await fetchUserProfile(session.user.id);
        } else {
          setUserProfile(null);
          setProfileChecked(true);
        }
        
        setLoading(false);
      }
    );

    return () => {
      console.log('AuthProvider: Cleaning up subscription');
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    console.log('Signing out user');
    await supabase.auth.signOut();
    setSession(null);
    setUser(null);
    setUserProfile(null);
    setProfileChecked(false);
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        userProfile,
        loading,
        profileChecked,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
