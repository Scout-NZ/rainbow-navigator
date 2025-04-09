
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { v4 as uuidv4 } from 'uuid';

type UserProfileType = {
  id: string;
  name: string | null;
  username: string | null;
  imageUrl: string | null;
  pronouns: string | null;
  bio: string | null;
  location: string | null;
};

interface UserProfileContextType {
  userProfile: UserProfileType | null;
  loading: boolean;
  updateProfile: (updates: Partial<UserProfileType>) => Promise<void>;
  uploadProfileImage: (file: File) => Promise<string | null>;
  error: string | null;
}

const UserProfileContext = createContext<UserProfileContextType | null>(null);

export const UserProfileProvider = ({ children }: { children: ReactNode }) => {
  const [userProfile, setUserProfile] = useState<UserProfileType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Listen for authentication state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        if (session?.user) {
          await fetchUserProfile(session.user.id);
        }
      } else if (event === 'SIGNED_OUT') {
        setUserProfile(null);
      }
    });

    // Get initial session
    const initializeUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          await fetchUserProfile(session.user.id);
        }
      } catch (err) {
        console.error('Error getting auth session:', err);
        setError('Failed to initialize user session');
      } finally {
        setLoading(false);
      }
    };

    initializeUser();

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      setLoading(true);

      // Get user profile from profiles table
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        setError('Failed to fetch user profile');
        return;
      }

      if (data) {
        setUserProfile({
          id: userId,
          name: data.name,
          username: data.username,
          imageUrl: data.imageurl,
          pronouns: data.pronouns,
          bio: data.bio,
          location: data.location
        });
      }
    } catch (err) {
      console.error('Unexpected error fetching profile:', err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const uploadProfileImage = async (file: File): Promise<string | null> => {
    try {
      if (!userProfile?.id) {
        throw new Error('User not authenticated');
      }

      // Create a unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `profile_images/${userProfile.id}/${fileName}`;

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (error) {
        throw error;
      }

      // Get public URL for the uploaded file
      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      return urlData.publicUrl;
    } catch (err) {
      console.error('Error uploading image:', err);
      toast({
        title: 'Upload failed',
        description: 'Failed to upload profile image',
        variant: 'destructive'
      });
      return null;
    }
  };

  const updateProfile = async (updates: Partial<UserProfileType>) => {
    try {
      if (!userProfile?.id) {
        throw new Error('User not authenticated');
      }

      // Update the profile in Supabase
      const { error } = await supabase
        .from('profiles')
        .update({
          name: updates.name ?? userProfile.name,
          username: updates.username ?? userProfile.username,
          imageurl: updates.imageUrl ?? userProfile.imageUrl,
          pronouns: updates.pronouns ?? userProfile.pronouns,
          bio: updates.bio ?? userProfile.bio,
          location: updates.location ?? userProfile.location
        })
        .eq('id', userProfile.id);

      if (error) {
        throw error;
      }

      // Update local state
      setUserProfile({
        ...userProfile,
        ...updates
      });

      toast({
        title: 'Profile updated',
        description: 'Your profile has been updated successfully',
      });
    } catch (err) {
      console.error('Error updating profile:', err);
      toast({
        title: 'Update failed',
        description: 'Failed to update profile',
        variant: 'destructive'
      });
    }
  };

  const contextValue: UserProfileContextType = {
    userProfile,
    loading,
    updateProfile,
    uploadProfileImage,
    error
  };

  return (
    <UserProfileContext.Provider value={contextValue}>
      {children}
    </UserProfileContext.Provider>
  );
};

export const useUserProfile = () => {
  const context = useContext(UserProfileContext);
  if (!context) {
    throw new Error('useUserProfile must be used within a UserProfileProvider');
  }
  return context;
};
